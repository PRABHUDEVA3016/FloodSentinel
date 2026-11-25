# FloodSentinel — Technical Methodology

## 1. Study Area

The project focuses on Silchar, Assam, India.

The Sentinel-1 observations used in the flood analysis are:

- Pre-event: 18 June 2022
- Post-event: 30 June 2022
- Satellite: Sentinel-1A
- Relative orbit: 77
- Orbit direction: Descending

## 2. Sentinel-1 SAR Processing

The pre-event and post-event VV and VH backscatter observations are read and spatially aligned.

A 3x3 median filter is applied to reduce speckle-related variation.

The VV backscatter change is calculated as:

**VV Change = Post-event VV − Pre-event VV**

The initial flood candidate conditions are:

- Post-event VV ≤ −16 dB
- Post-event VH ≤ −20 dB
- VV change ≤ −3 dB
- Pre-event VV > −16 dB
- Valid overlapping observations

Pixels satisfying these conditions are classified as SAR-derived flood candidates.

## 3. Permanent-Water Exclusion

JRC Global Surface Water occurrence data is used to screen historically persistent water bodies.

Pixels with historical water occurrence ≥ 90% are excluded from the original candidate mask.

Invalid JRC pixels are preserved rather than automatically classified as permanent water.

The original SAR candidate mask is retained as a baseline.

## 4. Improved Flood Candidate Outputs

The improved outputs include:

- `flood_mask_improved.tif`
- `flood_extent_improved.geojson`
- `flood_result_improved.json`

The improved raster retains the Sentinel-1 reference grid.

The GeoJSON geometries are transformed into WGS84 (EPSG:4326).

## 5. GHSL Spatial Overlap

The improved and original candidate masks are compared with positive-value pixels from the GHSL dataset.

The overlap is calculated as a spatial screening indicator.

It must not be interpreted as independently confirmed building exposure or damage.

## 6. VIIRS Economic Activity Context

VIIRS night-time light observations are used to provide contextual information about economic activity.

The available project result reports:

- 24 observations
- Annual radiance change: +2.45%

Radiance change is not equivalent to direct economic growth or monetary flood loss.

## 7. Integrated Risk Assessment

Flood candidate information and supporting economic and geospatial indicators are integrated into the project's risk assessment outputs.

The current reported status is:

`INDICATORS_AVAILABLE`

This status indicates that contextual indicators are available. It does not establish independently validated flood damage.

## 8. Validation and Limitations

The project performs technical checks on raster alignment, pixel counts, GeoJSON coordinate ranges and generated output files.

The analysis has not been independently validated against ground-truth flood labels.

Important limitations include:

- Radar shadow and layover effects
- Vegetation and soil-moisture interference
- Threshold sensitivity
- Limited temporal observations
- Historical water classification limitations
- Lack of independently confirmed building exposure
- Lack of monetary damage estimation

## 9. Interpretation

FloodSentinel produces SAR-derived flood candidates and contextual risk indicators.

The results are intended for geospatial screening and demonstration, not as a substitute for independently validated flood mapping or official disaster damage assessments.