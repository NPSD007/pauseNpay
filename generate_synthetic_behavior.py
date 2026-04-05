import numpy as np
import pandas as pd
from pathlib import Path


def assign_time_of_day(hour: int) -> str:
    if 5 <= hour < 12:
        return "Morning"
    if 12 <= hour < 17:
        return "Afternoon"
    if 17 <= hour < 22:
        return "Evening"
    return "Late Night"


def build_app_sequence(time_of_day: str, rng: np.random.Generator) -> str:
    first_apps = ["WhatsApp", "Instagram", "YouTube", "Spotify", "Chrome", "Telegram"]
    first = rng.choice(first_apps)

    if time_of_day == "Late Night":
        second_apps = ["Amazon", "Zomato", "Myntra", "Instagram", "YouTube", "Spotify"]
        probs = np.array([0.23, 0.22, 0.18, 0.15, 0.12, 0.10])
    elif time_of_day == "Evening":
        second_apps = ["Instagram", "YouTube", "Spotify", "Amazon", "Zomato", "Myntra"]
        probs = np.array([0.28, 0.25, 0.20, 0.10, 0.10, 0.07])
    else:
        second_apps = ["Instagram", "YouTube", "WhatsApp", "Spotify", "Amazon", "Zomato", "Myntra"]
        probs = np.array([0.30, 0.24, 0.16, 0.14, 0.07, 0.05, 0.04])

    second = rng.choice(second_apps, p=probs)
    return f"{first}->{second}"


def generate_dataset(rows: int = 5000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    end_ts = pd.Timestamp.now().floor("s")
    start_ts = end_ts - pd.Timedelta(days=90)

    random_seconds = rng.integers(0, int((end_ts - start_ts).total_seconds()), size=rows)
    timestamps = pd.to_datetime(start_ts + pd.to_timedelta(random_seconds, unit="s"))

    df = pd.DataFrame({"timestamp": timestamps}).sort_values("timestamp").reset_index(drop=True)

    df["time_of_day"] = df["timestamp"].dt.hour.map(assign_time_of_day)
    df["time_of_day"] = pd.Categorical(
        df["time_of_day"],
        categories=["Morning", "Afternoon", "Evening", "Late Night"],
        ordered=False,
    )

    df["day_of_week"] = df["timestamp"].dt.day_name().astype(str)

    df["app_sequence"] = [build_app_sequence(tod, rng) for tod in df["time_of_day"].astype(str)]

    social_means = {
        "Morning": 30,
        "Afternoon": 40,
        "Evening": 50,
        "Late Night": 62,
    }
    social_std = 16
    social_values = [
        int(np.clip(np.round(rng.normal(social_means[tod], social_std)), 0, 120))
        for tod in df["time_of_day"].astype(str)
    ]
    df["social_screen_time_mins"] = np.array(social_values, dtype=int)

    base_spend_ratio = rng.lognormal(mean=0.08, sigma=0.38, size=rows)
    night_multiplier = np.where(df["time_of_day"].astype(str) == "Late Night", 1.10, 1.0)
    spend_ratio = np.clip(base_spend_ratio * night_multiplier, 0.5, 3.0)
    df["daily_spend_ratio"] = np.round(spend_ratio, 3)

    erratic_base = rng.beta(2.2, 2.4, size=rows) * 10
    erratic_boost = np.where(df["time_of_day"].astype(str) == "Late Night", 0.9, 0.0)
    erratic = np.clip(erratic_base + erratic_boost, 0.0, 10.0)
    df["erratic_usage_score"] = np.round(erratic, 3)

    shopping_food_apps = {"Amazon", "Zomato", "Myntra"}
    ends_in_shopping_or_food = df["app_sequence"].str.split("->").str[-1].isin(shopping_food_apps)
    is_late_night = df["time_of_day"].astype(str).eq("Late Night")
    high_social_time = df["social_screen_time_mins"].gt(45)

    key_condition = is_late_night & ends_in_shopping_or_food & high_social_time

    impulse_prob = np.full(rows, 0.05)
    impulse_prob = np.where(is_late_night & ends_in_shopping_or_food, 0.28, impulse_prob)
    impulse_prob = np.where(is_late_night & high_social_time, 0.18, impulse_prob)
    impulse_prob = np.where(ends_in_shopping_or_food & high_social_time, 0.22, impulse_prob)
    impulse_prob = np.where(key_condition, 0.82, impulse_prob)

    spend_effect = np.clip((df["daily_spend_ratio"] - 1.2) / 1.8, 0, 1) * 0.08
    erratic_effect = np.clip((df["erratic_usage_score"] - 6.0) / 4.0, 0, 1) * 0.05
    impulse_prob = np.clip(impulse_prob + spend_effect + erratic_effect, 0.01, 0.95)

    df["is_impulse_buy"] = (rng.random(rows) < impulse_prob).astype(int)

    df["social_screen_time_mins"] = df["social_screen_time_mins"].astype(int)
    df["is_impulse_buy"] = df["is_impulse_buy"].astype(int)

    return df[
        [
            "timestamp",
            "time_of_day",
            "day_of_week",
            "app_sequence",
            "social_screen_time_mins",
            "daily_spend_ratio",
            "erratic_usage_score",
            "is_impulse_buy",
        ]
    ]


def main() -> None:
    df = generate_dataset(rows=5000, seed=42)

    output_path = Path(__file__).resolve().parent / "synthetic_behavior.csv"
    df.to_csv(output_path, index=False)

    print("First 5 rows:")
    print(df.head(5))

    print("\nTarget value counts (is_impulse_buy):")
    print(df["is_impulse_buy"].value_counts())


if __name__ == "__main__":
    main()
