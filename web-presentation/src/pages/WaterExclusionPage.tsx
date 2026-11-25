import React from 'react';
import { 
  Droplets, 
  Filter, 
  ArrowDown, 
  CheckCircle2, 
  ShieldAlert, 
  Database, 
  Layers, 
  AlertCircle
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VERIFIED_METRICS } from '../data/metrics';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const WaterExclusionPage: React.FC = () => {
  const funnelData = [
    { stage: '1. Original SAR Candidates', pixels: 1790919, areaKm2: 179.0919, fill: '#0284C7' },
    { stage: '2. Permanent Water Purged', pixels: 14358, areaKm2: 1.4358, fill: '#EF4444' },
    { stage: '3. Improved Candidates', pixels: 1776561, areaKm2: 177.6561, fill: '#06B6D4' }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="JRC Global Surface Water v1.4"
          title="Permanent Water Masking Methodology"
          subtitle="Filtering persistent historical river channels and perennial water bodies using the European Commission Joint Research Centre 38-year water occurrence archive."
          tagColor="blue"
        />
      </div>

      {/* Rationale & Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Why Permanent-Water Exclusion is Mandatory
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Standard radar backscatter thresholding flags any open, specular water body. Without historical water screening, permanent perennial rivers (such as the main channel of the Barak River in Silchar), wetlands, and municipal reservoirs are incorrectly reported as newly flooded land.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            By overlaying high-resolution JRC occurrence data, FloodSentinel separates persistent water from transient flood inundation, purging <strong className="text-rose-400 font-mono">14,358 permanent-water pixels</strong> from the initial screening mask.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Occurrence Threshold</span>
              <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">≥ {VERIFIED_METRICS.jrcThresholdPercent}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Historically persistent surface water</p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Candidate Area Reduction</span>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">-0.8017%</div>
              <p className="text-[11px] text-slate-400 mt-1">1.4358 km² perennial water removed</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Existing Pipeline Implementation
              </h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Reference Dataset</span>
                <div className="text-cyan-300 text-[11px]">data/raw/other/jrc_water_occurrence.tif</div>
              </div>

              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Execution Script</span>
                <div className="text-emerald-300 text-[11px]">src/flood/apply_water_exclusion.py</div>
              </div>

              <div className="p-2.5 rounded bg-navy-950 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Generated Improved Raster</span>
                <div className="text-sky-300 text-[11px]">outputs/flood/flood_mask_improved.tif</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-400" />
              Preserves invalid/unclassified JRC pixels instead of falsely assuming they are permanent water.
            </div>
          </div>
        </div>
      </div>

      {/* Waterfall / Funnel Visualization */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Pixel Screening Progression Funnel</h3>
          <p className="text-xs text-slate-400">Quantitative transition from initial radar anomalies to refined flood candidates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Original */}
          <div className="p-5 rounded-xl bg-navy-950 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase font-semibold">
              Step 1 • Initial SAR Baseline
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {VERIFIED_METRICS.originalCandidatePixels.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-cyan-400">179.0919 km² candidate extent</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Raw thresholded pixels from Sentinel-1 VV/VH backscatter change without historical water masking.
            </p>
          </div>

          {/* Card 2: Excluded */}
          <div className="p-5 rounded-xl bg-navy-950 border border-rose-500/40 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase font-semibold">
              Step 2 • JRC Permanent Mask
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              -{VERIFIED_METRICS.excludedWaterPixels.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-rose-300">-1.4358 km² persistent water</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pixels meeting ≥90% water occurrence frequency over 38-year historical record purged from candidate mask.
            </p>
          </div>

          {/* Card 3: Improved */}
          <div className="p-5 rounded-xl bg-navy-950 border border-cyan-500/40 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase font-semibold">
              Step 3 • Improved Candidate Extent
            </span>
            <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
              {VERIFIED_METRICS.improvedCandidatePixels.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-emerald-400">177.6561 km² (1,189 polygons)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Final vector polygons retaining exact Sentinel-1 reference grid and transformed to WGS84 coordinates.
            </p>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="h-64 pt-4 border-t border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 140, bottom: 10 }}>
              <XAxis type="number" stroke="#94A3B8" fontSize={11} domain={[0, 2000000]} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="stage" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                formatter={(val: any, name: any, item: any) => [`${val.toLocaleString()} pixels (${item.payload.areaKm2} km²)`, 'Pixels']}
              />
              <Bar dataKey="pixels" radius={[0, 6, 6, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodological Caveat */}
      <DisclaimerBanner
        type="warning"
        title="Validation Nuance: Screening Step Only"
        message="JRC permanent-water occurrence is a statistical screening step derived from multi-temporal Landsat imagery (1984–2021). It significantly reduces false alarms from known rivers, but does not independently validate that the remaining pixels are confirmed floodwater. Ground-truth hydrological validation is required for legal and underwriting purposes."
      />
    </div>
  );
};
