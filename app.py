
from pathlib import Path
import json

import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import rasterio


# ============================================================
# FLOODSENTINEL - MAIN APPLICATION
# ============================================================

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "outputs"

st.set_page_config(
    page_title="FloodSentinel",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# DATA LOADING
# ============================================================

def load_json(path):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            return {
                "status": "ERROR",
                "reason": str(e)
            }

    return {
        "status": "WAITING",
        "reason": "Output not generated yet."
    }


growth = load_json(OUT / "impact" / "growth_result.json")
economic = load_json(OUT / "impact" / "nightlights_result.json")
orbit = load_json(OUT / "orbit" / "orbit_result.json")
gnss = load_json(OUT / "gnss" / "gnss_result.json")
onboard = load_json(OUT / "onboard" / "onboard_result.json")
flood = load_json(OUT / "flood" / "flood_result.json")
risk = load_json(OUT / "integration" / "risk_result.json")


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title("FLOODSENTINEL")
st.sidebar.caption("Satellite Intelligence Platform")

st.sidebar.divider()

st.sidebar.markdown("""
**Study Area:** Silchar, Assam, India

**Flood Event:** June 2022

**System:** Integrated Decision-Support Prototype
""")

st.sidebar.divider()

st.sidebar.caption(
    "Research prototype. Not an operational flood warning system."
)


# ============================================================
# MAIN HEADER
# ============================================================

st.title("🌍 FloodSentinel")

st.subheader(
    "Satellite-Based Flood Intelligence and Decision Support"
)

st.markdown(
    "An integrated analytical prototype combining satellite "
    "simulation, urban growth analysis, economic activity monitoring "
    "and positioning uncertainty."
)

st.warning(
    "This is a research prototype, not an operational flood warning, "
    "insurance payout assessment or spacecraft command system."
)


# ============================================================
# SYSTEM STATUS
# ============================================================

st.subheader("System Status")

modules = [
    ("Urban Growth", growth),
    ("Economic Activity", economic),
    ("Satellite Orbit", orbit),
    ("Onboard Processing", onboard),
    ("GNSS Simulation", gnss),
    ("Flood Detection", flood),
    ("Risk Engine", risk)
]

cols = st.columns(4)

for i, (name, data) in enumerate(modules):

    with cols[i % 4]:

        status = data.get("status", "WAITING")

        st.metric(
            label=name,
            value=status
        )


st.divider()


# ============================================================
# DASHBOARD NAVIGATION
# ============================================================

tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "Overview",
    "Urban Growth",
    "Economic Activity",
    "Satellite Orbit",
    "Onboard Processing",
    "GNSS",
    "Flood & Risk"
])


# ============================================================
# TAB 1 - OVERVIEW
# ============================================================

with tab1:

    st.header("Project Overview")

    col1, col2, col3, col4 = st.columns(4)

    col1.metric(
        "GHSL Epochs",
        "5"
    )

    col2.metric(
        "VIIRS Observations",
        economic.get("observations", 0)
    )

    col3.metric(
        "Satellite Altitude",
        f"{orbit.get('altitude_km', 0):.0f} km"
    )

    col4.metric(
        "GNSS Samples",
        f"{gnss.get('simulation_samples', 0):,}"
    )

    st.divider()

    st.subheader("System Architecture")

    st.markdown("""
    1. **Satellite Orbit:** Orbital calculations and satellite simulation.
    2. **Onboard Processing:** Data reduction and transmission estimates.
    3. **Flood Detection:** Satellite-based flood observation analysis.
    4. **Urban Growth:** Historical GHSL analysis and experimental prediction.
    5. **Economic Activity:** VIIRS nightlight analysis.
    6. **GNSS:** Position uncertainty simulation.
    7. **Risk Engine:** Integrated flood exposure and decision support.
    """)

    st.divider()

    st.subheader("Current Module Availability")

    status_df = pd.DataFrame([
        {
            "Module": name,
            "Status": data.get("status", "WAITING")
        }
        for name, data in modules
    ])

    st.dataframe(
        status_df,
        use_container_width=True,
        hide_index=True
    )


# ============================================================
# TAB 2 - URBAN GROWTH
# ============================================================

with tab2:

    st.header("Urban Growth Analysis")

    history_path = OUT / "impact" / "growth_history.csv"

    if history_path.exists():

        history = pd.read_csv(history_path)

        st.subheader("Historical GHSL Data")

        st.dataframe(
            history,
            use_container_width=True,
            hide_index=True
        )

        fig = px.line(
            history,
            x="year",
            y="positive_value_cells",
            markers=True,
            title="Historical GHSL Positive-Value Footprint"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

        fig2 = px.line(
            history,
            x="year",
            y="mean_positive_value",
            markers=True,
            title="Mean Positive GHSL Raster Value"
        )

        st.plotly_chart(
            fig2,
            use_container_width=True
        )

    else:

        st.info("GHSL historical data is not available.")

    st.divider()

    st.subheader("Experimental Urban Growth Projection")

    col1, col2 = st.columns(2)

    col1.metric(
        "Forecast Year",
        growth.get("forecast_year", "N/A")
    )

    col2.metric(
        "Forecast Positive Cells",
        growth.get("forecast_positive_cells", "N/A")
    )

    st.write(
        "Mean predicted probability:",
        growth.get("forecast_probability_mean", "N/A")
    )

    st.write(
        "Model:",
        growth.get("model", "N/A")
    )

    st.write(
        "Forecast Status:",
        growth.get("forecast_status", "N/A")
    )

    st.subheader("Model Evaluation")

    st.json(growth.get("validation", {}))

    forecast_path = (
        OUT / "impact" / "growth_probability_2025.tif"
    )

    if forecast_path.exists():

        with rasterio.open(forecast_path) as ds:

            probability_map = ds.read(1)

            st.image(
                probability_map,
                caption="Experimental Urban Growth Probability",
                clamp=True,
                use_container_width=True
            )

    st.warning(
        "This is an experimental model projection, not a validated "
        "urban development forecast. GHSL product semantics and "
        "independent spatial validation must be confirmed."
    )


# ============================================================
# TAB 3 - ECONOMIC ACTIVITY
# ============================================================

with tab3:

    st.header("Economic Activity Analysis")

    st.caption(
        "VIIRS Nighttime Light Radiance — Economic Activity Proxy"
    )

    monthly_path = (
        OUT / "impact" / "nightlights_monthly.csv"
    )

    if monthly_path.exists():

        monthly = pd.read_csv(monthly_path)

        monthly["month"] = pd.to_datetime(
            monthly["month"]
        )

        col1, col2 = st.columns(2)

        col1.metric(
            "Monthly Observations",
            len(monthly)
        )

        annual_change = economic.get("annual_change_pct")

        col2.metric(
            "2021–2022 Change",
            f"{annual_change:.2f}%"
            if annual_change is not None
            else "Unavailable"
        )

        fig = px.line(
            monthly,
            x="month",
            y="baseline_radiance",
            markers=True,
            title="Monthly VIIRS Nightlight Radiance"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

        st.subheader("Monthly Dataset")

        st.dataframe(
            monthly,
            use_container_width=True,
            hide_index=True
        )

    else:

        st.info("VIIRS monthly dataset is unavailable.")

    st.divider()

    st.subheader("Yearly Radiance Summary")

    yearly = economic.get("yearly_mean_radiance", {})

    if yearly:

        yearly_df = pd.DataFrame(
            list(yearly.items()),
            columns=["Year", "Mean Radiance"]
        )

        yearly_df["Year"] = yearly_df["Year"].astype(str)

        fig = px.bar(
            yearly_df,
            x="Year",
            y="Mean Radiance",
            title="Yearly Mean Nightlight Radiance"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    st.info(
        "Nightlight radiance is an indirect economic activity proxy. "
        "It is not a direct measurement of GDP or economic loss."
    )


# ============================================================
# TAB 4 - SATELLITE ORBIT
# ============================================================

with tab4:

    st.header("Satellite Orbit Simulation")

    col1, col2, col3 = st.columns(3)

    col1.metric(
        "Altitude",
        f"{orbit.get('altitude_km', 0):.2f} km"
    )

    col2.metric(
        "Orbital Period",
        f"{orbit.get('orbital_period_minutes', 0):.2f} min"
    )

    col3.metric(
        "Orbital Speed",
        f"{orbit.get('orbital_speed_km_s', 0):.2f} km/s"
    )

    st.divider()

    st.subheader("Orbit Parameters")

    st.json(orbit)

    st.warning(
        "The current orbit is an ideal circular two-body simulation. "
        "It is not flight-validated and does not establish actual "
        "ground-station coverage."
    )


# ============================================================
# TAB 5 - ONBOARD PROCESSING
# ============================================================

with tab5:

    st.header("Onboard Processing & Data Reduction")

    if onboard.get("status") != "COMPLETED":

        st.warning(
            onboard.get(
                "reason",
                "Run the onboard processing module first."
            )
        )

    else:

        col1, col2, col3 = st.columns(3)

        col1.metric(
            "Raw Data",
            f"{onboard.get('raw_data_mb', 0):.4f} MB"
        )

        col2.metric(
            "Reduced Data (Estimated)",
            f"{onboard.get('estimated_reduced_data_mb', 0):.4f} MB"
        )

        col3.metric(
            "Data Reduction",
            f"{onboard.get('estimated_data_reduction_pct', 0):.1f}%"
        )

        st.divider()

        col1, col2 = st.columns(2)

        col1.metric(
            "Transmission Time (Estimated)",
            f"{onboard.get('estimated_transmission_time_sec', 0):.4f} sec"
        )

        col2.metric(
            "Processing Energy (Estimated)",
            f"{onboard.get('estimated_processing_energy_wh', 0):.8f} Wh"
        )

        st.divider()

        st.subheader("Input Dataset Inventory")

        input_files = onboard.get("input_files", [])

        if input_files:

            inventory = pd.DataFrame(input_files)

            st.dataframe(
                inventory,
                use_container_width=True,
                hide_index=True
            )

        st.subheader("Simulation Assumptions")

        st.json(
            onboard.get("assumptions", {})
        )

        st.subheader("Processing Information")

        st.write(
            "Actual local file read time:",
            onboard.get("actual_local_read_time_sec", "N/A"),
            "seconds"
        )

        st.warning(
            "Compression ratio, satellite link speed, onboard "
            "processing rate and power consumption are assumptions. "
            "Laptop file reading is not spacecraft performance."
        )


# ============================================================
# TAB 6 - GNSS
# ============================================================

with tab6:

    st.header("GNSS Positioning Uncertainty")

    col1, col2, col3 = st.columns(3)

    col1.metric(
        "Simulation Samples",
        f"{gnss.get('simulation_samples', 0):,}"
    )

    col2.metric(
        "Mean Position Error",
        f"{gnss.get('mean_position_error_m', 0):.2f} m"
    )

    col3.metric(
        "95th Percentile Error",
        f"{gnss.get('p95_position_error_m', 0):.2f} m"
    )

    st.divider()

    error_image = OUT / "gnss" / "gnss_error.png"

    if error_image.exists():

        st.image(
            str(error_image),
            caption="Simulated GNSS Position Error Distribution",
            use_container_width=True
        )

    st.json(gnss)

    st.warning(
        "This is a simulated Gaussian positioning uncertainty model. "
        "It does not represent measured GNSS or NavIC performance."
    )




# ============================================================
# TAB 7 - FLOOD AND RISK
# ============================================================

with tab7:

    st.header("Flood Intelligence & Risk Assessment")

    # LOAD ORIGINAL AND IMPROVED FLOOD RESULTS
    flood_baseline_path = OUT / "flood" / "baseline" / "flood_result.json"
    flood_improved_path = OUT / "flood" / "flood_result_improved.json"
    ghsl_comparison_path = OUT / "flood" / "ghsl_overlap_comparison.json"

    original_flood = {}
    improved_flood = {}
    ghsl_comparison = {}

    if flood_baseline_path.exists():
        with open(flood_baseline_path, "r", encoding="utf-8") as f:
            original_flood = json.load(f)

    if flood_improved_path.exists():
        with open(flood_improved_path, "r", encoding="utf-8") as f:
            improved_flood = json.load(f)

    if ghsl_comparison_path.exists():
        with open(ghsl_comparison_path, "r", encoding="utf-8") as f:
            ghsl_comparison = json.load(f)

    # ========================================================
    # 1. IMPROVED SAR FLOOD DETECTION
    # ========================================================

    st.subheader("1. Improved SAR Flood Detection")

    if improved_flood:

        col1, col2, col3 = st.columns(3)

        col1.metric(
            "Improved Candidate Area",
            f"{improved_flood.get('candidate_area_km2', 0):.2f} km²"
        )

        col2.metric(
            "Remaining Candidate Pixels",
            f"{improved_flood.get('remaining_candidate_pixels', 0):,}"
        )

        col3.metric(
            "Extracted Polygons",
            f"{improved_flood.get('geojson_polygon_count', 0):,}"
        )

        st.caption(
            "These are SAR-derived flood candidates after historical "
            "water-occurrence screening, not independently confirmed floodwater."
        )

    else:
        st.warning("Improved flood result file is unavailable.")

    flood_image = OUT / "flood" / "flood_comparison.png"

    if flood_image.exists():
        st.image(
            str(flood_image),
            caption="Sentinel-1 Pre-event, Post-event, Backscatter Change and Original Candidate Analysis",
            use_container_width=True
        )

    # IMPROVED MASK
    improved_mask_image = OUT / "flood" / "flood_mask_improved.tif"

    if improved_mask_image.exists():
        st.success(
            "Improved flood mask generated successfully after JRC "
            "historical-water screening."
        )

    st.divider()

    # ========================================================
    # 2. ORIGINAL VS IMPROVED FLOOD COMPARISON
    # ========================================================

    st.subheader("2. Original vs Improved Flood Candidates")

    if original_flood and improved_flood:

        original_area = original_flood.get(
            "candidate_area_km2", 0
        )

        improved_area = improved_flood.get(
            "candidate_area_km2", 0
        )

        excluded_area = improved_flood.get(
            "excluded_area_km2", 0
        )

        excluded_pixels = improved_flood.get(
            "excluded_permanent_water_pixels", 0
        )

        col1, col2, col3 = st.columns(3)

        col1.metric(
            "Original Candidate Area",
            f"{original_area:.2f} km²"
        )

        col2.metric(
            "Improved Candidate Area",
            f"{improved_area:.2f} km²",
            delta=f"{improved_area - original_area:.2f} km²"
        )

        col3.metric(
            "Permanent-Water Area Excluded",
            f"{excluded_area:.2f} km²"
        )

        st.metric(
            "Permanent-Water Pixels Excluded",
            f"{excluded_pixels:,}"
        )

        comparison_df = pd.DataFrame({
            "Version": ["Original", "Improved"],
            "Candidate Area (km²)": [
                original_area,
                improved_area
            ]
        })

        fig = px.bar(
            comparison_df,
            x="Version",
            y="Candidate Area (km²)",
            color="Version",
            title="Original vs Improved Flood Candidate Area"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    else:
        st.warning("Original or improved flood results are unavailable.")

    st.divider()

    # ========================================================
    # 3. GHSL URBAN FOOTPRINT OVERLAP
    # ========================================================

    st.subheader("3. GHSL Urban Footprint Exposure Screening")

    if ghsl_comparison:

        col1, col2 = st.columns(2)

        col1.metric(
            "Original GHSL Positive-Value Overlap",
            f"{ghsl_comparison.get('original_ghsl_overlap_km2', 0):.4f} km²"
        )

        col2.metric(
            "Improved GHSL Positive-Value Overlap",
            f"{ghsl_comparison.get('improved_ghsl_overlap_km2', 0):.4f} km²"
        )

        col1, col2 = st.columns(2)

        col1.metric(
            "Original Candidate Overlap",
            f"{ghsl_comparison.get('original_overlap_percentage', 0):.2f}%"
        )

        col2.metric(
            "Improved Candidate Overlap",
            f"{ghsl_comparison.get('improved_overlap_percentage', 0):.2f}%"
        )

        overlap_df = pd.DataFrame({
            "Version": ["Original", "Improved"],
            "GHSL Overlap Area (km²)": [
                ghsl_comparison.get("original_ghsl_overlap_km2", 0),
                ghsl_comparison.get("improved_ghsl_overlap_km2", 0)
            ]
        })

        fig = px.bar(
            overlap_df,
            x="Version",
            y="GHSL Overlap Area (km²)",
            color="Version",
            title="GHSL Positive-Value Spatial Overlap"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    else:
        st.warning("GHSL overlap comparison file is unavailable.")

    st.caption(
        "GHSL positive-value overlap is a spatial screening indicator. "
        "It does not confirm flooded buildings, infrastructure exposure, "
        "or monetary damage."
    )

    st.divider()

    # ========================================================
    # 4. ECONOMIC ACTIVITY CONTEXT
    # ========================================================

    st.subheader("4. Economic Activity Context")

    economic_context = risk.get(
        "economic_activity_context", {}
    )

    col1, col2 = st.columns(2)

    col1.metric(
        "VIIRS Observations",
        economic_context.get("viirs_observations", 0)
    )

    annual_change = economic_context.get(
        "annual_radiance_change_pct"
    )

    col2.metric(
        "2021–2022 Radiance Change",
        f"{annual_change:.2f}%"
        if annual_change is not None else "Unavailable"
    )

    yearly = economic_context.get(
        "yearly_mean_radiance", {}
    )

    if yearly:

        yearly_df = pd.DataFrame(
            list(yearly.items()),
            columns=["Year", "Mean Radiance"]
        )

        fig = px.bar(
            yearly_df,
            x="Year",
            y="Mean Radiance",
            title="Annual Mean VIIRS Radiance"
        )

        st.plotly_chart(
            fig,
            use_container_width=True
        )

    st.caption(
        "VIIRS night-time radiance is a regional economic-activity proxy, "
        "not a direct measurement of GDP or flood-related economic loss."
    )

    st.divider()

    # ========================================================
    # 5. INTEGRATED RISK ASSESSMENT
    # ========================================================

    st.subheader("5. Integrated Risk Assessment")

    conclusion = risk.get(
        "assessment_conclusion", {}
    )

    st.metric(
        "Assessment Status",
        conclusion.get("screening_status", "WAITING")
    )

    st.json(conclusion)

    st.subheader("6. Model Limitations")

    limitations = improved_flood.get("limitations", [])

    for limitation in limitations:
        st.warning(limitation)

    st.info(
        "FloodSentinel currently provides SAR-derived flood candidates, "
        "historical-water screening, GHSL spatial overlap, and VIIRS "
        "economic-activity context. Independent flood validation and "
        "verified asset data are required before operational risk "
        "classification or monetary damage estimation."
    )

# ============================================================
# FOOTER
# ============================================================

st.divider()

st.caption(
    "FloodSentinel | Solo Development | Research Prototype | "
    "Silchar, Assam, India"
)

st.caption(
    "All simulated values, assumptions and estimated outputs "
    "must be distinguished from real observations."
)
