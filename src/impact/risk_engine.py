from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]

FLOOD_FILE = ROOT / "outputs" / "flood" / "flood_result.json"
VIIRS_FILE = ROOT / "outputs" / "impact" / "nightlights_result.json"

OUT = ROOT / "outputs" / "integration"
OUT.mkdir(parents=True, exist_ok=True)

RISK_FILE = OUT / "risk_result.json"


def load_json(path):
    if not path.exists():
        raise FileNotFoundError(f"Required input missing: {path}")

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


print("\n======================================")
print("FLOODSENTINEL RISK ASSESSMENT ENGINE")
print("======================================")

# 1. Load existing analytical results
flood = load_json(FLOOD_FILE)
viirs = load_json(VIIRS_FILE)

if flood.get("status") != "COMPLETED":
    raise ValueError("Flood analysis is not completed.")

# 2. Extract flood information
candidate_area = float(flood["candidate_area_km2"])
candidate_pixels = int(flood["candidate_pixels"])

ghsl_overlap = flood.get(
    "ghsl_positive_value_overlap_km2"
)

if ghsl_overlap is not None:
    ghsl_overlap = float(ghsl_overlap)

# 3. Calculate spatial overlap percentage
if ghsl_overlap is not None and candidate_area > 0:
    overlap_percentage = (
        ghsl_overlap / candidate_area
    ) * 100
else:
    overlap_percentage = None

# 4. Extract economic activity context
observations = viirs.get("observations", 0)

yearly_radiance = viirs.get(
    "yearly_mean_radiance", {}
)

annual_change = viirs.get(
    "annual_change_pct"
)

# 5. Construct the integrated screening result
result = {
    "status": "COMPLETED",
    "assessment_type": "SPATIAL_RISK_SCREENING",
    "study_area": "Silchar, Assam, India",

    "flood_indicators": {
        "candidate_area_km2": candidate_area,
        "candidate_pixels": candidate_pixels,
        "candidate_classification": "SAR_DERIVED_FLOOD_CANDIDATES"
    },

    "urban_footprint_indicators": {
        "ghsl_positive_value_overlap_km2": ghsl_overlap,
        "candidate_area_overlap_percentage": (
            overlap_percentage
        ),
        "interpretation": (
            "Spatial overlap with positive-value GHSL cells. "
            "Not independently verified flooded buildings "
            "or infrastructure."
        )
    },

    "economic_activity_context": {
        "viirs_observations": observations,
        "yearly_mean_radiance": yearly_radiance,
        "annual_radiance_change_pct": annual_change,
        "interpretation": (
            "Regional nighttime-light activity context. "
            "Not a direct measurement of flood-related "
            "economic loss."
        )
    },

    "assessment_conclusion": {
        "screening_status": "INDICATORS_AVAILABLE",
        "validated_flood_extent": False,
        "monetary_damage_estimated": False,
        "ground_truth_validation": False,
        "reason": (
            "Independent flood reference data and "
            "verified asset exposure values are required "
            "before operational risk classification."
        )
    },

    "limitations": [
        "SAR-derived flood candidates require independent validation.",
        "GHSL positive-value overlap is not confirmed building exposure.",
        "VIIRS radiance is contextual economic information.",
        "No actual monetary damage or insurance payout is estimated."
    ]
}

# 6. Save output
with RISK_FILE.open("w", encoding="utf-8") as file:
    json.dump(result, file, indent=4)

print("\nFLOOD CANDIDATE AREA:", candidate_area, "km2")
print("GHSL POSITIVE OVERLAP:", ghsl_overlap, "km2")
print(
    "OVERLAP PERCENTAGE:",
    round(overlap_percentage, 2)
    if overlap_percentage is not None else "Unavailable",
    "%"
)
print("VIIRS OBSERVATIONS:", observations)

print("\nRISK ASSESSMENT COMPLETED")
print("Saved:", RISK_FILE)
