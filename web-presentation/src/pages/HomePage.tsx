import React from 'react';
import { 
  Radar, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  Satellite, 
  Cpu, 
  Globe2, 
  Activity, 
  Droplets,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { PageId } from '../components/Navbar';
import { VERIFIED_METRICS } from '../data/metrics';
import { MetricCard } from '../components/MetricCard';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-navy-900/90 via-navy-950/95 to-navy-950 p-6 sm:p-10 lg:p-14">
        {/* Radar Background Glow & Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Sentinel-1A SAR Dual-Pol
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800/80 border border-slate-700 text-slate-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Silchar, Assam, India
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              Status: {VERIFIED_METRICS.integratedRiskStatus}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Satellite Intelligence for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              Flood Impact Assessment
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            A scientific geospatial intelligence platform providing radar-derived flood candidate screening, historical permanent water exclusion, urban footprint overlap, and contextual nightlight activity monitoring during the June 2022 Assam flood crisis.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Explore Intelligence Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-cyan-500/40 text-cyan-300 font-semibold text-sm transition-all hover:border-cyan-400 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Interactive Flood Map (1,189 Polygons)
            </button>

            <button
              onClick={() => onNavigate('methodology')}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Scientific Methodology
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Quick Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Pre-Flood SAR</span>
            <div className="text-sm font-bold text-white font-mono">{VERIFIED_METRICS.preEventDate}</div>
            <div className="text-[10px] text-slate-400">Baseline VV/VH Acquisition</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Post-Flood SAR</span>
            <div className="text-sm font-bold text-cyan-400 font-mono">{VERIFIED_METRICS.postEventDate}</div>
            <div className="text-[10px] text-slate-400">Peak Flood Detection</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Water Exclusion</span>
            <div className="text-sm font-bold text-emerald-400 font-mono">≥ {VERIFIED_METRICS.jrcThresholdPercent}% JRC</div>
            <div className="text-[10px] text-slate-400">14,358 Water Pixels Removed</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Git Worktree</span>
            <div className="text-sm font-bold text-sky-400 font-mono">solo-build</div>
            <div className="text-[10px] text-slate-400">Preserved Scientific Engine</div>
          </div>
        </div>
      </div>

      {/* Verified Core Metrics Showcase */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Verified Scientific Indicators
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Rigorous analytical outputs verified against the original pipeline results.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            Full Dashboard <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Improved Candidate Area"
            value={VERIFIED_METRICS.improvedCandidateAreaKm2}
            unit="km²"
            change="-1.44 km² JRC exclusion"
            changeType="improved"
            icon={Layers}
            description="Excludes permanent surface water"
            highlight={true}
          />

          <MetricCard
            title="Candidate Pixels"
            value={VERIFIED_METRICS.improvedCandidatePixels}
            unit="pixels"
            change="14,358 excluded"
            changeType="improved"
            icon={Radar}
            description="10m Sentinel-1 SAR spatial grid"
          />

          <MetricCard
            title="Vector Polygons"
            value={VERIFIED_METRICS.extractedPolygons}
            unit="polygons"
            tag="EPSG:4326 (WGS84)"
            icon={Globe2}
            description="Discrete contiguous flood candidates"
          />

          <MetricCard
            title="GHSL Spatial Overlap"
            value={VERIFIED_METRICS.improvedGhslOverlapPercent.toFixed(2)}
            unit="%"
            change="33.16 km² overlap"
            changeType="neutral"
            icon={Cpu}
            description="Spatial screening indicator"
          />
        </div>
      </div>

      {/* Visual Comparison Teaser */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase font-semibold">
              Before & After Verification
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Permanent-Water Masking & Backscatter Differencing
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standard radar flood detection mistakenly flags persistent river channels and lakes as newly flooded areas. FloodSentinel incorporates 38 years of JRC historical water occurrence, screening out 14,358 permanent-water pixels to deliver refined flood candidate boundaries.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('detection')}
                className="px-4 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                Inspect Detection Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('exclusion')}
                className="px-4 py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                JRC 90% Methodology
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative group rounded-xl overflow-hidden border border-slate-700/60 bg-navy-950 shadow-2xl">
              <img
                src="/images/flood_comparison_improved.png"
                alt="FloodSentinel Comparison Analysis"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Baseline SAR vs. Improved JRC Filtered SAR
                </span>
                <span className="text-slate-400">outputs/flood/flood_comparison_improved.png</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Geospatial Intelligence Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Multi-Sensor Scientific Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            End-to-end processing pipeline fusing microwave synthetic aperture radar with human settlement models and nightlight radiometry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate('detection')}
            className="p-6 rounded-xl border border-slate-800 bg-navy-900/50 hover:border-cyan-500/40 hover:bg-navy-900/80 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Radar className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Sentinel-1 SAR Detection
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dual-polarization (VV/VH) radar backscatter change differencing with 3x3 median speckle attenuation.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400 gap-1 font-semibold">
              Explore Module <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('exclusion')}
            className="p-6 rounded-xl border border-slate-800 bg-navy-900/50 hover:border-sky-500/40 hover:bg-navy-900/80 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
              JRC Permanent Water Mask
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              38-year global surface water occurrence filtering with 90% threshold to isolate transient inundation.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-sky-400 gap-1 font-semibold">
              Explore Module <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('ghsl')}
            className="p-6 rounded-xl border border-slate-800 bg-navy-900/50 hover:border-blue-500/40 hover:bg-navy-900/80 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              GHSL Exposure Screening
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Global Human Settlement Layer spatial overlap analysis (33.16 km² built-up intersection).
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-blue-400 gap-1 font-semibold">
              Explore Module <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('economic')}
            className="p-6 rounded-xl border border-slate-800 bg-navy-900/50 hover:border-amber-500/40 hover:bg-navy-900/80 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              VIIRS Economic Context
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              24-month NOAA nightlight radiance time series evaluating ambient electrification trends.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-amber-400 gap-1 font-semibold">
              Explore Module <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
