from pathlib import Path
import json
import warnings

import numpy as np
import pandas as pd
import rasterio
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from scipy.ndimage import median_filter
from rasterio.warp import reproject, Resampling, transform_geom
from rasterio.features import shapes
from shapely.geometry import shape, mapping


# ============================================================
# FLOODSENTINEL - SAR FLOOD CANDIDATE DETECTION
# ============================================================

ROOT = Path(__file__).resolve().parents[2]

DATA = ROOT / "data" / "raw"
S1_DIR = DATA / "sentinel1"
GHSL_DIR = DATA / "ghsl"

OUT = ROOT / "outputs" / "flood"
INTEGRATION_OUT = ROOT / "outputs" / "integration"

OUT.mkdir(parents=True, exist_ok=True)
INTEGRATION_OUT.mkdir(parents=True, exist_ok=True)

PRE_FILE = S1_DIR / "sentinel1_preflood.tif"
POST_FILE = S1_DIR / "sentinel1_postflood.tif"

# Initial thresholds in Sentinel-1 GRD decibels.
# These are analysis parameters, not universal water thresholds.
VV_POST_THRESHOLD = -16.0
VH_POST_THRESHOLD = -20.0
VV_CHANGE_THRESHOLD = -3.0

MINIMUM_PATCH_AREA_M2 = 5000.0
SMOOTHING_SIZE = 3

print("\n==========================================")
print("FLOODSENTINEL SAR FLOOD DETECTION")
print("==========================================")

for path in [PRE_FILE, POST_FILE]:
    if not path.exists():
        raise FileNotFoundError(f"Missing Sentinel-1 image: {path}")

def read_band(path, band_number, reference=None):
    with rasterio.open(path) as ds:
        if band_number > ds.count:
            raise ValueError(
                f"{path.name} has {ds.count} bands; "
                f"band {band_number} is unavailable."
            )

        array = ds.read(band_number).astype("float32")
        profile = ds.profile.copy()
        transform = ds.transform
        crs = ds.crs
        nodata = ds.nodata

    # Sentinel-1 GRD backscatter is represented in dB
    # in the Google Earth Engine COPERNICUS/S1_GRD collection.
    if nodata is not None:
        array[array == nodata] = np.nan

    # Reject invalid or implausible backscatter values.
    array[(array < -60) | (array > 5)] = np.nan

    if reference is not None:
        ref_transform, ref_crs, ref_shape = reference

        if (
            array.shape != ref_shape
            or transform != ref_transform
            or crs != ref_crs
        ):
            aligned = np.full(ref_shape, np.nan, dtype="float32")

            reproject(
                source=array,
                destination=aligned,
                src_transform=transform,
                src_crs=crs,
                dst_transform=ref_transform,
                dst_crs=ref_crs,
                src_nodata=np.nan,
                dst_nodata=np.nan,
                resampling=Resampling.bilinear
            )

            array = aligned

    return array, profile, transform, crs


# ------------------------------------------------------------
# 1. READ AND ALIGN PRE/POST IMAGES
# ------------------------------------------------------------

print("\n[1/6] Reading Sentinel-1 images...")

with rasterio.open(PRE_FILE) as ds:
    if ds.count < 2:
        raise ValueError(
            "Pre-flood image needs VV and VH bands. "
            f"Found {ds.count} band(s)."
        )

    reference = (ds.transform, ds.crs, (ds.height, ds.width))
    profile = ds.profile.copy()

if profile["crs"] is None:
    raise ValueError("Pre-flood image has no CRS.")

pre_vv, _, _, _ = read_band(PRE_FILE, 1)
pre_vh, _, _, _ = read_band(PRE_FILE, 2)

post_vv, _, _, _ = read_band(
    POST_FILE, 1, reference
)

post_vh, _, _, _ = read_band(
    POST_FILE, 2, reference
)

valid = (
    np.isfinite(pre_vv)
    & np.isfinite(pre_vh)
    & np.isfinite(post_vv)
    & np.isfinite(post_vh)
)

valid_pixels = int(valid.sum())

if valid_pixels == 0:
    raise ValueError(
        "No overlapping valid pixels exist between the images. "
        "Check the exported image footprints and CRS."
    )

print("Raster dimensions:", pre_vv.shape)
print("CRS:", profile["crs"])
print("Valid overlapping pixels:", valid_pixels)

# ------------------------------------------------------------
# 2. APPLY SPECKLE SMOOTHING
# ------------------------------------------------------------

print("\n[2/6] Applying 3x3 median filtering...")

def smooth(array):
    safe = np.where(np.isfinite(array), array, 0)
    return median_filter(safe, size=SMOOTHING_SIZE)

pre_vv_s = smooth(pre_vv)
post_vv_s = smooth(post_vv)
post_vh_s = smooth(post_vh)

# ------------------------------------------------------------
# 3. BACKSCATTER CHANGE DETECTION
# ------------------------------------------------------------

print("\n[3/6] Calculating SAR backscatter change...")

vv_change = post_vv_s - pre_vv_s

# Candidate: previously non-water-like surface that becomes
# low-backscatter in the post-event observation.
new_water_candidate = (
    (post_vv_s <= VV_POST_THRESHOLD)
    & (post_vh_s <= VH_POST_THRESHOLD)
    & (vv_change <= VV_CHANGE_THRESHOLD)
    & (pre_vv_s > VV_POST_THRESHOLD)
    & valid
)

# A separate post-event low-backscatter mask is retained
# for inspection. It is NOT automatically called floodwater.
post_low_backscatter = (
    (post_vv_s <= VV_POST_THRESHOLD)
    & (post_vh_s <= VH_POST_THRESHOLD)
    & valid
)

# ------------------------------------------------------------
# 4. AREA CALCULATION
# ------------------------------------------------------------

print("\n[4/6] Calculating candidate flood area...")

pixel_area_m2 = abs(
    profile["transform"].a * profile["transform"].e
    - profile["transform"].b * profile["transform"].d
)

candidate_pixels = int(new_water_candidate.sum())
candidate_area_m2 = candidate_pixels * pixel_area_m2
candidate_area_km2 = candidate_area_m2 / 1_000_000

post_low_pixels = int(post_low_backscatter.sum())
post_low_area_km2 = (
    post_low_pixels * pixel_area_m2 / 1_000_000
)

# ------------------------------------------------------------
# 5. EXPORT GEOTIFF AND GEOJSON
# ------------------------------------------------------------

print("\n[5/6] Exporting flood candidate products...")

mask_profile = profile.copy()
mask_profile.update(
    count=1,
    dtype="uint8",
    nodata=0,
    compress="lzw"
)

mask_path = OUT / "flood_mask.tif"

with rasterio.open(mask_path, "w", **mask_profile) as dst:
    dst.write(new_water_candidate.astype("uint8"), 1)

change_profile = profile.copy()
change_profile.update(
    count=1,
    dtype="float32",
    nodata=-9999.0,
    compress="lzw"
)

change_path = OUT / "vv_backscatter_change.tif"

with rasterio.open(change_path, "w", **change_profile) as dst:
    dst.write(
        np.where(np.isfinite(vv_change), vv_change, -9999)
        .astype("float32"),
        1
    )

# Convert connected candidate patches to GeoJSON.
features = []

for geom, value in shapes(
    new_water_candidate.astype("uint8"),
    mask=new_water_candidate,
    transform=profile["transform"]
):
    if value != 1:
        continue

    polygon = shape(geom)

    if polygon.area < MINIMUM_PATCH_AREA_M2:
        continue

    geojson_geometry = transform_geom(
        profile["crs"],
        "EPSG:4326",
        mapping(polygon)
    )

    features.append({
        "type": "Feature",
        "properties": {
            "classification": "SAR_FLOOD_CANDIDATE",
            "area_m2": float(polygon.area)
        },
        "geometry": geojson_geometry
    })

geojson = {
    "type": "FeatureCollection",
    "name": "FloodSentinel_Silchar_Flood_Candidates",
    "features": features
}

geojson_path = OUT / "flood_extent.geojson"

geojson_path.write_text(
    json.dumps(geojson, indent=2),
    encoding="utf-8"
)

# ------------------------------------------------------------
# 6. GHSL POSITIVE-VALUE OVERLAP
# ------------------------------------------------------------

print("\n[6/6] Comparing with GHSL positive-value footprint...")

ghsl_path = GHSL_DIR / "GHSL_Silchar_2020.tif"

ghsl_overlap = None
ghsl_overlap_area_km2 = None

if ghsl_path.exists():

    with rasterio.open(ghsl_path) as ds:

        ghsl = ds.read(1)

        ghsl_positive = (ghsl > 0).astype("uint8")

        aligned_ghsl = np.zeros(
            pre_vv.shape,
            dtype="uint8"
        )

        reproject(
            source=ghsl_positive,
            destination=aligned_ghsl,
            src_transform=ds.transform,
            src_crs=ds.crs,
            dst_transform=profile["transform"],
            dst_crs=profile["crs"],
            resampling=Resampling.nearest
        )

    ghsl_overlap = (
        new_water_candidate
        & (aligned_ghsl == 1)
    )

    ghsl_overlap_area_km2 = (
        int(ghsl_overlap.sum())
        * pixel_area_m2 / 1_000_000
    )

# ------------------------------------------------------------
# SAVE RESULT JSON
# ------------------------------------------------------------

result = {
    "status": "COMPLETED",
    "classification": "SAR_DERIVED_FLOOD_CANDIDATES",
    "study_area": "Silchar, Assam, India",
    "pre_event_date": "2022-06-18",
    "post_event_date": "2022-06-30",
    "pre_event_orbit": "DESCENDING",
    "post_event_orbit": "DESCENDING",
    "relative_orbit": 77,
    "satellite": "Sentinel-1A",
    "crs": str(profile["crs"]),
    "raster_width": int(pre_vv.shape[1]),
    "raster_height": int(pre_vv.shape[0]),
    "valid_overlapping_pixels": valid_pixels,
    "pixel_area_m2": float(pixel_area_m2),
    "thresholds_db": {
        "post_vv_max": VV_POST_THRESHOLD,
        "post_vh_max": VH_POST_THRESHOLD,
        "minimum_vv_drop": VV_CHANGE_THRESHOLD
    },
    "candidate_pixels": candidate_pixels,
    "candidate_area_km2": float(candidate_area_km2),
    "post_event_low_backscatter_area_km2": float(post_low_area_km2),
    "geojson_polygon_count": len(features),
    "minimum_polygon_area_m2": MINIMUM_PATCH_AREA_M2,
    "ghsl_positive_value_overlap_km2": (
        float(ghsl_overlap_area_km2)
        if ghsl_overlap_area_km2 is not None else None
    ),
    "ghsl_interpretation": (
        "Positive-value overlap only; exact GHSL product semantics "
        "must be verified before calling this built-up exposure."
    ),
    "validation": "Not independently validated against ground-truth flood labels.",
    "limitations": [
        "Single pre-event and post-event acquisition comparison.",
        "Backscatter thresholds require local calibration.",
        "Radar shadows, layover, vegetation and soil moisture can affect classification.",
        "The result is a candidate flood map, not verified inundation.",
        "No monetary damage estimate is produced."
    ],
    "outputs": {
        "mask": "outputs/flood/flood_mask.tif",
        "backscatter_change": "outputs/flood/vv_backscatter_change.tif",
        "geojson": "outputs/flood/flood_extent.geojson"
    }
}

result_path = OUT / "flood_result.json"

result_path.write_text(
    json.dumps(result, indent=2),
    encoding="utf-8"
)


# ------------------------------------------------------------
# VISUALIZATION - MEMORY OPTIMIZED
# ------------------------------------------------------------

print("\nGenerating memory-optimized visualization...")

# Downsample large rasters for visualization only.
# Original analytical outputs remain full resolution.

MAX_DISPLAY_SIZE = 750

step = max(
    1,
    int(np.ceil(max(pre_vv.shape) / MAX_DISPLAY_SIZE))
)

def display_array(array):
    sampled = array[::step, ::step]
    return np.ma.masked_invalid(sampled)

fig, axes = plt.subplots(
    2, 2,
    figsize=(12, 9),
    constrained_layout=True
)

images = [
    (pre_vv, "Pre-event VV backscatter (dB)", "viridis"),
    (post_vv, "Post-event VV backscatter (dB)", "viridis"),
    (vv_change, "VV backscatter change (dB)", "RdBu_r"),
    (
        new_water_candidate.astype("float32"),
        "SAR flood candidates",
        "Blues"
    )
]

for ax, (array, title, cmap) in zip(axes.flat, images):

    sampled = display_array(array)

    ax.imshow(
        sampled,
        cmap=cmap,
        interpolation="nearest"
    )

    ax.set_title(title)
    ax.axis("off")

fig.suptitle(
    "FloodSentinel - Sentinel-1 Flood Analysis",
    fontsize=15
)

plt.savefig(
    OUT / "flood_comparison.png",
    dpi=110
)

plt.close(fig)

print("\n==========================================")
print("FLOOD DETECTION COMPLETED SUCCESSFULLY")
print("==========================================")
print("Valid overlapping pixels:", valid_pixels)
print("Candidate pixels:", candidate_pixels)
print("Candidate flood area (km2):", round(candidate_area_km2, 4))
print("GHSL positive-value overlap (km2):", ghsl_overlap_area_km2)
print("GeoJSON polygons:", len(features))

print("\nAll flood outputs saved successfully.")
