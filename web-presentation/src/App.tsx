import React, { useState, useEffect } from 'react';
import { Navbar, PageId } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { InteractiveMapPage } from './pages/InteractiveMapPage';
import { FloodDetectionPage } from './pages/FloodDetectionPage';
import { WaterExclusionPage } from './pages/WaterExclusionPage';
import { GhslOverlapPage } from './pages/GhslOverlapPage';
import { EconomicContextPage } from './pages/EconomicContextPage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home', 
        'dashboard', 
        'map', 
        'detection', 
        'exclusion', 
        'ghsl', 
        'economic', 
        'risk', 
        'methodology', 
        'about'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'map':
        return <InteractiveMapPage />;
      case 'detection':
        return <FloodDetectionPage />;
      case 'exclusion':
        return <WaterExclusionPage />;
      case 'ghsl':
        return <GhslOverlapPage />;
      case 'economic':
        return <EconomicContextPage />;
      case 'risk':
        return <RiskAssessmentPage />;
      case 'methodology':
        return <MethodologyPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060B14] text-slate-100 selection:bg-cyan-500 selection:text-navy-950 font-sans">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-navy-950 via-cyan-950/40 to-navy-950 border-b border-cyan-500/20 px-4 py-1.5 text-center text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>FloodSentinel Geospatial Intelligence Platform • Silchar, Assam AOI • Git Branch: <strong>solo-build</strong></span>
      </div>

      {/* Main Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
