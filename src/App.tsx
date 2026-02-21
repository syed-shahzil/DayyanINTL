import React from 'react';
import { Navbar } from './components/Navbar';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary-accent/30 selection:text-background">
      {/* Radiant Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-medical-teal/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-xs font-semibold text-primary-accent mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Premium Surgical Manufacturing
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tighter leading-tight animate-slide-up">
            Precision in Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-accent to-medical-teal">Incision.</span>
          </h1>

          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:100ms]">
            Dayyan International provides high-quality surgical instruments designed for the most demanding medical environments.
          </p>
        </section>

        {/* Product System Grid */}
        <ProductGrid />
      </main>

      <Footer />
    </div>
  );
}

export default App;
