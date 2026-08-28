import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import joblib

# Load the mock data
df = pd.read_csv("supply_chain_history.csv")

# Encode categorical columns (supplier, region, category) into numbers
encoders = {}
for col in ["supplier", "region", "category"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features (inputs) and target (what we're predicting)
features = [
    "supplier", "region", "category",
    "planned_lead_time_days", "distance_km",
    "order_value_usd", "is_peak_season",
]
X = df[features]
y = df["was_delayed"]

# Split into training (80%) and testing (20%) data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the XGBoost classifier
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    eval_metric="logloss",
    random_state=42,
)
model.fit(X_train, y_train)

# Evaluate how well it learned
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy:.2%}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save the trained model and encoders for later use (Week 2: prescriptive engine)
joblib.dump(model, "delay_prediction_model.pkl")
joblib.dump(encoders, "label_encoders.pkl")
print("\nModel saved -> delay_prediction_model.pkl")