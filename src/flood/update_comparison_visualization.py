from pathlib import Path
import shutil

import numpy as np
import rasterio
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from rasterio.warp import reproject, Resampling

ROOT = Path(__file__).resolve().parents[2]

PRE = ROOT / "data/raw/sentinel1/sentinel1_preflood.tif"
POST = ROOT / "data/raw/sentinel1/sentinel1_postflood.tif"

OUT = ROOT / "outputs/flood"

ORIGINAL_MASK = OUT / "baseline/flood_mask.tif"
IMPROVED_MASK = OUT / "flood_mask_improved.tif"
CHANGE = OUT / "vv_backscatter_change.tif"

IMAGE = OUT / "flood_comparison_improved.png"
BASELINE_IMAGE = OUT / "flood_comparison_baseline.png"

MAX_DISPLAY_SIZE = 750


def read_band(path, band, reference=None):

    with rasterio.open(path) as src:
        array = src.read(band).astype("float32")
        transform = src.transform
        crs = src.crs
        nodata = src.nodata

    if nodata is not None:
        array[array == nodata] = np.nan

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

    return array


def verify_grid(path, reference):

    with rasterio.open(path) as src:
        if (
            src.width != reference[2][1]
            or src.height != reference[2][0]
            or src.transform != reference[0]
            or src.crs != reference[1]
        ):
            raise ValueError(f"Raster grid mismatch: {path}")


def read_mask(path, reference):

    verify_grid(path, reference)

    with rasterio.open(path) as src:
        return src.read(1).astype("uint8")


def display_array(array, step, categorical=False):

    sampled = array[::step, ::step]

    if categorical:
        return sampled

    return np.ma.masked_invalid(sampled)


def main():

    print("\nFLOODSENTINEL - COMPARISON VISUALIZATION")
    print("----------------------------------------")

    required = [
        PRE, POST, ORIGINAL_MASK,
        IMPROVED_MASK, CHANGE
    ]

    for path in required:
        if not path.exists():
            raise FileNotFoundError(f"Missing input: {path}")

    # Preserve the existing comparison image as baseline.
    if IMAGE.exists() and not BASELINE_IMAGE.exists():
        shutil.copy2(IMAGE, BASELINE_IMAGE)
        print("Original comparison image backed up.")

    # Read Sentinel-1 reference grid.
    with rasterio.open(PRE) as src:
        reference = (
            src.transform,
            src.crs,
            (src.height, src.width)
        )

        pre = read_band(PRE, 1)

    print("Reading existing Sentinel-1 products...")

    post = read_band(POST, 1, reference)

    print("Reading original and improved flood masks...")

    original = read_mask(ORIGINAL_MASK, reference)
    improved = read_mask(IMPROVED_MASK, reference)

    verify_grid(CHANGE, reference)

    with rasterio.open(CHANGE) as src:
        change = src.read(1).astype("float32")
        if src.nodata is not None:
            change[change == src.nodata] = np.nan

    if change.shape != pre.shape:
        raise ValueError("VV change raster dimensions do not match.")

    # Confirm that the improved mask is a subset of the baseline.
    original_count = int(np.count_nonzero(original))
    improved_count = int(np.count_nonzero(improved))

    if np.any((improved > 0) & (original == 0)):
        raise ValueError(
            "Improved mask contains candidates outside original mask."
        )

    excluded = original_count - improved_count

    # Visualization-only downsampling.
    step = max(
        1,
        int(np.ceil(max(pre.shape) / MAX_DISPLAY_SIZE))
    )

    print("Display sampling factor:", step)

    fig, axes = plt.subplots(
        2, 2,
        figsize=(13, 10),
        constrained_layout=True
    )

    panels = [
        (
            pre,
            "Pre-event Sentinel-1 VV (dB)",
            "viridis",
            False
        ),
        (
            post,
            "Post-event Sentinel-1 VV (dB)",
            "viridis",
            False
        ),
        (
            change,
            "VV backscatter change (dB)",
            "RdBu_r",
            False
        ),
        (
            improved,
            "Improved SAR candidates (JRC screened)",
            "Blues",
            True
        )
    ]

    for ax, (array, title, cmap, categorical) in zip(
        axes.flat, panels
    ):

        sampled = display_array(
            array, step, categorical
        )

        ax.imshow(
            sampled,
            cmap=cmap,
            interpolation="nearest",
            vmin=0 if categorical else None,
            vmax=1 if categorical else None
        )

        ax.set_title(title, fontsize=11)
        ax.axis("off")

    fig.suptitle(
        "FloodSentinel - Improved Flood Candidate Analysis",
        fontsize=15
    )

    fig.savefig(
        IMAGE,
        dpi=110,
        bbox_inches="tight"
    )

    plt.close(fig)

    print("\nVISUALIZATION COMPLETED")
    print("----------------------------------------")
    print("Original candidate pixels:", original_count)
    print("Improved candidate pixels:", improved_count)
    print("Permanent-water pixels excluded:", excluded)
    print("Original baseline image:", BASELINE_IMAGE)
    print("Updated comparison image:", IMAGE)
    print("Full-resolution GeoTIFFs preserved.")


if __name__ == "__main__":
    main()
