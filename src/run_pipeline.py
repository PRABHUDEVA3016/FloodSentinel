from pathlib import Path
import json
import numpy as np
import pandas as pd
import rasterio
from scipy.ndimage import uniform_filter
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import balanced_accuracy_score, f1_score
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "raw"
OUT = ROOT / "outputs"

for folder in ["impact", "orbit", "gnss", "integration"]:
    (OUT / folder).mkdir(parents=True, exist_ok=True)

def save_json(path, data):
    path.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

# --------------------------------------------------
# 1. GHSL URBAN GROWTH
# --------------------------------------------------

print("\n[1/4] Processing GHSL growth data...")

years = [2000, 2005, 2010, 2015, 2020]
rasters = []
profile = None

for year in years:
    path = DATA / "ghsl" / f"GHSL_Silchar_{year}.tif"
    with rasterio.open(path) as ds:
        arr = ds.read(1).astype("float32")
        rasters.append(arr)
        if profile is None:
            profile = ds.profile.copy()

rasters = np.stack(rasters)
masks = rasters > 0

growth_rows = []

for i, year in enumerate(years):
    growth_rows.append({
        "year": year,
        "positive_value_cells": int(masks[i].sum()),
        "raster_value_sum": float(rasters[i].sum()),
        "mean_positive_value": float(
            rasters[i][masks[i]].mean()
        ) if masks[i].any() else 0
    })

growth_df = pd.DataFrame(growth_rows)
growth_df.to_csv(OUT / "impact" / "growth_history.csv", index=False)

def features(previous, current):
    p = (previous > 0).astype("float32")
    c = (current > 0).astype("float32")
    neighbourhood = uniform_filter(c, size=5, mode="constant")
    return np.stack([c, p, c-p, neighbourhood], axis=-1)

X_train, y_train = [], []

for i in range(1, 3):
    X_train.append(features(rasters[i-1], rasters[i]).reshape(-1, 4))
    y_train.append(masks[i+1].ravel().astype("uint8"))

X_train = np.concatenate(X_train)
y_train = np.concatenate(y_train)

# Limit training size for rapid execution.
rng = np.random.default_rng(42)
if len(y_train) > 50000:
    ids = rng.choice(len(y_train), 50000, replace=False)
    X_train, y_train = X_train[ids], y_train[ids]

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    min_samples_leaf=3,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Latest historical transition: 2015 -> 2020.
X_test = features(rasters[2], rasters[3]).reshape(-1, 4)
y_test = masks[4].ravel().astype("uint8")
pred_test = model.predict(X_test)

evaluation = {
    "validation": "Latest historical transition; spatially overlapping pixels",
    "balanced_accuracy": float(balanced_accuracy_score(y_test, pred_test)),
    "f1_score": float(f1_score(y_test, pred_test, zero_division=0)),
    "interpretation": "Experimental temporal holdout, not independent spatial validation"
}

# Refit using all historical transitions.
X_all, y_all = [], []

for i in range(1, 4):
    X_all.append(features(rasters[i-1], rasters[i]).reshape(-1, 4))
    y_all.append(masks[i+1].ravel().astype("uint8"))

X_all = np.concatenate(X_all)
y_all = np.concatenate(y_all)

if len(y_all) > 50000:
    ids = rng.choice(len(y_all), 50000, replace=False)
    X_all, y_all = X_all[ids], y_all[ids]

model.fit(X_all, y_all)

future_features = features(rasters[3], rasters[4]).reshape(-1, 4)
probability = model.predict_proba(future_features)[:, 1]
probability = probability.reshape(rasters.shape[1:])

forecast = (probability >= 0.5).astype("uint8")

growth_profile = profile.copy()
growth_profile.update(dtype="float32", count=1, nodata=None)

with rasterio.open(OUT / "impact" / "growth_probability_2025.tif", "w",
                   **growth_profile) as dst:
    dst.write(probability.astype("float32"), 1)

with rasterio.open(OUT / "impact" / "growth_forecast_2025.tif", "w",
                   **{**growth_profile, "dtype": "uint8"}) as dst:
    dst.write(forecast, 1)

growth_result = {
    "status": "COMPLETED",
    "classification_basis": "Positive versus zero GHSL raster values",
    "product_semantics": "Requires confirmation from original GHSL product metadata",
    "historical_years": years,
    "history": growth_rows,
    "model": "RandomForestClassifier",
    "forecast_year": 2025,
    "forecast_positive_cells": int(forecast.sum()),
    "forecast_probability_mean": float(probability.mean()),
    "validation": evaluation,
    "forecast_status": "EXPERIMENTAL_MODEL_OUTPUT"
}

save_json(OUT / "impact" / "growth_result.json", growth_result)

plt.figure(figsize=(10, 5))
plt.plot(growth_df.year, growth_df.positive_value_cells, marker="o")
plt.title("Silchar GHSL Positive-Value Footprint")
plt.xlabel("Year")
plt.ylabel("Positive-value raster cells")
plt.grid(True)
plt.tight_layout()
plt.savefig(OUT / "impact" / "growth_history.png", dpi=150)
plt.close()

print("GHSL analysis completed.")

# --------------------------------------------------
# 2. VIIRS ECONOMIC ACTIVITY
# --------------------------------------------------

print("\n[2/4] Processing VIIRS nightlights...")

csv_path = DATA / "viirs" / "VIIRS_Silchar_Monthly_2021_2022.csv"
df = pd.read_csv(csv_path)

df["month"] = pd.to_datetime(df["month"])
df = df.sort_values("month")

df["radiance_change_pct"] = (
    df["baseline_radiance"].pct_change() * 100
)

df.to_csv(OUT / "impact" / "nightlights_monthly.csv", index=False)

df["year"] = df["month"].dt.year

yearly = df.groupby("year")["baseline_radiance"].mean()

economic_result = {
    "status": "COMPLETED",
    "data_source": str(df["data_source"].iloc[0]),
    "observations": int(len(df)),
    "monthly_mean_radiance": float(df["baseline_radiance"].mean()),
    "yearly_mean_radiance": {
        str(k): float(v) for k, v in yearly.items()
    },
    "annual_change_pct": (
        float((yearly.loc[2022] / yearly.loc[2021] - 1) * 100)
        if 2021 in yearly.index and 2022 in yearly.index
        and yearly.loc[2021] != 0 else None
    ),
    "interpretation": "Nightlight radiance is an economic activity proxy, not direct GDP measurement."
}

save_json(OUT / "impact" / "nightlights_result.json", economic_result)

plt.figure(figsize=(11, 5))
plt.plot(df["month"], df["baseline_radiance"], marker="o")
plt.title("Silchar Monthly VIIRS Nightlight Radiance")
plt.xlabel("Month")
plt.ylabel("Baseline radiance")
plt.xticks(rotation=45)
plt.grid(True)
plt.tight_layout()
plt.savefig(OUT / "impact" / "nightlight_change.png", dpi=150)
plt.close()

print("VIIRS analysis completed.")

# --------------------------------------------------
# 3. ORBIT SIMULATION
# --------------------------------------------------

print("\n[3/4] Running satellite orbit calculations...")

mu = 3.986004418e14
earth_radius = 6371000
altitude = 700000
semi_major_axis = earth_radius + altitude

period = 2 * np.pi * np.sqrt(semi_major_axis**3 / mu)
speed = np.sqrt(mu / semi_major_axis)

orbit_result = {
    "status": "COMPLETED",
    "classification": "SIMULATED",
    "altitude_km": altitude / 1000,
    "orbital_period_minutes": period / 60,
    "orbital_speed_km_s": speed / 1000,
    "orbits_per_day": 86400 / period,
    "model": "Ideal circular two-body orbit",
    "limitations": "No perturbation, attitude, propulsion or validated ground-contact model."
}

save_json(OUT / "orbit" / "orbit_result.json", orbit_result)

print("Orbit simulation completed.")

# --------------------------------------------------
# 4. GNSS UNCERTAINTY SIMULATION
# --------------------------------------------------

print("\n[4/4] Running GNSS uncertainty simulation...")

rng = np.random.default_rng(42)

errors = rng.normal(0, 10, size=(100000, 2))
distances = np.sqrt((errors**2).sum(axis=1))

gnss_result = {
    "status": "COMPLETED",
    "classification": "SIMULATED",
    "simulation_samples": 100000,
    "assumed_sigma_m": 10,
    "mean_position_error_m": float(distances.mean()),
    "median_position_error_m": float(np.median(distances)),
    "p95_position_error_m": float(np.percentile(distances, 95)),
    "limitations": "Illustrative Gaussian positioning-error model; not measured GNSS or NavIC performance."
}

save_json(OUT / "gnss" / "gnss_result.json", gnss_result)

plt.figure(figsize=(8, 5))
plt.hist(distances, bins=60)
plt.title("Simulated GNSS Position Error")
plt.xlabel("Position error (m)")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(OUT / "gnss" / "gnss_error.png", dpi=150)
plt.close()

# --------------------------------------------------
# 5. FLOOD DATA STATUS AND INTEGRATION
# --------------------------------------------------

save_json(OUT / "flood" / "flood_result.json", {
    "status": "WAITING",
    "reason": "No verified Sentinel-1 pre-event/post-event imagery or flood mask in the audited dataset."
})

save_json(OUT / "integration" / "risk_result.json", {
    "status": "WAITING",
    "reason": "Flood extent and exposed-value inputs are not yet available.",
    "warning": "No monetary loss or operational flood warning is claimed."
})

print("\n======================================")
print("FLOODSENTINEL PIPELINE COMPLETED")
print("======================================")
print("Outputs:", OUT)

