import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-20 px-6 border-t border-white/5 glass">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <span className="text-2xl font-display font-bold tracking-tighter text-white">
            DAYYAN<span className="text-primary-accent">INTL</span>
          </span>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Exporting excellence in surgical instrumentation worldwide.
            Quality management systems certified for medical standards.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm text-neutral-400">
            <li className="hover:text-primary-accent transition-colors cursor-pointer">DayyanINTL@gmail.com</li>
            <li>Industrial Estate, Sialkot, Pakistan</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-neutral-400">
            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-white transition-colors cursor-pointer">Certifications</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-neutral-500 text-xs">
          © {new Date().getFullYear()} Dayyan International. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="text-neutral-500 text-xs hover:text-white transition-colors cursor-pointer">LinkedIn</span>
          <span className="text-neutral-500 text-xs hover:text-white transition-colors cursor-pointer">Instagram</span>
        </div>
      </div>
    </footer>
  );
};
