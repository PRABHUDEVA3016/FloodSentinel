export interface PipelineStage {
  step: number;
  id: string;
  title: string;
  sensorOrData: string;
  source: string;
  operation: string;
  parameters: string[];
  output: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    id: 'sar-acquisition',
    title: 'Dual-Polarization SAR Acquisition',
    sensorOrData: 'Sentinel-1A C-band SAR',
    source: 'ESA Copernicus Open Access Hub',
    operation: 'Pre-event (18 June 2022) & Post-event (30 June 2022) descending pass (Orbit 77) VV and VH backscatter calibration.',
    parameters: ['Relative Orbit: 77', 'Direction: Descending', 'Polarization: VV + VH', 'Pixel Spacing: 10m'],
    output: 'Calibrated orthorectified gamma0/sigma0 VV and VH rasters'
  },
  {
    step: 2,
    id: 'speckle-change',
    title: 'Speckle Filtering & Change Detection',
    sensorOrData: 'VV Backscatter Change Differencing',
    source: 'Internal NumPy / SciPy Spatial Filter',
    operation: 'A 3x3 median spatial filter reduces radar speckle noise before computing delta backscatter: VV Change = Post-event VV - Pre-event VV.',
    parameters: ['Filter: 3x3 median filter', 'VV Change <= -3 dB drop', 'Post-event VV <= -16 dB', 'Post-event VH <= -20 dB', 'Pre-event VV > -16 dB'],
    output: 'Original flood candidate mask (1,790,919 candidate pixels)'
  },
  {
    step: 3,
    id: 'permanent-water',
    title: 'JRC Permanent-Water Exclusion',
    sensorOrData: 'JRC Global Surface Water Occurrence v1.4',
    source: 'European Commission Joint Research Centre (1984-2021)',
    operation: 'Filters out permanent rivers, lakes, and perennial reservoirs to isolate transient flood candidates from regular water bodies.',
    parameters: ['Occurrence Threshold: >= 90%', 'Preserve invalid/unclassified JRC pixels', 'Excluded Pixels: 14,358 (1.4358 km²)'],
    output: 'Improved flood candidate mask (1,776,561 pixels / 177.6561 km²)'
  },
  {
    step: 4,
    id: 'polygon-vectorization',
    title: 'Vector Polygon Extraction & EPSG:4326 Transform',
    sensorOrData: 'Rasterio / Shapely Vectorizer',
    source: 'Spatial Topology Engine',
    operation: 'Contiguous candidate pixel regions are polygonized into vector geometries and transformed from EPSG:32646 (UTM 46N) to EPSG:4326 (WGS84).',
    parameters: ['Topology simplification: 8-connectivity raster polygonization', 'Target CRS: WGS84 (EPSG:4326)', '1,189 discrete vector polygons'],
    output: 'flood_extent_improved.geojson (1,189 polygons)'
  },
  {
    step: 5,
    id: 'ghsl-overlap',
    title: 'GHSL Urban Footprint Spatial Screening',
    sensorOrData: 'GHSL Built-Up Grid (GHS-BUILT-S R2023A)',
    source: 'European Commission GHSL Team',
    operation: 'Pixel-level spatial intersection between flood candidates and positive built-up surface presence.',
    parameters: ['GHSL Silchar 2020 100m grid', 'Improved overlap: 33.1631 km² (18.67%)', 'Classification: Spatial Screening Indicator ONLY'],
    output: 'Urban footprint spatial screening intersection'
  },
  {
    step: 6,
    id: 'viirs-context',
    title: 'VIIRS Nightlight Economic Activity Context',
    sensorOrData: 'NOAA VIIRS Day/Night Band (DNB) Monthly V1',
    source: 'NOAA Earth Observation Group (EOG)',
    operation: 'Evaluates 24 monthly nighttime radiance observations (2021-2022) to provide macroeconomic ambient context.',
    parameters: ['24 monthly observations', '2021 mean: 1.0157 nW/(cm²·sr)', '2022 mean: 1.0406 nW/(cm²·sr)', 'Annual change: +2.45%'],
    output: 'Macroeconomic nightlight activity time series'
  },
  {
    step: 7,
    id: 'risk-integration',
    title: 'Integrated Risk Screening Synthesis',
    sensorOrData: 'Multi-Criteria Geospatial Integration Engine',
    source: 'FloodSentinel Synthesis Framework',
    operation: 'Combines SAR flood extent candidates, GHSL exposure indicators, and VIIRS activity context into structured operational status.',
    parameters: ['Screening Status: INDICATORS_AVAILABLE', 'Validation: Ground-truth uncalibrated', 'Monetary Loss: Explicitly unmodeled'],
    output: 'risk_result.json comprehensive intelligence assessment'
  }
];

export const TECHNICAL_SPECIFICATIONS = [
  { item: 'Study Area', spec: 'Silchar Municipal Area & Surrounding Cachar District, Assam, India' },
  { item: 'Study Bounding Box', spec: '82°38\'E to 92°57\'E, 24°41\'N to 24°56\'N' },
  { item: 'Primary Radar Instrument', spec: 'Sentinel-1A C-SAR (5.405 GHz center frequency)' },
  { item: 'Acquisition Mode', spec: 'Interferometric Wide (IW) Swath, Ground Range Detected (GRD)' },
  { item: 'Pass Geometry', spec: 'Descending, Relative Orbit 77' },
  { item: 'Temporal Window', spec: 'Pre-flood: 18 June 2022 | Post-flood: 30 June 2022' },
  { item: 'Spatial Resolution', spec: '10m pixel grid (Sentinel-1 SAR), 100m (GHSL), 500m (VIIRS)' },
  { item: 'Permanent Water Source', spec: 'JRC Global Surface Water Occurrence v1.4 (90% threshold)' },
  { item: 'Settlement Reference', spec: 'GHSL (Global Human Settlement Layer) Silchar 2020' },
  { item: 'Nightlight Instrument', spec: 'Suomi-NPP VIIRS Day/Night Band (DNB) Monthly Composites' }
];

export const SCIENTIFIC_LIMITATIONS = [
  {
    category: 'SAR Detection Constraints',
    details: 'Specular reflection on smooth water creates strong backscatter attenuation (drop in dB), but radar layover, shadow in hilly relief, and dense emergent vegetation can obscure standing water.'
  },
  {
    category: 'Permanent-Water Screening',
    details: 'JRC historical surface water occurrence represents historical water frequency through 2021. It is a statistical screening step, not real-time hydrological confirmation. Unclassified pixels are retained.'
  },
  {
    category: 'GHSL Spatial Overlap Nuance',
    details: 'GHSL positive-value overlap indicates spatial coincidence with built-up surface pixels. It must NEVER be reported as confirmed flooded buildings, collapsed structures, or physical damage.'
  },
  {
    category: 'VIIRS Economic Context Nuance',
    details: 'Nighttime light radiance reflects ambient electrification and activity proxy trends, not direct municipal GDP or economic flood damages.'
  },
  {
    category: 'Absence of Ground Truth',
    details: 'The analysis has been structurally verified for raster and coordinate integrity, but has not been calibrated with high-resolution in-situ hydrological gauges or aerial ground-truth reference polygons.'
  }
];
