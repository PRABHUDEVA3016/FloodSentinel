import React, { useState } from 'react';
import { 
  Layers, 
  Radar, 
  Satellite, 
  Eye, 
  CheckCircle2, 
  Filter, 
  Zap, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VERIFIED_METRICS } from '../data/metrics';

export const FloodDetectionPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<'improved' | 'baseline'>('improved');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <SectionHeader
          badge="SAR Backscatter Differencing"
          title="Sentinel-1 SAR Flood Detection Analysis"
          subtitle="Dual-polarization (VV/VH) C-band Synthetic Aperture Radar change detection comparing pre-flood (18 June 2022) and post-flood (30 June 2022) acquisitions over Silchar."
          tagColor="cyan"
        />

        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSelectedImage('improved')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedImage === 'improved'
                ? 'bg-cyan-500 text-navy-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Improved Comparison
          </button>
          <button
            onClick={() => setSelectedImage('baseline')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedImage === 'baseline'
                ? 'bg-cyan-500 text-navy-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline Comparison
          </button>
        </div>
      </div>

      {/* Main Image Showcase */}
      <div className="rounded-2xl border border-slate-800 bg-navy-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              {selectedImage === 'improved'
                ? 'Improved Flood Comparison (outputs/flood/flood_comparison_improved.png)'
                : 'Baseline Flood Comparison (outputs/flood/flood_comparison_baseline.png)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-panel spatial visualization of pre-event backscatter, post-event backscatter, VV delta, and derived flood mask.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs font-mono text-cyan-400 hover:border-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand Full Image
          </button>
        </div>

        <div className="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-navy-950 shadow-2xl">
          <img
            src={
              selectedImage === 'improved'
                ? '/images/flood_comparison_improved.png'
                : '/images/flood_comparison_baseline.png'
            }
            alt="Sentinel-1 SAR Flood Comparison"
            className="w-full h-auto object-cover max-h-[750px] mx-auto transition-transform duration-300 group-hover:scale-[1.005]"
          />
        </div>
      </div>

      {/* Detection Pipeline Technical Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Microwave Physics */}
        <div className="p-6 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Satellite className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">1. Radar Specular Reflection</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Smooth floodwater reflects the active radar pulses away from the Sentinel-1 sensor, causing an abrupt drop in returned backscatter energy (measured in decibels, dB) compared to rough dry terrain or urban fabric.
          </p>
          <div className="pt-2 font-mono text-[11px] text-cyan-400">
            • Sensor: Sentinel-1A C-band (5.405 GHz)<br/>
            • Geometry: Descending, Orbit 77
          </div>
        </div>

        {/* Step 2: Mathematical Differencing */}
        <div className="p-6 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">2. Thresholding & Median Filter</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            A 3x3 median spatial filter is applied to eliminate coherent speckle noise. Pixels are classified as SAR flood candidates if they satisfy the rigorous multi-parameter condition:
          </p>
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
            <div>• <span className="text-cyan-300">Post VV</span> ≤ -16 dB</div>
            <div>• <span className="text-cyan-300">Post VH</span> ≤ -20 dB</div>
            <div>• <span className="text-cyan-300">ΔVV Change</span> ≤ -3 dB</div>
            <div>• <span className="text-cyan-300">Pre VV</span> &gt; -16 dB</div>
          </div>
        </div>

        {/* Step 3: Analytical Verification */}
        <div className="p-6 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">3. Vector Candidate Output</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Raster candidate patches are vectorized into contiguous polygons with calculated surface area, generating 1,189 discrete vector polygons across 177.66 km² of screened flood candidate extent.
          </p>
          <div className="pt-2 font-mono text-[11px] text-emerald-400">
            • Improved Area: {VERIFIED_METRICS.improvedCandidateAreaKm2} km²<br/>
            • Total Polygons: {VERIFIED_METRICS.extractedPolygons} (EPSG:4326)
          </div>
        </div>
      </div>

      {/* Modal View */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full bg-navy-950 border border-slate-700 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-mono text-sm text-cyan-300">
                {selectedImage === 'improved'
                  ? 'outputs/flood/flood_comparison_improved.png'
                  : 'outputs/flood/flood_comparison_baseline.png'}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 rounded bg-slate-800 text-white font-mono text-xs hover:bg-slate-700 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
            <img
              src={
                selectedImage === 'improved'
                  ? '/images/flood_comparison_improved.png'
                  : '/images/flood_comparison_baseline.png'
              }
              alt="High Resolution Sentinel-1 SAR Comparison"
              className="w-full h-auto max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Scientific Limitation */}
      <DisclaimerBanner
        type="info"
        title="SAR Interpretation Constraints"
        message="Radar-derived flood candidates represent areas of specular backscatter reduction. Heavy emergent vegetation, canopy shielding, and steep topographic slopes can alter backscatter response. The output represents candidate inundation screening, not ground-truth validated floodwater depth."
      />
    </div>
  );
};
