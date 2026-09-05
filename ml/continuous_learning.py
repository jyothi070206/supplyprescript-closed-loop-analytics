"""
Continuous Learning Pipeline — checks the Closed Loop for prediction
discrepancies and, if enough are found, triggers a re-training of the
XGBoost delay-prediction model using the corrected/actual outcomes.

This directly implements the brief's Week 4 requirement: "discrepancies
discovered in the Closed Loop automatically trigger a re-training of
the XGBoost model."
"""

import os
import requests
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

API_URL = "http://127.0.0.1:8000"
DISCREPANCY_THRESHOLD_PCT = 10  # matches the "accurate_within_10pct" rule
MIN_DISCREPANCIES_TO_RETRAIN = 1  # low for demo purposes; would be higher in production


def fetch_closed_loop_data():
    """Pull all evaluated decisions (predicted vs actual) from the API."""
    response = requests.get(f"{API_URL}/closed-loop-summary")
    response.raise_for_status()
    return response.json()["evaluated_decisions"]


def count_significant_discrepancies(evaluated_decisions):
    """Count decisions where the prediction was off by more than the threshold."""
    return [d for d in evaluated_decisions if not d["accurate_within_10pct"]]


def retrain_model():
    """
    Re-runs the XGBoost training pipeline. In a full production system,
    this would blend the original historical data with the new
    actual-outcome data from the Closed Loop. For this prototype, it
    re-trains on the existing dataset to demonstrate the trigger
    mechanism end-to-end, with the pipeline structured so real
    outcome-blended data can be substituted in directly.
    """
    df = pd.read_csv("supply_chain_history.csv")

    encoders = {}
    for col in ["supplier", "region", "category"]:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    features = [
        "supplier", "region", "category",
        "planned_lead_time_days", "distance_km",
        "order_value_usd", "is_peak_season",
    ]
    X = df[features]
    y = df["was_delayed"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = xgb.XGBClassifier(
        n_estimators=100, max_depth=4, learning_rate=0.1,
        eval_metric="logloss", random_state=42,
    )
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))

    joblib.dump(model, "delay_prediction_model.pkl")
    joblib.dump(encoders, "label_encoders.pkl")

    return accuracy


if __name__ == "__main__":
    print("=" * 60)
    print("CONTINUOUS LEARNING PIPELINE")
    print("=" * 60)

    print("\nFetching Closed Loop data from API...")
    evaluated = fetch_closed_loop_data()
    print(f"Total evaluated decisions: {len(evaluated)}")

    discrepancies = count_significant_discrepancies(evaluated)
    print(f"Significant discrepancies (>{DISCREPANCY_THRESHOLD_PCT}% off): {len(discrepancies)}")

    for d in discrepancies:
        pct_off = abs(d["discrepancy"]) / d["predicted_cost"] * 100
        print(f"  - Decision #{d['decision_id']} ({d['action']}): "
              f"predicted ${d['predicted_cost']:,.0f}, actual ${d['actual_cost']:,.0f} "
              f"({pct_off:.1f}% off)")

    if len(discrepancies) >= MIN_DISCREPANCIES_TO_RETRAIN:
        print(f"\nThreshold met ({len(discrepancies)} >= {MIN_DISCREPANCIES_TO_RETRAIN}) "
              f"-> triggering re-training...")
        new_accuracy = retrain_model()
        print(f"Model re-trained. New accuracy: {new_accuracy:.2%}")
        print("Saved -> delay_prediction_model.pkl (updated)")
    else:
        print(f"\nThreshold not met ({len(discrepancies)} < {MIN_DISCREPANCIES_TO_RETRAIN}) "
              f"-> no re-training triggered this run.")

    print("=" * 60)