import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Moon, 
  CloudRain, 
  AlertTriangle, 
  Info, 
  Calendar,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { NIGHTLIGHTS_MONTHLY, VIIRS_SUMMARY } from '../data/nightlightsData';
import { VERIFIED_METRICS } from '../data/metrics';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';

export const EconomicContextPage: React.FC = () => {
  const [viewType, setViewType] = useState<'radiance' | 'coverage'>('radiance');
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="NOAA VIIRS DNB Monthly V1 VCMSLCFG"
          title="Economic Activity Context & Nighttime Lights"
          subtitle="Evaluating multi-temporal nocturnal radiance observations (2021–2022) as a regional macroeconomic proxy during the Silchar monsoon flood period."
          tagColor="cyan"
        />
      </div>

      {/* Verified Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Monthly Observations</span>
          <div className="text-2xl font-bold text-white font-mono">{VIIRS_SUMMARY.observations} Months</div>
          <div className="text-xs font-mono text-cyan-400">Jan 2021 – Dec 2022</div>
          <div className="pt-2 text-[11px] text-slate-400">NOAA Day/Night Band</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-emerald-500/30 space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Annual Radiance Change</span>
          <div className="text-2xl font-bold text-emerald-300 font-mono">+{VIIRS_SUMMARY.annualChangePct}%</div>
          <div className="text-xs font-mono text-slate-400">2021: 1.0157 → 2022: 1.0406</div>
          <div className="pt-2 text-[11px] text-emerald-400">Macroeconomic baseline recovery</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Monthly Mean Radiance</span>
          <div className="text-2xl font-bold text-white font-mono">{VIIRS_SUMMARY.monthlyMeanRadiance.toFixed(4)}</div>
          <div className="text-xs font-mono text-slate-400">nW/(cm²·sr)</div>
          <div className="pt-2 text-[11px] text-slate-400">Nocturnal luminosity index</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Flood Month Minimum</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">0.0527</div>
          <div className="text-xs font-mono text-rose-300">June 2022 (Monsoon Cloud Peak)</div>
          <div className="pt-2 text-[11px] text-slate-400">Cloud coverage impact observed</div>
        </div>
      </div>

      {/* Main Interactive Recharts Time Series */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              24-Month VIIRS Radiance & Cloud-Free Coverage Time Series
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Data sourced directly from outputs/impact/nightlights_monthly.csv
            </p>
          </div>

          <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewType('radiance')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewType === 'radiance' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radiance [nW/(cm²·sr)]
            </button>
            <button
              onClick={() => setViewType('coverage')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewType === 'coverage' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cloud-Free Coverage
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'radiance' ? (
              <AreaChart data={NIGHTLIGHTS_MONTHLY} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="radianceGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} angle={-35} textAnchor="end" height={50} />
                <YAxis stroke="#94A3B8" fontSize={11} unit=" nW" domain={[0, 1.8]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} nW/(cm²·sr)`, 'Radiance']}
                />
                <Area type="monotone" dataKey="radiance" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#radianceGlow)" />
              </AreaChart>
            ) : (
              <BarChart data={NIGHTLIGHTS_MONTHLY} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} angle={-35} textAnchor="end" height={50} />
                <YAxis stroke="#94A3B8" fontSize={11} unit=" days" domain={[0, 18]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} days/observations`, 'Cloud-Free Coverage']}
                />
                <Bar dataKey="cloudFreeCoverage" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Narrative Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <span className="font-mono text-cyan-400 uppercase text-[11px] font-bold">Monsoon Attenuation Dynamics</span>
            <p className="text-slate-300 leading-relaxed">
              Nocturnal radiance sharply dips during June–August each year (0.0527 in June 2022). This drop is primarily caused by persistent monsoonal cloud cover reducing sensor transmittance, coupled with severe localized power outages during peak inundation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 uppercase text-[11px] font-bold">Annual Baseline Growth (+2.45%)</span>
            <p className="text-slate-300 leading-relaxed">
              Despite catastrophic monsoon flooding in June 2022, post-flood dry-season recovery (October–December) demonstrated strong rebound (+2.45% annual radiance increase), indicating persistent regional infrastructure and post-disaster rehabilitation.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Visual Artifacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-mono">outputs/impact/nightlight_change.png</h4>
            <button
              onClick={() => setModalImage('/images/nightlight_change.png')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" /> View Full
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-navy-950">
            <img
              src="/images/nightlight_change.png"
              alt="Nightlight Change Map"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-mono">outputs/impact/growth_history.png</h4>
            <button
              onClick={() => setModalImage('/images/growth_history.png')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" /> View Full
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-navy-950">
            <img
              src="/images/growth_history.png"
              alt="Historical Growth Trend"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Modal image preview */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-navy-950 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-mono text-sm text-cyan-300">{modalImage}</span>
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-1 rounded bg-slate-800 text-white font-mono text-xs hover:bg-slate-700 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
            <img src={modalImage} alt="Analytical Output" className="w-full h-auto max-h-[75vh] object-contain mx-auto rounded-lg" />
          </div>
        </div>
      )}

      {/* Scientific Limitation */}
      <DisclaimerBanner
        type="warning"
        title="Contextual Economic Nuance"
        message={VIIRS_SUMMARY.interpretation}
      />
    </div>
  );
};
