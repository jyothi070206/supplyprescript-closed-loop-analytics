import pandas as pd
import numpy as np

np.random.seed(42)

n = 500  # 500 historical shipments

suppliers = ["SupplierA", "SupplierB", "SupplierC", "SupplierD"]
regions = ["Asia", "Europe", "North America"]
categories = ["Electronics", "Furniture", "Textiles"]

data = {
    "shipment_id": range(1, n + 1),
    "supplier": np.random.choice(suppliers, n),
    "region": np.random.choice(regions, n),
    "category": np.random.choice(categories, n),
    "planned_lead_time_days": np.random.randint(5, 30, n),
    "distance_km": np.random.randint(500, 12000, n),
    "order_value_usd": np.random.randint(2000, 50000, n),
    "is_peak_season": np.random.choice([0, 1], n, p=[0.7, 0.3]),
}

df = pd.DataFrame(data)

# Simulate a realistic "delay" pattern based on the features above
# (this is what XGBoost will learn to predict)
delay_probability = (
    0.1
    + (df["distance_km"] / 12000) * 0.3
    + df["is_peak_season"] * 0.25
    + (df["planned_lead_time_days"] < 10).astype(int) * 0.2
)
delay_probability = delay_probability.clip(0, 1)

df["was_delayed"] = (np.random.rand(n) < delay_probability).astype(int)

# For delayed shipments, simulate how many days late
df["delay_days"] = np.where(
    df["was_delayed"] == 1,
    np.random.randint(2, 21, n),
    0
)

df.to_csv("supply_chain_history.csv", index=False)
print(f"Generated {n} mock shipment records -> supply_chain_history.csv")
print(df["was_delayed"].value_counts())