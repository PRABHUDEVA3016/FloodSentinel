import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  Database, 
  Layers, 
  Building2, 
  Activity, 
  Scale
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { RISK_ASSESSMENT } from '../data/riskData';
import { VERIFIED_METRICS } from '../data/metrics';

export const RiskAssessmentPage: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <SectionHeader
          badge="outputs/integration/risk_result.json"
          title="Integrated Risk Screening Assessment"
          subtitle="Synthesis of microwave radar flood candidates, GHSL urban footprint overlap, and NOAA VIIRS nightlight radiance indicators."
          tagColor="amber"
        />
      </div>

      {/* Primary Screening Status Hero Banner */}
      <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                Official Pipeline Status
              </span>
              <span className="text-xs font-mono text-slate-400">
                Assessment Type: <strong className="text-white">{RISK_ASSESSMENT.assessmentType}</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {RISK_ASSESSMENT.screeningStatus}
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Multi-Criteria Pre-Screening Ready
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {RISK_ASSESSMENT.reason}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 space-y-2 shrink-0 lg:w-72">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Study Domain Telemetry
            </div>
            <div className="text-sm font-bold text-white">{RISK_ASSESSMENT.studyArea}</div>
            <div className="text-xs font-mono text-cyan-400">Coordinates: EPSG:4326 / EPSG:32646</div>
            <div className="pt-1 text-[11px] text-slate-500 font-mono">Status: COMPLETED (read-only)</div>
          </div>
        </div>
      </div>

      {/* Validation Checklist Matrix */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          Rigorous Scientific Verification Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ground Truth */}
          <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Ground-Truth Reference
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                UNVALIDATED
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-slate-200">
                ground_truth_validation: false
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No calibrated high-resolution aerial or RTK-GPS ground-truth polygons are registered for this event.
            </p>
          </div>

          {/* Card 2: Validated Flood Extent */}
          <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Flood Extent Truth
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                SCREENING
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-slate-200">
                validated_flood_extent: false
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Polygons represent radar backscatter drop candidates, not independently certified hydrological inundation depths.
            </p>
          </div>

          {/* Card 3: Monetary Damage Estimation */}
          <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Economic Loss Estimation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                UNMODELED
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="text-sm font-bold text-slate-200">
                monetary_damage_estimated: false
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monetary values, insurance payout figures, and asset depreciation calculations are strictly omitted.
            </p>
          </div>
        </div>
      </div>

      {/* Synthesis Indicators Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Multi-Indicator Synthesis Component Breakdown</h3>
          <p className="text-xs text-slate-400">Underlying empirical measurements feeding into the INDICATORS_AVAILABLE assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Indicator 1 */}
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold font-mono">
              <Layers className="w-4 h-4" />
              <span>1. Microwave Radar Layer</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Candidate Area:</span>
                <span className="text-white font-bold">{VERIFIED_METRICS.improvedCandidateAreaKm2} km²</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Candidate Pixels:</span>
                <span className="text-white font-bold">{VERIFIED_METRICS.improvedCandidatePixels.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Permanent Water Excluded:</span>
                <span className="text-rose-400 font-bold">14,358 px</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              Specular attenuation screening isolates candidate open-water anomalies.
            </p>
          </div>

          {/* Indicator 2 */}
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono">
              <Building2 className="w-4 h-4" />
              <span>2. Urban Settlement Coincidence</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>GHSL Overlap Area:</span>
                <span className="text-white font-bold">{VERIFIED_METRICS.improvedGhslOverlapAreaKm2} km²</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Overlap Percentage:</span>
                <span className="text-amber-300 font-bold">{VERIFIED_METRICS.improvedGhslOverlapPercent.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reference Layer:</span>
                <span className="text-white">GHSL 2020 (100m)</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              Spatial coincidence indicates settlement proximity, not confirmed destruction.
            </p>
          </div>

          {/* Indicator 3 */}
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Activity className="w-4 h-4" />
              <span>3. Economic Luminosity Trend</span>
            </div>
            <div className="space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Time Horizon:</span>
                <span className="text-white font-bold">24 Monthly Epochs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Annual Radiance Change:</span>
                <span className="text-emerald-300 font-bold">+{VERIFIED_METRICS.annualViirsRadianceChangePercent}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sensor Source:</span>
                <span className="text-white">Suomi VIIRS DNB</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              Macroeconomic nocturnal light proxy captures seasonal variations.
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Scientific Limitations */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/60 p-6 space-y-4">
        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Explicit Methodological Limitations (outputs/integration/risk_result.json)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {RISK_ASSESSMENT.limitations.map((limit, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-navy-950 border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
              <span className="text-slate-300 leading-relaxed">{limit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Integrity Notice */}
      <DisclaimerBanner
        type="warning"
        title="Scientific Integrity: Non-Fabrication Rule"
        message="FloodSentinel strictly refuses to fabricate arbitrary probability scores (e.g. 84.7% flood probability) or synthetic damage totals. The status 'INDICATORS_AVAILABLE' accurately and ethically describes the current operational readiness of multi-source remote sensing indicators."
      />
    </div>
  );
};
