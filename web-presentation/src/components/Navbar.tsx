import React, { useState } from 'react';
import { 
  Radar, 
  LayoutDashboard, 
  Map, 
  Layers, 
  Droplets, 
  Building2, 
  Activity, 
  ShieldAlert, 
  GitBranch, 
  BookOpen, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export type PageId = 
  | 'home' 
  | 'dashboard' 
  | 'map' 
  | 'detection' 
  | 'exclusion' 
  | 'ghsl' 
  | 'economic' 
  | 'risk' 
  | 'methodology' 
  | 'about';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analysisDropdownOpen, setAnalysisDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: 'home' as PageId, label: 'Home', icon: Radar },
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map' as PageId, label: 'Flood Map', icon: Map, highlight: true },
  ];

  const analysisItems = [
    { id: 'detection' as PageId, label: 'SAR Flood Detection', icon: Layers, desc: 'VV/VH backscatter change' },
    { id: 'exclusion' as PageId, label: 'Permanent Water Exclusion', icon: Droplets, desc: 'JRC 90% water masking' },
    { id: 'ghsl' as PageId, label: 'GHSL Spatial Overlap', icon: Building2, desc: 'Urban footprint screening' },
    { id: 'economic' as PageId, label: 'Economic Activity Context', icon: Activity, desc: 'VIIRS nightlights time series' },
    { id: 'risk' as PageId, label: 'Integrated Risk Screening', icon: ShieldAlert, desc: 'Synthesis assessment' },
  ];

  const secondaryNavItems = [
    { id: 'methodology' as PageId, label: 'Methodology', icon: BookOpen },
    { id: 'about' as PageId, label: 'Project Info', icon: GitBranch },
  ];

  const isAnalysisActive = analysisItems.some(item => item.id === currentPage);

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setAnalysisDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Radar className="w-5 h-5 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">
                  FLOOD<span className="text-cyan-400">SENTINEL</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
                Geospatial SAR Flood Intelligence Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : item.highlight
                      ? 'text-sky-300 hover:text-white hover:bg-slate-800/60 border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Analysis Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAnalysisDropdownOpen(!analysisDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isAnalysisActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Deep Analysis</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${analysisDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {analysisDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 rounded-xl bg-navy-900 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  onMouseLeave={() => setAnalysisDropdownOpen(false)}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
                    Analytical Pipeline Modules
                  </div>
                  {analysisItems.map(item => {
                    const Icon = item.icon;
                    const active = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-slate-800/70 text-slate-200'
                        }`}
                      >
                        <div className="p-1.5 rounded-md bg-navy-800 border border-slate-700/60 text-cyan-400 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Status Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-slate-400">Branch:</span>
              <span className="text-[11px] font-semibold text-emerald-400">solo-build</span>
            </div>
            <a
              href="https://github.com/PRABHUDEVA3016/FloodSentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
              title="GitHub Repository"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-navy-950 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-semibold px-2">
            Navigation
          </div>
          {mainNavItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-semibold px-2 pt-2">
            Analysis Modules
          </div>
          {analysisItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-semibold px-2 pt-2">
            Documentation & System
          </div>
          {secondaryNavItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
