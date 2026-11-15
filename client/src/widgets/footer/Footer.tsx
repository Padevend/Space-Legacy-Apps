import React from 'react';
import { ExternalLink, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-space-950 text-slate-600 dark:text-slate-400 py-12 px-6 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-cyan"></span>
            <span className="font-tech text-slate-900 dark:text-white font-bold tracking-wider text-base">
              SPACE LEGACY
            </span>
          </div>
          <p className="font-sans text-xs leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
            Digital museum cataloging discarded hardware and scientific stations resting on extraterrestrial surfaces. Developed for the NASA Space Apps Challenge 2026.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-nasa-blue dark:text-signal-cyan">
            <Database className="w-3.5 h-3.5" />
            <span>Strict data-provenance verified against NASA Archives</span>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3 font-semibold">
            Official Data Sources
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://science.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-nasa-blue dark:hover:text-white transition inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400"
              >
                <span>NASA Science Mission Directorate</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a
                href="https://nssdc.gsfc.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-nasa-blue dark:hover:text-white transition inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400"
              >
                <span>NASA Space Science Data Coordinated Archive (NSSDCA)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a
                href="https://images.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-nasa-blue dark:hover:text-white transition inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400"
              >
                <span>NASA Image & Video Library</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3 font-semibold">
            Guiding Philosophy
          </h4>
          <blockquote className="font-display italic text-slate-700 dark:text-slate-300 text-sm border-l-2 border-nasa-blue pl-3 my-2">
            « Every object has a story. Every mission leaves a legacy. »
          </blockquote>
          <p className="text-[11px] font-mono text-slate-500 mt-3">
            REST API & PostgreSQL Ready • WCAG AA Accessible • Mobile-First
          </p>
        </div>
      </div>
    </footer>
  );
};
