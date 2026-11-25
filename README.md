
# FloodSentinel
### Multi-source Geospatial Flood Analysis and Risk Assessment

FloodSentinel is a geospatial analysis project designed to identify potential flood-affected areas and provide contextual risk indicators by integrating satellite observations and supporting datasets.

## 1. Project Overview

The project uses Sentinel-1 SAR observations to identify flood candidates and combines additional geospatial datasets to improve interpretation.

Study area: Silchar, Assam, India.

## 2. Technology Stack

- Python
- Streamlit
- Rasterio
- NumPy
- Pandas
- Matplotlib
- SciPy
- Shapely
- GeoJSON
- Git and GitHub

## 3. Data Sources

| Dataset | Purpose |
|---|---|
| Sentinel-1 SAR | Pre-event and post-event radar analysis |
| JRC Global Surface Water | Historical permanent-water screening |
| GHSL | Positive-value spatial overlap analysis |
| VIIRS night-time lights | Economic activity context |

## 4. System Architecture

```mermaid
flowchart TD
    A[Satellite and Geospatial Datasets] --> B[Data Processing]
    B --> C[Sentinel-1 SAR Analysis]
    C --> D[Initial Flood Candidates]
    D --> E[JRC Permanent-Water Exclusion]
    E --> F[Improved Flood Candidates]
    F --> G[GeoTIFF and GeoJSON Outputs]
    F --> H[GHSL Spatial Overlap]
    I[VIIRS Night-time Lights] --> J[Economic Activity Context]
    H --> K[Integrated Risk Assessment]
    J --> K
    K --> L[Streamlit Dashboard]