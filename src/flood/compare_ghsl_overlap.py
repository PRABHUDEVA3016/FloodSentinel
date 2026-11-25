
from pathlib import Path
import json
import numpy as np
import rasterio
from rasterio.warp import reproject, Resampling

ROOT = Path(__file__).resolve().parents[2]

GHSL = ROOT / "data" / "raw" / "ghsl" / "GHSL_Silchar_2020.tif"

BASELINE_MASK = ROOT / "outputs" / "flood" / "baseline" / "flood_mask.tif"
IMPROVED_MASK = ROOT / "outputs" / "flood" / "flood_mask_improved.tif"

OUT = ROOT / "outputs" / "flood"
OUT.mkdir(parents=True, exist_ok=True)

print("\nFLOODSENTINEL - GHSL OVERLAP COMPARISON")

# 1. Read the GHSL 2020 raster
with rasterio.open(GHSL) as ds:
    ghsl = ds.read(1)
    ghsl_transform = ds.transform
    ghsl_crs = ds.crs
    ghsl_nodata = ds.nodata

# GHSL positive values represent positive raster values.
# Exclude NoData pixels from the comparison.
ghsl_valid = np.isfinite(ghsl)

if ghsl_nodata is not None:
    ghsl_valid &= ghsl != ghsl_nodata

ghsl_positive = ghsl_valid & (ghsl > 0)

# 2. Read original flood mask and its grid
with rasterio.open(BASELINE_MASK) as ds:
    original = ds.read(1) == 1
    target_transform = ds.transform
    target_crs = ds.crs
    target_shape = original.shape
    pixel_area = abs(
        target_transform.a * target_transform.e
        - target_transform.b * target_transform.d
    )

# 3. Read improved flood mask
with rasterio.open(IMPROVED_MASK) as ds:
    improved = ds.read(1) == 1

# 4. Align GHSL to the Sentinel-1 flood mask grid
aligned_ghsl = np.zeros(target_shape, dtype="uint8")

reproject(
    source=ghsl_positive.astype("uint8"),
    destination=aligned_ghsl,
    src_transform=ghsl_transform,
    src_crs=ghsl_crs,
    dst_transform=target_transform,
    dst_crs=target_crs,
    resampling=Resampling.nearest
)

# 5. Calculate overlap
ghsl_positive_aligned = aligned_ghsl == 1

original_overlap = original & ghsl_positive_aligned
improved_overlap = improved & ghsl_positive_aligned

original_candidates = int(original.sum())
improved_candidates = int(improved.sum())

original_overlap_pixels = int(original_overlap.sum())
improved_overlap_pixels = int(improved_overlap.sum())

original_overlap_km2 = (
    original_overlap_pixels * pixel_area / 1_000_000
)

improved_overlap_km2 = (
    improved_overlap_pixels * pixel_area / 1_000_000
)

original_overlap_percent = (
    original_overlap_pixels / original_candidates * 100
    if original_candidates else 0
)

improved_overlap_percent = (
    improved_overlap_pixels / improved_candidates * 100
    if improved_candidates else 0
)

# 6. Print comparison
print("\nORIGINAL FLOOD CANDIDATES")
print("Candidate pixels:", original_candidates)
print("GHSL overlap pixels:", original_overlap_pixels)
print("GHSL overlap area:", round(original_overlap_km2, 4), "km2")
print("Overlap percentage:", round(original_overlap_percent, 4), "%")

print("\nIMPROVED FLOOD CANDIDATES")
print("Candidate pixels:", improved_candidates)
print("GHSL overlap pixels:", improved_overlap_pixels)
print("GHSL overlap area:", round(improved_overlap_km2, 4), "km2")
print("Overlap percentage:", round(improved_overlap_percent, 4), "%")

# 7. Save comparison results
result = {
    "ghsl_reference": "GHSL_Silchar_2020.tif",
    "original_candidate_pixels": original_candidates,
    "improved_candidate_pixels": improved_candidates,
    "original_ghsl_overlap_pixels": original_overlap_pixels,
    "improved_ghsl_overlap_pixels": improved_overlap_pixels,
    "original_ghsl_overlap_km2": original_overlap_km2,
    "improved_ghsl_overlap_km2": improved_overlap_km2,
    "original_overlap_percentage": original_overlap_percent,
    "improved_overlap_percentage": improved_overlap_percent,
    "interpretation": (
        "GHSL-positive-value overlap is a screening indicator, "
        "not confirmed building exposure or flood damage."
    )
}

(OUT / "ghsl_overlap_comparison.json").write_text(
    json.dumps(result, indent=2),
    encoding="utf-8"
)

# 8. Update improved result JSON
improved_result_path = OUT / "flood_result_improved.json"

improved_result = json.loads(
    improved_result_path.read_text(encoding="utf-8")
)

improved_result["ghsl_positive_value_overlap_km2"] = (
    improved_overlap_km2
)

improved_result["ghsl_positive_value_overlap_pixels"] = (
    improved_overlap_pixels
)

improved_result["ghsl_overlap_percentage_of_candidates"] = (
    improved_overlap_percent
)

improved_result["ghsl_reference"] = "GHSL_Silchar_2020.tif"

improved_result_path.write_text(
    json.dumps(improved_result, indent=2),
    encoding="utf-8"
)

print("\nComparison saved:")
print(OUT / "ghsl_overlap_comparison.json")

print("\nImproved flood result JSON updated.")
print("\nGHSL OVERLAP COMPARISON COMPLETED")
