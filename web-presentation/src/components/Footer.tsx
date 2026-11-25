import React from 'react';
import { Radar, Shield, Terminal, Database, Cpu } from 'lucide-react';
import { PageId } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-24 border-t border-slate-800/80 bg-navy-950/95 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Radar className="w-5 h-5 text-cyan-400" />
              <span>FLOOD<span className="text-cyan-400">SENTINEL</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Geospatial radar intelligence platform leveraging Sentinel-1 SAR, JRC water occurrence, GHSL settlement layers, and VIIRS nightlight observations.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Branch: <code className="text-cyan-300 font-semibold">solo-build</code>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs font-mono uppercase tracking-wider mb-3">
              Platform Views
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Intelligence Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-cyan-400 transition-colors">
                  Interactive Flood Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('detection')} className="hover:text-cyan-400 transition-colors">
                  SAR Flood Detection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exclusion')} className="hover:text-cyan-400 transition-colors">
                  Permanent Water Exclusion
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('risk')} className="hover:text-cyan-400 transition-colors">
                  Integrated Risk Assessment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Separation */}
          <div>
            <h4 className="text-white font-semibold text-xs font-mono uppercase tracking-wider mb-3">
              System Architecture
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Streamlit Python Engine (<code className="text-slate-300">app.py</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAR / GDAL / Rasterio Scientific Pipeline</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>WGS84 Vector GeoJSON & JSON Indicators</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Presentation Website (<code className="text-emerald-300">web-presentation/</code>)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Repository & Code */}
          <div>
            <h4 className="text-white font-semibold text-xs font-mono uppercase tracking-wider mb-3">
              Source Code & Links
            </h4>
            <div className="space-y-3">
              <a
                href="https://github.com/PRABHUDEVA3016/FloodSentinel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-white transition-all text-xs font-mono"
              >
                <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>GitHub Repository</span>
              </a>
              <p className="text-[11px] text-slate-500 leading-normal">
                All analytical outputs, SAR masks, and GeoJSON polygon collections are independently maintained without modifying underlying pipeline scripts.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            FloodSentinel © 2026. Scientific presentation and geospatial screening platform.
          </p>
          <p className="font-mono text-slate-400">
            SAR screening indicators only. Not an official insurance claim or validated damage estimate.
          </p>
        </div>
      </div>
    </footer>
  );
};
