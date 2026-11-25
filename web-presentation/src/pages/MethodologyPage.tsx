import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Filter, 
  Droplets, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Database, 
  ArrowRight,
  ExternalLink,
  Satellite,
  Compass,
  FileCode
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PIPELINE_STAGES, TECHNICAL_SPECIFICATIONS, SCIENTIFIC_LIMITATIONS } from '../data/methodologyData';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-12 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="Scientific Architecture & Workflow"
          title="Methodology & Data Processing Workflow"
          subtitle="Detailed breakdown of the satellite data ingestion, radar speckle attenuation, permanent water screening, settlement overlap, and risk integration algorithms."
          tagColor="cyan"
        />
      </div>

      {/* Visual Pipeline Workflow Diagram */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            End-to-End Scientific Processing Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic spatial pipeline transforming raw Sentinel-1 Level-1 GRD imagery into vectorized decision support layers.
          </p>
        </div>

        {/* Pipeline Step Cards */}
        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="p-5 rounded-xl bg-navy-950 border border-slate-800 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-sm">
                    {stage.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-white">{stage.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900 border border-slate-700 text-cyan-300">
                        {stage.sensorOrData}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {stage.operation}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono shrink-0 lg:w-72 bg-navy-900/70 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Key Parameters</div>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {stage.parameters.slice(0, 3).map((p, idx) => (
                      <li key={idx} className="truncate">• {p}</li>
                    ))}
                  </ul>
                  <div className="pt-1 text-[10px] text-cyan-400 font-mono truncate">
                    Output: {stage.output}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            Sensor Instrumentation & Study Area Parameters
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Exact physical parameters and coordinate systems verified against data_audit.json and docs/methodology.md
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4 font-semibold">System Parameter</th>
                <th className="py-3 px-4 font-semibold">Scientific Specification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {TECHNICAL_SPECIFICATIONS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-cyan-300 font-semibold">{item.item}</td>
                  <td className="py-3 px-4 text-slate-200">{item.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Scientific Limitations Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Rigorous Scientific Limitations & Constraints
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Transparent disclosure of physical remote-sensing constraints per Section 8 guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCIENTIFIC_LIMITATIONS.map((lim, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                {lim.category}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lim.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <DisclaimerBanner
        type="info"
        title="Scientific Reproducibility & Open Source Data"
        message="All processing algorithms are implemented using standard scientific libraries (GDAL, Rasterio, NumPy, SciPy, Shapely). Analysis was conducted on the descending orbit 77 Sentinel-1 pass. Data sources include ESA Copernicus, European Commission JRC, and NOAA EOG."
      />
    </div>
  );
};
