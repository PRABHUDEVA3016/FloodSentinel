import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Layers, 
  ShieldAlert, 
  Droplets, 
  Building2, 
  Activity, 
  Radar, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  MapPin,
  Download
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { MetricCard } from '../components/MetricCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VERIFIED_METRICS } from '../data/metrics';
import { PageId } from '../components/Navbar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'screening'>('overview');

  // Chart data: Candidate Area comparison
  const areaComparisonData = [
    {
      name: 'Original SAR Candidates',
      areaKm2: VERIFIED_METRICS.originalCandidateAreaKm2,
      pixels: VERIFIED_METRICS.originalCandidatePixels,
      fill: '#0284C7'
    },
    {
      name: 'Improved (Post-JRC 90%)',
      areaKm2: VERIFIED_METRICS.improvedCandidateAreaKm2,
      pixels: VERIFIED_METRICS.improvedCandidatePixels,
      fill: '#06B6D4'
    }
  ];

  // Chart data: GHSL Overlap comparison
  const ghslComparisonData = [
    {
      category: 'Original Overlap',
      areaKm2: VERIFIED_METRICS.originalGhslOverlapAreaKm2,
      percentage: VERIFIED_METRICS.originalGhslOverlapPercent,
      pixels: VERIFIED_METRICS.originalGhslOverlapPixels,
      fill: '#F59E0B'
    },
    {
      category: 'Improved Overlap',
      areaKm2: VERIFIED_METRICS.improvedGhslOverlapAreaKm2,
      percentage: VERIFIED_METRICS.improvedGhslOverlapPercent,
      pixels: VERIFIED_METRICS.improvedGhslOverlapPixels,
      fill: '#10B981'
    }
  ];

  // Pie Data: Exclusion breakdown
  const exclusionPieData = [
    { name: 'Remaining SAR Candidates', value: VERIFIED_METRICS.improvedCandidatePixels, color: '#06B6D4' },
    { name: 'Excluded Permanent Water', value: VERIFIED_METRICS.excludedWaterPixels, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <SectionHeader
          badge="Verified Operational Intelligence"
          title="FloodSentinel Intelligence Dashboard"
          subtitle="Real-time analytical metrics derived from Sentinel-1 SAR backscatter change, JRC historical water screening, and GHSL exposure layers for Silchar, Assam."
          tagColor="cyan"
        />

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Radar className="w-4 h-4" />
            Open Interactive Map
          </button>
        </div>
      </div>

      {/* Operational Status Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white font-mono">
                Screening Status: {VERIFIED_METRICS.integratedRiskStatus}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                100% Pipeline Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Satellite multi-criteria indicators are fully loaded. Permanent-water exclusion and urban screening completed.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 shrink-0 self-end md:self-auto">
          Study Area: <span className="text-white font-semibold">{VERIFIED_METRICS.studyArea}</span>
        </div>
      </div>

      {/* Key Metric Cards Grid (Section 7 Verified Values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Improved Candidate Area"
          value={VERIFIED_METRICS.improvedCandidateAreaKm2}
          unit="km²"
          change="-1.4358 km² excluded"
          changeType="improved"
          icon={Layers}
          description="Baseline: 179.0919 km²"
          highlight={true}
        />

        <MetricCard
          title="Candidate Pixels"
          value={VERIFIED_METRICS.improvedCandidatePixels}
          unit="pixels"
          change="-14,358 pixels"
          changeType="improved"
          icon={Radar}
          description="Baseline: 1,790,919 pixels"
        />

        <MetricCard
          title="Extracted Polygons"
          value={VERIFIED_METRICS.extractedPolygons}
          unit="polygons"
          tag="WGS84 EPSG:4326"
          icon={MapPin}
          description="flood_extent_improved.geojson"
        />

        <MetricCard
          title="GHSL Spatial Overlap"
          value={VERIFIED_METRICS.improvedGhslOverlapPercent.toFixed(4)}
          unit="%"
          change="33.1631 km² overlap"
          changeType="neutral"
          icon={Building2}
          description="Screening indicator (331,631 px)"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-navy-900/60 border border-slate-800">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">JRC Water Threshold</span>
          <div className="text-lg font-bold text-white font-mono">≥ {VERIFIED_METRICS.jrcThresholdPercent}%</div>
          <p className="text-[10px] text-slate-400">14,358 permanent pixels filtered</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Excluded Area</span>
          <div className="text-lg font-bold text-rose-400 font-mono">{VERIFIED_METRICS.excludedWaterAreaKm2} km²</div>
          <p className="text-[10px] text-slate-400">0.8017% candidate area reduction</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">VIIRS Observations</span>
          <div className="text-lg font-bold text-cyan-400 font-mono">{VERIFIED_METRICS.viirsObservations} Months</div>
          <p className="text-[10px] text-slate-400">2021-2022 monthly time series</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Annual Radiance Change</span>
          <div className="text-lg font-bold text-emerald-400 font-mono">+{VERIFIED_METRICS.annualViirsRadianceChangePercent}%</div>
          <p className="text-[10px] text-slate-400">Regional macroeconomic context</p>
        </div>
      </div>

      {/* Visual Analytics Tabbed Section */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Comparative Scientific Visualizations</h3>
            <p className="text-xs text-slate-400">Original SAR baseline versus post-exclusion improved outputs</p>
          </div>

          <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'overview' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candidate Area
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'comparison' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              GHSL Overlap
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'screening' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pixel Ratio
            </button>
          </div>
        </div>

        {/* Tab 1: Candidate Area Comparison */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} unit=" km²" domain={[170, 182]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                    formatter={(value: any) => [`${value} km²`, 'Area']}
                  />
                  <Bar dataKey="areaKm2" radius={[6, 6, 0, 0]}>
                    {areaComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-navy-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[11px]">Original SAR Baseline</div>
                <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">179.0919 km²</div>
                <div className="text-slate-400 mt-1">1,790,919 pixels detected via dual-pol backscatter thresholds.</div>
              </div>

              <div className="p-3.5 rounded-lg bg-navy-950 border border-cyan-500/30">
                <div className="text-cyan-400 font-mono text-[11px]">Improved Candidate Mask</div>
                <div className="text-xl font-bold text-cyan-300 font-mono mt-0.5">177.6561 km²</div>
                <div className="text-slate-400 mt-1">1,776,561 pixels retained after 14,358 permanent-water pixels excluded.</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                Net area reduction of <span className="text-emerald-400 font-semibold font-mono">1.4358 km² (-0.8017%)</span> enhances target specificity for disaster relief coordination.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GHSL Overlap Comparison */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ghslComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <XAxis dataKey="category" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} unit=" km²" domain={[30, 36]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                    formatter={(value: any) => [`${value} km²`, 'Overlap Area']}
                  />
                  <Bar dataKey="areaKm2" radius={[6, 6, 0, 0]}>
                    {ghslComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-navy-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[11px]">Original GHSL Overlap</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">33.6632 km² (18.80%)</div>
                <div className="text-slate-400 mt-1">336,632 pixels intersecting positive-value GHSL built-up cells.</div>
              </div>

              <div className="p-3.5 rounded-lg bg-navy-950 border border-emerald-500/30">
                <div className="text-emerald-400 font-mono text-[11px]">Improved GHSL Overlap</div>
                <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">33.1631 km² (18.67%)</div>
                <div className="text-slate-400 mt-1">331,631 pixels retained after removing permanent water overlaps.</div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                Screening metric only. GHSL positive-value overlap does not represent confirmed building damage or loss.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Exclusion Ratio */}
        {activeTab === 'screening' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exclusionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {exclusionPieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E293B', borderRadius: '8px' }}
                    formatter={(value: any) => [value.toLocaleString() + ' px', 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[11px] font-mono text-cyan-400">Total SAR Pixels Evaluated</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">1,790,919</div>
                <p className="text-slate-400 mt-1">Sentinel-1 10-meter pixel resolution across Silchar AOI.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-navy-950 border border-rose-500/30">
                <span className="text-[11px] font-mono text-rose-400">Permanent Water Purged</span>
                <div className="text-2xl font-bold text-rose-300 font-mono mt-1">14,358 (0.80%)</div>
                <p className="text-slate-400 mt-1">Pixels meeting ≥90% JRC Global Surface Water occurrence.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <DisclaimerBanner
        type="warning"
        title="Scientific Precision & Integrity Notice"
        message="FloodSentinel produces SAR-derived flood candidates and contextual risk screening indicators. Results are generated for disaster response screening and demonstrative intelligence, and are not an official substitute for calibrated in-situ hydrological gauges, ground-truth building damage surveys, or commercial insurance loss underwriting."
      />
    </div>
  );
};
