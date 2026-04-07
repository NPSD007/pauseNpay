from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
import xgboost as xgb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import BehavioralPayload
from pydantic import BaseModel

class PredictImpulseRequest(BaseModel):
    transaction_id: str
    user_id: str
    amount: float
    merchant_name: str
    category: str
    timestamp: str
    app_usage_minutes: int
    app_switch_count: int
    tx_frequency_last_hour: int
    is_late_night: bool
    days_since_last_purchase: int

BASE_DIR = Path(__file__).resolve().parent

MODEL = xgb.XGBClassifier()
MODEL.load_model(str(BASE_DIR / "xgboost_model.json"))
LABEL_ENCODERS = joblib.load(BASE_DIR / "label_encoders.pkl")
EXPLAINER = shap.TreeExplainer(MODEL)

CATEGORICAL_COLUMNS = ["time_of_day", "day_of_week", "app_sequence"]
FEATURE_COLUMNS = [
    "time_of_day",
    "day_of_week",
    "app_sequence",
    "social_screen_time_mins",
    "daily_spend_ratio",
    "erratic_usage_score",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "healthy"}


@app.post("/predict_impulse")
def predict_impulse(request: PredictImpulseRequest):
    print(f"--- ML INFERENCE TRIGGERED ---")
    print(f"Signals Received: Usage={request.app_usage_minutes}m, Switches={request.app_switch_count}, LateNight={request.is_late_night}")
    
    # Map the incoming React request to the XGBoost schema expected by the model
    time_of_day = "LATE_NIGHT" if request.is_late_night else "EVENING"
    day_of_week = "Friday"
    app_sequence = "Social->Shopping"
    daily_spend_ratio = request.amount / 1000.0  # mock ratio
    erratic_usage_score = request.app_switch_count / 10.0
    
    df = pd.DataFrame([{
        "time_of_day": time_of_day,
        "day_of_week": day_of_week,
        "app_sequence": app_sequence,
        "social_screen_time_mins": request.app_usage_minutes,
        "daily_spend_ratio": daily_spend_ratio,
        "erratic_usage_score": erratic_usage_score
    }])

    try:
        for col in CATEGORICAL_COLUMNS:
            encoder = LABEL_ENCODERS.get(col)
            if encoder is None:
                raise ValueError(f"Missing label encoder for column: {col}")
            df[col] = encoder.transform(df[col].astype(str))

        proba = float(MODEL.predict_proba(df)[0][1])
        return {"impulse_score": int(np.round(proba * 100))}
    except Exception as exc:
        print("Inference error:", exc)
        # fallback
        return {"impulse_score": 85}

@app.post("/api/v1/trigger")
def trigger(payload: BehavioralPayload):
    try:
        row = payload.model_dump()
        df = pd.DataFrame([row], columns=FEATURE_COLUMNS)

        for col in CATEGORICAL_COLUMNS:
            encoder = LABEL_ENCODERS.get(col)
            if encoder is None:
                raise ValueError(f"Missing label encoder for column: {col}")
            df[col] = encoder.transform(df[col].astype(str))

        proba = float(MODEL.predict_proba(df)[0][1])
        risk_score = int(np.round(proba * 100))
        requires_friction = risk_score > 65

        trigger_reason = ""
        if requires_friction:
            shap_values = EXPLAINER.shap_values(df)
            if isinstance(shap_values, list):
                shap_row = np.asarray(shap_values[1][0], dtype=float)
            else:
                shap_array = np.asarray(shap_values)
                if shap_array.ndim == 3:
                    shap_row = shap_array[0, :, 1].astype(float)
                else:
                    shap_row = shap_array[0].astype(float)

            positive_indices = np.where(shap_row > 0)[0]
            if len(positive_indices) > 0:
                ranked_indices = positive_indices[np.argsort(shap_row[positive_indices])[::-1]]
                top_indices = ranked_indices[:2]
            else:
                top_indices = np.argsort(shap_row)[::-1][:2]

            reasons = []
            for idx in top_indices:
                feature_name = FEATURE_COLUMNS[idx]
                raw_value = df.iloc[0, idx]
                if feature_name in CATEGORICAL_COLUMNS:
                    encoder = LABEL_ENCODERS[feature_name]
                    safe_value = int(np.clip(int(round(float(raw_value))), 0, len(encoder.classes_) - 1))
                    human_value = str(encoder.inverse_transform([safe_value])[0])
                elif feature_name == "social_screen_time_mins":
                    human_value = str(int(round(float(raw_value))))
                else:
                    human_value = f"{float(raw_value):.2f}"

                reasons.append(f"{feature_name} is {human_value}")

            if reasons:
                if len(reasons) == 1:
                    trigger_reason = f"Your impulse risk is high because {reasons[0]}."
                else:
                    trigger_reason = f"Your impulse risk is high because {reasons[0]} and {reasons[1]}."

        return {
            "risk_score": risk_score,
            "requires_friction": requires_friction,
            "trigger_reason": trigger_reason,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}")
