from pathlib import Path
import json
import numpy as np
import rasterio

from rasterio.warp import reproject, Resampling, transform_geom
from rasterio.features import shapes
from shapely.geometry import shape, mapping

ROOT = Path(__file__).resolve().parents[2]

BASE = ROOT / "outputs" / "flood" / "baseline"
OUT = ROOT / "outputs" / "flood"
JRC = ROOT / "data" / "raw" / "other" / "jrc_water_occurrence.tif"

OUT.mkdir(parents=True, exist_ok=True)

print("\nFLOODSENTINEL - PERMANENT WATER EXCLUSION")

# 1. Read original flood candidates
with rasterio.open(BASE / "flood_mask.tif") as ds:
    original_mask = ds.read(1) == 1
    profile = ds.profile.copy()
    transform = ds.transform
    crs = ds.crs
    pixel_area = abs(
        transform.a * transform.e - transform.b * transform.d
    )

# 2. Read JRC occurrence raster
with rasterio.open(JRC) as ds:
    occurrence = ds.read(1).astype("float32")
    jrc_transform = ds.transform
    jrc_crs = ds.crs
    jrc_nodata = ds.nodata

valid_jrc = np.isfinite(occurrence)

if jrc_nodata is not None:
    valid_jrc &= occurrence != jrc_nodata

# Explicitly mark invalid source pixels as NoData
occurrence[~valid_jrc] = -9999.0

# 3. Align JRC to the Sentinel-1 flood mask grid
aligned = np.full(original_mask.shape, -9999.0, dtype="float32")

reproject(
    source=occurrence,
    destination=aligned,
    src_transform=jrc_transform,
    src_crs=jrc_crs,
    src_nodata=-9999.0,
    dst_transform=transform,
    dst_crs=crs,
    dst_nodata=-9999.0,
    resampling=Resampling.nearest
)

# 4. Identify historical permanent-water pixels
jrc_valid = np.isfinite(aligned) & (aligned != -9999.0)
permanent_water = jrc_valid & (aligned >= 90.0)

# Exclude only where JRC has valid data and occurrence >= 90%.
improved_mask = original_mask & ~permanent_water

# 5. Calculate comparison statistics
original_pixels = int(original_mask.sum())
improved_pixels = int(improved_mask.sum())
excluded_pixels = original_pixels - improved_pixels

original_area = original_pixels * pixel_area / 1_000_000
improved_area = improved_pixels * pixel_area / 1_000_000
excluded_area = excluded_pixels * pixel_area / 1_000_000

print("\nOriginal candidates:", original_pixels)
print("Permanent-water pixels excluded:", excluded_pixels)
print("Remaining candidates:", improved_pixels)

print("\nOriginal area:", round(original_area, 4), "km2")
print("Excluded area:", round(excluded_area, 4), "km2")
print("Improved candidate area:", round(improved_area, 4), "km2")

# 6. Export improved GeoTIFF
profile.update(
    count=1,
    dtype="uint8",
    nodata=0,
    compress="lzw"
)

with rasterio.open(OUT / "flood_mask_improved.tif", "w", **profile) as dst:
    dst.write(improved_mask.astype("uint8"), 1)

# 7. Generate improved GeoJSON in WGS84 (EPSG:4326)
features = []

for geom, value in shapes(
    improved_mask.astype("uint8"),
    mask=improved_mask,
    transform=transform
):
    if value != 1:
        continue

    polygon = shape(geom)

    if polygon.area < 5000:
        continue

    # Convert polygon coordinates from raster CRS to WGS84
    wgs84_geometry = transform_geom(
        crs,
        "EPSG:4326",
        geom
    )

    features.append({
        "type": "Feature",
        "properties": {
            "classification": "SAR_FLOOD_CANDIDATE_AFTER_JRC_SCREENING",
            "area_m2": float(polygon.area)
        },
        "geometry": wgs84_geometry
    })

geojson = {
    "type": "FeatureCollection",
    "name": "FloodSentinel_Improved_Flood_Candidates",
    "features": features
}

(OUT / "flood_extent_improved.geojson").write_text(
    json.dumps(geojson, indent=2),
    encoding="utf-8"
)
# 8. Update result while preserving the original baseline
result = {
    "status": "COMPLETED",
    "classification": "SAR_FLOOD_CANDIDATES_AFTER_HISTORICAL_WATER_SCREENING",
    "study_area": "Silchar, Assam, India",
    "jrc_threshold_percent": 90,
    "original_candidate_pixels": original_pixels,
    "excluded_permanent_water_pixels": excluded_pixels,
    "remaining_candidate_pixels": improved_pixels,
    "original_candidate_area_km2": original_area,
    "excluded_area_km2": excluded_area,
    "candidate_area_km2": improved_area,
    "candidate_area_reduction_percent": (
        excluded_area / original_area * 100 if original_area else 0
    ),
    "geojson_polygon_count": len(features),
    "ghsl_positive_value_overlap_km2": None,
    "validation": "Not independently validated against flood reference labels.",
    "limitations": [
        "JRC occurrence represents historical water frequency through 2021.",
        "JRC exclusion is a screening step, not proof of permanent water.",
        "Areas with invalid JRC pixels are not excluded.",
        "Remaining SAR candidates may include non-flood changes.",
        "No monetary damage estimate is produced."
    ]
}

(OUT / "flood_result_improved.json").write_text(
    json.dumps(result, indent=2),
    encoding="utf-8"
)

print("\nGeoJSON polygons:", len(features))
print("\nPERMANENT-WATER EXCLUSION COMPLETED")
print("Original baseline preserved.")
print("Improved outputs saved in:", OUT)
