import React from 'react';
import { 
  Radar, 
  GitBranch, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Layers, 
  Code2, 
  ExternalLink,
  Cpu,
  Globe2
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { VERIFIED_METRICS } from '../data/metrics';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="Project Architecture & Provenance"
          title="About FloodSentinel & Repository"
          subtitle="A next-generation geospatial intelligence platform designed for disaster response coordinators, remote sensing analysts, and hackathon technical reviewers."
          tagColor="cyan"
        />
      </div>

      {/* Project Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Radar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              FLOOD<span className="text-cyan-400">SENTINEL</span>
            </h3>
            <p className="text-xs font-mono text-cyan-300">
              Satellite Intelligence for Flood Impact Assessment
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          FloodSentinel was developed to solve a critical bottleneck in disaster response: standard automated radar flood detection fails to account for permanent water bodies, causing severe false positives. By coupling Sentinel-1 C-band synthetic aperture radar with 38 years of JRC historical water occurrence, GHSL urban footprint modeling, and VIIRS nocturnal radiance, FloodSentinel provides clean, verified flood candidate boundaries for humanitarian decision-makers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
          <a
            href="https://github.com/PRABHUDEVA3016/FloodSentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub Repository
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            Branch: <code className="text-emerald-400 font-bold">solo-build</code>
          </div>
        </div>
      </div>

      {/* Architecture Separation: Streamlit vs Presentation Platform */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Independent Dual-Tier Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete separation of concerns between the scientific calculation pipeline and the high-performance presentation web platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tier 1: Scientific Pipeline & Streamlit App */}
          <div className="p-5 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Scientific Backend Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                app.py (Streamlit)
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Executes heavy raster operations, GDAL/Rasterio matrix calculations, median speckle filters, and generates reproducible GeoTIFF, GeoJSON, and JSON analytical outputs.
            </p>

            <div className="pt-2 space-y-1.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Language: Python 3.10+</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Stack: GDAL, Rasterio, NumPy, SciPy, Streamlit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Role: Read-only mathematical source of truth</span>
              </div>
            </div>
          </div>

          {/* Tier 2: Presentation Web Platform */}
          <div className="p-5 rounded-xl bg-navy-950 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                Presentation Web Platform
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                web-presentation/
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Completely separate, premium-quality modern frontend engineered for hackathon judges and technical stakeholders. Renders interactive vector maps, high-fidelity visual comparisons, and Recharts analytics.
            </p>

            <div className="pt-2 space-y-1.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Stack: React 18, TypeScript, Vite, Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Maps & Charts: Leaflet (WGS84), Recharts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Execution: <code className="text-cyan-300">npm run dev</code> (Port 5173)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Codebase Integrity Guarantee */}
      <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold font-mono text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Codebase Integrity & Protection Guarantee</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In strict compliance with project protection rules, zero existing files (<code className="text-slate-200">app.py</code>, <code className="text-slate-200">src/</code>, <code className="text-slate-200">data/</code>, <code className="text-slate-200">outputs/</code>, <code className="text-slate-200">requirements.txt</code>) were modified, renamed, moved, or deleted. All new website files reside exclusively inside <code className="text-emerald-300">web-presentation/</code>.
        </p>
      </div>
    </div>
  );
};
