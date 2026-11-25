from pathlib import Path
import json
import rasterio
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs/flood"

print("\nFLOODSENTINEL FINAL VALIDATION")
print("=" * 45)

# 1. Raster validation
baseline = OUT / "baseline/flood_mask.tif"
improved = OUT / "flood_mask_improved.tif"

with rasterio.open(baseline) as a, rasterio.open(improved) as b:
    original = a.read(1)
    screened = b.read(1)

    assert a.shape == b.shape
    assert a.crs == b.crs
    assert a.transform == b.transform
    assert np.all((screened > 0) <= (original > 0))

    print("\n[PASS] Raster alignment")
    print("Original candidates:", int(np.count_nonzero(original)))
    print("Improved candidates:", int(np.count_nonzero(screened)))
    print("Excluded pixels:", int(np.count_nonzero(original) - np.count_nonzero(screened)))

    assert np.count_nonzero(original) == 1790919
    assert np.count_nonzero(screened) == 1776561

# 2. GeoJSON validation
geojson_path = OUT / "flood_extent_improved.geojson"

with open(geojson_path, encoding="utf-8") as f:
    geojson = json.load(f)

assert geojson["type"] == "FeatureCollection"

features = geojson["features"]

assert len(features) == 1189

def check_coordinates(obj):
    if isinstance(obj, (list, tuple)):
        if len(obj) >= 2 and isinstance(obj[0], (int, float)) and isinstance(obj[1], (int, float)):
            lon, lat = obj[0], obj[1]
            assert -180 <= lon <= 180
            assert -90 <= lat <= 90
            return True

        return any(check_coordinates(x) for x in obj)

    return False

assert features
assert check_coordinates(features[0]["geometry"]["coordinates"])

print("\n[PASS] Improved GeoJSON")
print("Feature count:", len(features))
print("First polygon coordinates are within WGS84 ranges.")

# 3. JSON outputs
for filename in [
    "flood_result_improved.json",
    "ghsl_overlap_comparison.json"
]:
    path = OUT / filename
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    print("\n[PASS] JSON:", filename)
    print("Top-level keys:", list(data.keys()))

# 4. Visualization
for filename in [
    "flood_comparison_baseline.png",
    "flood_comparison_improved.png"
]:
    path = OUT / filename
    assert path.exists() and path.stat().st_size > 0

    with Image.open(path) as img:
        print("\n[PASS] Image:", filename)
        print("Dimensions:", img.size)

print("\nALL FLOOD OUTPUT CHECKS PASSED")
