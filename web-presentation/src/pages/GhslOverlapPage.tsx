import React from 'react';
import { 
  Building2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GHSL_DATA } from '../data/ghslData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const GhslOverlapPage: React.FC = () => {
  const overlapComparisonData = [
    {
      metric: 'Overlap Area (km²)',
      'Original Baseline': GHSL_DATA.originalGhslOverlapKm2,
      'Improved (Post-JRC)': GHSL_DATA.improvedGhslOverlapKm2,
    },
    {
      metric: 'Overlap Percentage (%)',
      'Original Baseline': Number(GHSL_DATA.originalOverlapPercentage.toFixed(2)),
      'Improved (Post-JRC)': Number(GHSL_DATA.improvedOverlapPercentage.toFixed(2)),
    }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="Global Human Settlement Layer (GHSL 2020)"
          title="GHSL Built-Up Spatial Overlap Analysis"
          subtitle="Spatial intersection screening between SAR-derived flood candidates and positive-value built-up surface cells across the Silchar study area."
          tagColor="amber"
        />
      </div>

      {/* Critical Scientific Definition Card */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase font-mono text-xs tracking-wider">
              Essential Scientific Interpretation
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
              Spatial Screening Only
            </span>
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            {GHSL_DATA.interpretation} Overlap indicates that SAR-detected specular attenuation spatially coincides with cells designated as built-up in the 2020 GHSL grid. It does <strong className="text-white">NOT</strong> establish flooded building interiors, structural damage, water depth, or monetary losses.
          </p>
        </div>
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Original GHSL Overlap</span>
          <div className="text-2xl font-bold text-white font-mono">{GHSL_DATA.originalGhslOverlapKm2} km²</div>
          <div className="text-xs font-mono text-slate-400">{GHSL_DATA.originalGhslOverlapPixels.toLocaleString()} pixels</div>
          <div className="pt-2 text-[11px] text-amber-400 font-mono">{GHSL_DATA.originalOverlapPercentage.toFixed(4)}% of candidate area</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-cyan-500/40 space-y-1">
          <span className="text-[11px] font-mono text-cyan-400 uppercase">Improved GHSL Overlap</span>
          <div className="text-2xl font-bold text-cyan-300 font-mono">{GHSL_DATA.improvedGhslOverlapKm2} km²</div>
          <div className="text-xs font-mono text-slate-400">{GHSL_DATA.improvedGhslOverlapPixels.toLocaleString()} pixels</div>
          <div className="pt-2 text-[11px] text-emerald-400 font-mono">{GHSL_DATA.improvedOverlapPercentage.toFixed(4)}% of candidate area</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Overlap Reduction</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">-0.5001 km²</div>
          <div className="text-xs font-mono text-slate-400">-5,001 pixels purged</div>
          <div className="pt-2 text-[11px] text-slate-400">Riverfront water artifacts removed</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Reference Layer</span>
          <div className="text-base font-bold text-slate-200 font-mono truncate">{GHSL_DATA.ghslReference}</div>
          <div className="text-xs font-mono text-slate-400">100m spatial resolution</div>
          <div className="pt-2 text-[11px] text-sky-400 font-mono">EPSG:32646 (UTM 46N)</div>
        </div>
      </div>

      {/* Visual Comparative Analysis */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Comparative Spatial Overlap Distribution</h3>
            <p className="text-xs text-slate-400">Quantifying the impact of permanent-water screening on built-up footprint coincidence</p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-navy-950 px-3 py-1 rounded border border-slate-800">
            outputs/flood/ghsl_overlap_comparison.json
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overlapComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis dataKey="metric" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Original Baseline" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Improved (Post-JRC)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[11px] uppercase">GHSL Grid Specifications</span>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Sensor:</span>
                  <span className="text-white font-mono">Sentinel-2 & Landsat optical fusion</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Epoch:</span>
                  <span className="text-white font-mono">2020 Built-Up Surface</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Evaluation Type:</span>
                  <span className="text-cyan-400 font-mono">Positive-value raster cells (&gt;0)</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 leading-relaxed">
              Before JRC screening, 33.66 km² intersected built-up cells. After excluding persistent riverbeds adjacent to settlements, the candidate footprint refined to 33.16 km² (18.67% of improved candidates).
            </div>
          </div>
        </div>
      </div>

      {/* Rigorous Scientific Disclaimer */}
      <DisclaimerBanner
        type="warning"
        title="Non-Equivalence with Damage Claims"
        message="A positive GHSL overlap indicates proximity to human settlements for prioritization of ground assessment teams. It must not be cited as building damage, structural collapse, displaced population count, or economic dollar loss, as satellite radar cannot determine internal structural water depth without high-resolution in-situ survey data."
      />
    </div>
  );
};
