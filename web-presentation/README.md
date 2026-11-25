# FloodSentinel — Professional Presentation Website

A premium, interactive geospatial intelligence website for **FloodSentinel**, developed for presentation to hackathon judges, technical reviewers, and disaster management stakeholders.

---

## 1. Overview

FloodSentinel monitors satellite-based flood extent and screens exposure impact for the **June 2022 flood crisis in Silchar, Assam, India**.

This web platform showcases the complete scientific pipeline:
- **Sentinel-1 Dual-Polarization SAR Detection**: C-band radar backscatter differencing (VV/VH).
- **JRC Permanent-Water Exclusion**: Filtering persistent rivers and perennial water bodies using 38 years of historical occurrence data (≥90% threshold).
- **GHSL Urban Footprint Overlap**: High-resolution spatial screening against the European Commission Global Human Settlement Layer.
- **VIIRS Economic Activity Context**: Macroeconomic nocturnal radiance monitoring across 24 monthly epochs (2021–2022).
- **Integrated Risk Screening**: Synthesized decision-support status (`INDICATORS_AVAILABLE`).
- **Interactive High-Precision Map**: 1,189 vectorized SAR flood candidate polygons in WGS84 coordinates.

---

## 2. Complete Separation from Streamlit Engine

In accordance with strict project protection rules:
- The existing scientific analysis pipeline (`src/`), Streamlit application (`app.py`), raw datasets (`data/`), analytical outputs (`outputs/`), virtual environment (`.venv/`), and `requirements.txt` **remain 100% untouched and unmodified**.
- All website assets, source code, components, styles, and configurations reside exclusively inside this folder: `web-presentation/`.
- The presentation website can run independently without requiring the Python/Streamlit server to be active.

---

## 3. Technology Stack

- **Framework**: React 18 + TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS (Geospatial dark mode with custom navy palette and cyan/electric-blue accents)
- **Interactive Maps**: Leaflet + WGS84 Vector Cartography
- **Visual Analytics**: Recharts (Dynamic time-series, area distribution, and bar charts)
- **Icons**: Lucide React
- **Typography**: Inter (UI) & JetBrains Mono (Telemetry & Metrics)

---

## 4. How to Run the Website

### Prerequisites
- Node.js (v18+ recommended; tested on v24.20.0)
- npm (v9+; tested on v11.19.0)

### Development Mode
To launch the interactive website locally:

```powershell
cd web-presentation
npm install        # (already completed)
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build
To compile and preview the optimized production build:

```powershell
cd web-presentation
npm run build
npm run preview
```

---

## 5. Website Pages & Capabilities

1. **Home / Hero Landing Page (`/#home`)**:
   - Cinematic hero header with satellite telemetry badges and radar animation.
   - Core mission statement and high-level analytical metrics.
   - Fast navigation shortcuts to all platform modules.

2. **Intelligence Dashboard (`/#dashboard`)**:
   - Comprehensive verified metric cards for immediate executive overview.
   - Comparative charts (Original baseline vs. JRC-improved candidate extent).
   - Visual distribution of pixel exclusions and GHSL overlap ratios.
   - Operational status indicator (`INDICATORS_AVAILABLE`).

3. **Interactive Flood Map (`/#map`)**:
   - Dynamic map centered on Silchar, Assam (`[24.8168° N, 92.8000° E]`).
   - Renders 1,189 SAR flood candidate polygons (`outputs/flood/flood_extent_improved.geojson`).
   - Multiple basemaps: CARTO Dark Matter, Esri World Imagery (Satellite), and CARTO Voyager.
   - Click-to-inspect polygon panel displaying exact polygon ID, area in m², hectares (ha), km², and SAR classification.
   - Interactive minimum-area filter (Show all, ≥1 ha, ≥5 ha, ≥10 ha, ≥50 ha) and layer opacity slider.

4. **Flood Detection Analysis (`/#detection`)**:
   - High-resolution comparative imagery (`flood_comparison_improved.png` and `flood_comparison_baseline.png`).
   - Breakdown of radar backscatter physics, 3x3 median speckle filtering, and mathematical thresholding criteria.

5. **Permanent Water Exclusion (`/#exclusion`)**:
   - Scientific methodology behind JRC Global Surface Water occurrence filtering.
   - Visual waterfall/funnel chart tracking the removal of 14,358 permanent-water pixels (1.4358 km² reduction).
   - Detailed explanation of how unclassified pixels are safely preserved.

6. **GHSL Spatial Overlap Analysis (`/#ghsl`)**:
   - European Commission Global Human Settlement Layer (GHSL Silchar 2020) comparison.
   - Quantitative evaluation: 33.1631 km² overlap (18.6670% of improved candidate extent).
   - Clear scientific distinction explaining why GHSL overlap is a spatial screening metric, not confirmed structural destruction.

7. **Economic Activity Context (`/#economic`)**:
   - 24-month NOAA VIIRS Day/Night Band time-series from `outputs/impact/nightlights_monthly.csv`.
   - Dual-view interactive Recharts graph (Nocturnal Radiance vs. Cloud-Free Coverage).
   - Annual radiance change analysis (+2.45%) and monsoon attenuation dynamics.

8. **Integrated Risk Assessment (`/#risk`)**:
   - Structured breakdown of `outputs/integration/risk_result.json`.
   - Explicit confirmation that status is `INDICATORS_AVAILABLE`.
   - Transparent verification matrix displaying that ground-truth validation, depth estimation, and monetary damage figures are unmodeled.

9. **Methodology & Workflow (`/#methodology`)**:
   - 7-stage end-to-end processing pipeline diagram.
   - Sensor instrumentation table (Sentinel-1A, orbit 77, descending pass, 10m spatial resolution).
   - Explicit scientific limitation disclosures.

10. **About & Project Repository (`/#about`)**:
    - Project mission and background.
    - Architecture comparison between Streamlit engine and presentation platform.
    - Direct GitHub repository link: [https://github.com/PRABHUDEVA3016/FloodSentinel](https://github.com/PRABHUDEVA3016/FloodSentinel).
    - Current verified Git branch: `solo-build`.

---

## 6. Verified Scientific Ground Truth

Every metric displayed on the website matches the verified analytical results:

| Metric | Verified Analytical Value |
|---|---:|
| Original Flood Candidate Pixels | 1,790,919 |
| Improved Flood Candidate Pixels | 1,776,561 |
| Permanent-Water Pixels Excluded | 14,358 |
| Original Candidate Area | 179.0919 km² |
| Excluded Permanent-Water Area | 1.4358 km² |
| Improved Candidate Area | 177.6561 km² |
| Extracted Improved Polygons | 1,189 |
| Original GHSL Overlap Pixels | 336,632 |
| Improved GHSL Overlap Pixels | 331,631 |
| Original GHSL Overlap Area | 33.6632 km² |
| Improved GHSL Overlap Area | 33.1631 km² |
| Original GHSL Overlap Percentage | 18.7966% |
| Improved GHSL Overlap Percentage | 18.6670% |
| VIIRS Monthly Observations | 24 |
| Annual VIIRS Radiance Change | +2.45% |
| Integrated Risk Screening Status | `INDICATORS_AVAILABLE` |

---

## 7. Git Branch & Safety Confirmation

- **Current Git Branch**: `solo-build`
- **Branch Switch**: None (never switched from `solo-build`).
- **Original Code**: 0 modifications to `app.py`, `src/`, `data/`, or `outputs/`.
