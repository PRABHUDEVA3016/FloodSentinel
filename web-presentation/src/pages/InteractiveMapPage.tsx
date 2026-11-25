import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Maximize2, 
  Sliders, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { VERIFIED_METRICS } from '../data/metrics';

interface SelectedPolygonInfo {
  id: number | string;
  classification: string;
  areaM2: number;
  areaHa: number;
  areaKm2: number;
}

// Basemap tile definitions
const BASEMAP_CONFIGS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// Check if a Leaflet map instance is fully active, mounted, and possesses its DOM panes
function isMapActive(map: L.Map | null): map is L.Map {
  if (!map) return false;
  const m = map as any;
  return Boolean(m._container && m._panes && m._mapPane && m._container.parentNode);
}

export const InteractiveMapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [polygonCount, setPolygonCount] = useState(0);
  const [selectedPolygon, setSelectedPolygon] = useState<SelectedPolygonInfo | null>(null);
  const [basemap, setBasemap] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [opacity, setOpacity] = useState(0.75);
  const [minAreaFilter, setMinAreaFilter] = useState<number>(0);
  const [geojsonRawData, setGeojsonRawData] = useState<any>(null);

  // Safe GeoJSON Layer Renderer
  const renderGeojsonLayer = useCallback((
    map: L.Map, 
    data: any, 
    filterMinM2: number, 
    currentOpacity: number
  ) => {
    if (!isMapActive(map)) return;

    // Safely remove existing layer if present
    if (geojsonLayerRef.current) {
      try {
        if (map.hasLayer(geojsonLayerRef.current)) {
          map.removeLayer(geojsonLayerRef.current);
        }
      } catch (e) {
        // Ignore detachment errors on old layer
      }
      geojsonLayerRef.current = null;
    }

    try {
      const layer = L.geoJSON(data, {
        filter: (feature) => {
          if (!filterMinM2) return true;
          return (feature.properties?.area_m2 || 0) >= filterMinM2;
        },
        style: (feature) => {
          const area = feature?.properties?.area_m2 || 0;
          const isLarge = area > 50000;
          return {
            color: isLarge ? '#38BDF8' : '#06B6D4',
            weight: 1.5,
            opacity: 0.9,
            fillColor: '#0284C7',
            fillOpacity: currentOpacity * (isLarge ? 0.75 : 0.6)
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const props = feature.properties || {};
          const areaM2 = props.area_m2 || 0;
          const areaHa = Number((areaM2 / 10000).toFixed(2));
          const areaKm2 = Number((areaM2 / 1000000).toFixed(4));
          const polyId = props.id || 'N/A';
          const classification = props.classification || 'SAR_FLOOD_CANDIDATE_AFTER_JRC_SCREENING';

          featureLayer.on({
            mouseover: (e) => {
              const target = e.target;
              if (target.setStyle) {
                target.setStyle({
                  weight: 2.5,
                  color: '#38BDF8',
                  fillOpacity: 0.9
                });
              }
              if (target.bringToFront) {
                target.bringToFront();
              }
            },
            mouseout: (e) => {
              if (geojsonLayerRef.current && isMapActive(map)) {
                geojsonLayerRef.current.resetStyle(e.target);
              }
            },
            click: (e) => {
              setSelectedPolygon({
                id: polyId,
                classification,
                areaM2,
                areaHa,
                areaKm2
              });
              L.DomEvent.stopPropagation(e);
            }
          });
        }
      });

      // Verify map is still valid immediately before adding
      if (!isMapActive(map)) return;

      layer.addTo(map);
      geojsonLayerRef.current = layer;

      // Ensure proper sizing
      setTimeout(() => {
        if (isMapActive(map)) {
          map.invalidateSize();
        }
      }, 50);

    } catch (err: any) {
      console.error('Error rendering GeoJSON layer:', err);
      if (isMountedRef.current) {
        setLoadError(err?.message || 'Error rendering flood polygon layer');
      }
    }
  }, []);

  // Fetch GeoJSON data safely with AbortController
  const fetchGeojsonData = useCallback(async (map: L.Map) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setLoadError(null);
      }

      let response = await fetch('/data/flood_extent_improved_fast.json', { signal: controller.signal });
      if (!response.ok) {
        response = await fetch('/data/flood_extent_improved.geojson', { signal: controller.signal });
      }
      if (!response.ok) {
        throw new Error(`Failed to load flood extent GeoJSON (HTTP ${response.status})`);
      }

      const data = await response.json();

      // Check if component is still mounted and map is active
      if (!isMountedRef.current) return;
      const activeMap = mapInstanceRef.current;
      if (!isMapActive(activeMap)) return;

      setGeojsonRawData(data);
      setPolygonCount(data.features?.length || 0);

      renderGeojsonLayer(activeMap, data, minAreaFilter, opacity);

      if (isMountedRef.current) {
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Ignore aborted requests on unmount
        return;
      }
      console.error('GeoJSON fetch error:', err);
      if (isMountedRef.current) {
        setLoadError(err?.message || 'Error loading GeoJSON layer');
        setLoading(false);
      }
    }
  }, [minAreaFilter, opacity, renderGeojsonLayer]);

  // Set up basemap tile layer safely
  const updateBasemapTiles = useCallback((map: L.Map, style: 'dark' | 'satellite' | 'streets') => {
    if (!isMapActive(map)) return;

    if (tileLayerRef.current) {
      try {
        if (map.hasLayer(tileLayerRef.current)) {
          map.removeLayer(tileLayerRef.current);
        }
      } catch (e) {
        // Ignore
      }
      tileLayerRef.current = null;
    }

    const cfg = BASEMAP_CONFIGS[style];
    const newTiles = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19
    });

    if (isMapActive(map)) {
      newTiles.addTo(map);
      tileLayerRef.current = newTiles;

      if (geojsonLayerRef.current && map.hasLayer(geojsonLayerRef.current)) {
        geojsonLayerRef.current.bringToFront();
      }
    }
  }, []);

  // Main Map Lifecycle Effect
  useEffect(() => {
    isMountedRef.current = true;
    const container = mapContainerRef.current;
    if (!container) return;

    // Clean up any stale map instance or leftover DOM state on container
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    // Initialize Leaflet Map
    const map = L.map(container, {
      center: [24.8168, 92.8000],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      preferCanvas: true
    });

    // Add Zoom Control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Set initial basemap
    updateBasemapTiles(map, basemap);

    mapInstanceRef.current = map;

    // Add Silchar Center Pin
    const silcharIcon = L.divIcon({
      className: 'custom-silchar-pin',
      html: `
        <div style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; background:rgba(6,182,212,0.25); border:2px solid #06B6D4; border-radius:50%; box-shadow:0 0 12px #06B6D4;">
          <div style="width:8px; height:8px; background:#38BDF8; border-radius:50%;"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([24.8333, 92.7789], { icon: silcharIcon });
    marker.addTo(map).bindPopup(`
      <div style="font-family:inherit; padding:4px;">
        <strong style="color:#38BDF8;">Silchar Municipal Area</strong><br/>
        <span style="font-size:11px; color:#94A3B8;">Cachar District, Assam, India</span><br/>
        <span style="font-size:10px; color:#06B6D4; font-family:monospace;">Lat: 24.8333°, Lng: 92.7789°</span>
      </div>
    `);

    // Ensure map is fully ready and DOM is sized before fetching and rendering GeoJSON
    map.whenReady(() => {
      if (isMountedRef.current && isMapActive(map)) {
        map.invalidateSize();
        fetchGeojsonData(map);
      }
    });

    // Teardown cleanup
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (geojsonLayerRef.current) {
        try {
          if (map.hasLayer(geojsonLayerRef.current)) {
            map.removeLayer(geojsonLayerRef.current);
          }
        } catch (e) {}
        geojsonLayerRef.current = null;
      }
      if (tileLayerRef.current) {
        try {
          if (map.hasLayer(tileLayerRef.current)) {
            map.removeLayer(tileLayerRef.current);
          }
        } catch (e) {}
        tileLayerRef.current = null;
      }
      try {
        map.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
      if (container) {
        delete (container as any)._leaflet_id;
      }
    };
  }, []); // Run once on mount

  // React to basemap switch
  const handleBasemapChange = (style: 'dark' | 'satellite' | 'streets') => {
    setBasemap(style);
    if (mapInstanceRef.current) {
      updateBasemapTiles(mapInstanceRef.current, style);
    }
  };

  // React to opacity slider changes without re-adding layer
  useEffect(() => {
    if (!geojsonLayerRef.current) return;
    geojsonLayerRef.current.setStyle({
      fillOpacity: opacity * 0.7
    });
  }, [opacity]);

  // React to Min Area Filter changes using cached raw GeoJSON data
  useEffect(() => {
    const activeMap = mapInstanceRef.current;
    if (isMapActive(activeMap) && geojsonRawData) {
      renderGeojsonLayer(activeMap, geojsonRawData, minAreaFilter, opacity);
    }
  }, [minAreaFilter, geojsonRawData, opacity, renderGeojsonLayer]);

  // Fit bounds helper
  const handleFitBounds = () => {
    const activeMap = mapInstanceRef.current;
    if (isMapActive(activeMap) && geojsonLayerRef.current) {
      try {
        const bounds = geojsonLayerRef.current.getBounds();
        if (bounds.isValid()) {
          activeMap.fitBounds(bounds, { padding: [30, 30] });
        }
      } catch (e) {
        console.warn('Could not fit bounds:', e);
      }
    }
  };

  // Reset to Silchar view
  const handleResetView = () => {
    const activeMap = mapInstanceRef.current;
    if (isMapActive(activeMap)) {
      activeMap.setView([24.8168, 92.8000], 11);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <SectionHeader
          badge="High-Precision Vector Cartography"
          title="Interactive SAR Flood Candidate Map"
          subtitle="Explore the 1,189 Sentinel-1 SAR flood candidate polygons for Silchar, Assam (June 2022 flood event) with 90% JRC permanent surface water screening."
          tagColor="cyan"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/data/flood_extent_improved.geojson"
            download="flood_extent_improved.geojson"
            className="px-3.5 py-2 rounded-lg bg-navy-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            title="Download full 32.5MB GeoJSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Download WGS84 GeoJSON
          </a>

          <button
            onClick={handleFitBounds}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Fit Extent
          </button>
        </div>
      </div>

      {/* Layer Identification & Screening Disclaimer Ribbon */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-white">Active Layer:</span>
          <span className="font-mono text-cyan-300">outputs/flood/flood_extent_improved.geojson</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]">
            EPSG:4326 (WGS84)
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Screening Classification: <strong className="text-cyan-400">SAR_FLOOD_CANDIDATES</strong>
        </div>
      </div>

      {/* Map Workplace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Map View (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-navy-950 shadow-2xl h-[560px] sm:h-[640px]">
            {/* Leaflet map container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-20 bg-navy-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <div className="text-xs font-mono text-cyan-300 font-semibold tracking-wider">
                  Loading 1,189 SAR Vector Polygons...
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {loadError && (
              <div className="absolute inset-0 z-20 bg-navy-950/90 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertTriangle className="w-10 h-10 text-rose-400" />
                <div className="text-sm font-semibold text-rose-300">Failed to render flood polygon layer</div>
                <div className="text-xs text-slate-400 max-w-md">{loadError}</div>
                <button
                  onClick={() => {
                    const activeMap = mapInstanceRef.current;
                    if (isMapActive(activeMap)) {
                      fetchGeojsonData(activeMap);
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="mt-2 px-4 py-2 rounded-lg bg-navy-800 border border-slate-700 text-xs font-mono text-cyan-400 cursor-pointer hover:border-cyan-400"
                >
                  Retry Loading Polygons
                </button>
              </div>
            )}

            {/* Floating Quick Map Controls (Top Left) */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {/* Basemap Switcher */}
              <div className="p-1.5 rounded-xl bg-navy-950/90 backdrop-blur-md border border-slate-800 shadow-xl flex items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => handleBasemapChange('dark')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    basemap === 'dark' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dark Matter
                </button>
                <button
                  onClick={() => handleBasemapChange('satellite')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    basemap === 'satellite' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Esri Satellite
                </button>
                <button
                  onClick={() => handleBasemapChange('streets')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    basemap === 'streets' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Voyager
                </button>
              </div>
            </div>

            {/* Floating Legend (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-navy-950/90 backdrop-blur-md border border-slate-800 shadow-xl space-y-2 text-xs font-mono max-w-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Cartographic Legend
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-500/70 border border-cyan-400"></span>
                <span className="text-white text-[11px]">SAR Flood Candidates (Post-JRC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                </span>
                <span className="text-slate-300 text-[11px]">Silchar Municipal Center</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                {polygonCount > 0 ? polygonCount : VERIFIED_METRICS.extractedPolygons} Polygons • 177.66 km² Extent
              </div>
            </div>

            {/* Quick Reset Button (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={handleResetView}
                className="p-2 rounded-xl bg-navy-950/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-cyan-400 shadow-xl transition-colors cursor-pointer"
                title="Reset Camera to Silchar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Inspection Pane (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Polygon Inspector Card */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Polygon Inspector
                </h3>
              </div>
              {selectedPolygon && (
                <button
                  onClick={() => setSelectedPolygon(null)}
                  className="text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {selectedPolygon ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Polygon ID:</span>
                    <span className="text-sm font-bold text-cyan-300 font-mono">#{selectedPolygon.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Area (Hectares):</span>
                    <span className="text-base font-bold text-white font-mono">{selectedPolygon.areaHa} ha</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Area (km²):</span>
                    <span className="text-sm font-mono text-slate-200">{selectedPolygon.areaKm2} km²</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Area (m²):</span>
                    <span className="text-sm font-mono text-slate-200">{selectedPolygon.areaM2.toLocaleString()} m²</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">SAR Classification</div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all">
                    {selectedPolygon.classification}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                  <Info className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
                  Calculated from 10m Sentinel-1 SAR pixels after permanent-water mask subtraction.
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Click any blue polygon on the map to inspect its calculated area and spatial attributes.</p>
                <p className="text-[11px] font-mono text-slate-500">1,189 polygons available</p>
              </div>
            )}
          </div>

          {/* Layer Control Settings */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Filter className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Map Controls & Filter
              </h3>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Layer Opacity</span>
                <span className="text-cyan-400 font-bold">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Minimum Area Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Filter by Min Area</span>
                <span className="text-cyan-400 font-bold">
                  {minAreaFilter === 0 ? 'All Polygons' : `≥ ${(minAreaFilter / 10000).toFixed(0)} ha`}
                </span>
              </div>
              <select
                value={minAreaFilter}
                onChange={(e) => setMinAreaFilter(parseInt(e.target.value))}
                className="w-full p-2 rounded-lg bg-navy-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value={0}>Show All 1,189 Polygons</option>
                <option value={10000}>≥ 1 Hectare (10,000 m²)</option>
                <option value={50000}>≥ 5 Hectares (50,000 m²)</option>
                <option value={100000}>≥ 10 Hectares (100,000 m²)</option>
                <option value={500000}>≥ 50 Hectares (Major Inundation)</option>
              </select>
            </div>

            {/* Layer Stats */}
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Total Polygons:</span>
                <span className="text-white font-bold">{VERIFIED_METRICS.extractedPolygons}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Total Candidate Area:</span>
                <span className="text-cyan-400 font-bold">{VERIFIED_METRICS.improvedCandidateAreaKm2} km²</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Coordinate System:</span>
                <span className="text-white">WGS84 (EPSG:4326)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
