from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

EXPLAINER = None
FEATURE_NAMES = []
ENCODERS = {}


def humanize_feature_value(feature_name: str, value) -> str:
    if feature_name in ENCODERS:
        encoder = ENCODERS[feature_name]
        safe_value = int(round(float(value)))
        safe_value = int(np.clip(safe_value, 0, len(encoder.classes_) - 1))
        return str(encoder.inverse_transform([safe_value])[0])

    if feature_name == "social_screen_time_mins":
        return str(int(round(float(value))))

    if feature_name in {"daily_spend_ratio", "erratic_usage_score"}:
        return f"{float(value):.2f}"

    return str(value)


def _extract_shap_row(shap_values) -> np.ndarray:
    if isinstance(shap_values, list):
        # Binary classifier list output: [class_0, class_1]
        return np.asarray(shap_values[1][0], dtype=float)

    shap_array = np.asarray(shap_values)

    if shap_array.ndim == 3:
        # Shape like (n_samples, n_features, n_classes)
        return shap_array[0, :, 1].astype(float)

    if shap_array.ndim == 2:
        # Shape like (n_samples, n_features)
        return shap_array[0].astype(float)

    raise ValueError("Unexpected SHAP output shape.")


def generate_trigger_explanation(row_features) -> str:
    if EXPLAINER is None or not FEATURE_NAMES:
        raise RuntimeError("Explainer is not initialized. Train the model first.")

    if isinstance(row_features, pd.Series):
        row_series = row_features.reindex(FEATURE_NAMES)
    elif isinstance(row_features, dict):
        row_series = pd.Series(row_features).reindex(FEATURE_NAMES)
    else:
        row_series = pd.Series(np.asarray(row_features).flatten(), index=FEATURE_NAMES)

    if row_series.isnull().any():
        missing_cols = row_series[row_series.isnull()].index.tolist()
        raise ValueError(f"Missing feature values for: {missing_cols}")

    row_df = pd.DataFrame([row_series.values], columns=FEATURE_NAMES)
    shap_values = EXPLAINER.shap_values(row_df)
    shap_row = _extract_shap_row(shap_values)

    positive_indices = np.where(shap_row > 0)[0]

    if len(positive_indices) > 0:
        ranked_indices = positive_indices[np.argsort(shap_row[positive_indices])[::-1]]
        top_indices = ranked_indices[:2]
    else:
        # Fallback if no positive contributors exist for this row.
        top_indices = np.argsort(shap_row)[::-1][:2]

    reasons = []
    for idx in top_indices:
        feature_name = FEATURE_NAMES[idx]
        raw_value = row_df.iloc[0, idx]
        human_value = humanize_feature_value(feature_name, raw_value)
        reasons.append(f"{feature_name} is {human_value}")

    if not reasons:
        return "Your impulse risk appears low because no strong positive triggers were detected."

    if len(reasons) == 1:
        return f"Your impulse risk is high because {reasons[0]}."

    return f"Your impulse risk is high because {reasons[0]} and {reasons[1]}."


def main() -> None:
    global EXPLAINER, FEATURE_NAMES, ENCODERS

    base_dir = Path(__file__).resolve().parent
    csv_path = base_dir / "synthetic_behavior.csv"

    df = pd.read_csv(csv_path)
    df = df.drop(columns=["timestamp"])

    categorical_columns = ["time_of_day", "day_of_week", "app_sequence"]

    encoders = {}
    for col in categorical_columns:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col].astype(str))
        encoders[col] = encoder

    X = df.drop(columns=["is_impulse_buy"])
    y = df["is_impulse_buy"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Accuracy: {accuracy:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, digits=4))

    model_path = base_dir / "xgboost_model.json"
    model.save_model(model_path)

    # Persist fitted LabelEncoders for backend reuse.
    encoders_path = base_dir / "label_encoders.pkl"
    joblib.dump(encoders, encoders_path)

    EXPLAINER = shap.TreeExplainer(model)
    FEATURE_NAMES = X.columns.tolist()
    ENCODERS = joblib.load(encoders_path)

    test_probs = model.predict_proba(X_test)[:, 1]
    top_idx = int(np.argmax(test_probs))
    top_row = X_test.iloc[top_idx]
    top_prob = float(test_probs[top_idx])

    explanation = generate_trigger_explanation(top_row)

    print(f"Highest predicted impulse-buy probability in test set: {top_prob:.4f}")
    print("Generated trigger explanation:")
    print(explanation)


if __name__ == "__main__":
    main()
