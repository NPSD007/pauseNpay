from pydantic import BaseModel


class BehavioralPayload(BaseModel):
    time_of_day: str
    day_of_week: str
    app_sequence: str
    social_screen_time_mins: int
    daily_spend_ratio: float
    erratic_usage_score: float
