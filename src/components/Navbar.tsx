import React from 'react';
import logo from '../assets/company_logo.jpeg';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 py-3 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden border border-white/10 shadow-glow">
          <img src={logo} alt="Dayyan International Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-display font-bold tracking-tighter text-white leading-none">
            DAYYAN<span className="text-primary-accent italic">INTL</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary-accent/70 font-semibold">
            Precision Instruments
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Products</a>
        <a href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About Us</a>
        <a href="#contact" className="px-5 py-2 rounded-full glass-hover border border-white/10 text-sm font-medium text-white transition-all">
          Contact
        </a>
      </div>
    </nav>
  );
};
