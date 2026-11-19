import React from 'react';
import { ShieldAlert, ExternalLink, FileText } from 'lucide-react';

export const BrandHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/90 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-0.5 shadow-md shadow-blue-500/15 flex-shrink-0 flex items-center justify-center">
            <svg
              viewBox="0 0 256 256"
              className="w-8 h-8 text-white fill-current"
              aria-label="Logo Mesmo Barco Raio-X"
            >
              <path d="M48 184C80 216 176 216 208 184L216 160H40L48 184Z" fill="#ffffff" />
              <path d="M128 36L44 148H104L128 36Z" fill="#93c5fd" />
              <path d="M128 36L152 148H212L128 36Z" fill="#60a5fa" />
              <path
                d="M36 128L128 36L220 128"
                stroke="#38bdf8"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="128" cy="116" r="20" fill="#ffffff" stroke="#1d4ed8" strokeWidth="8" />
              <circle cx="128" cy="116" r="7" fill="#38bdf8" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                Mesmo Barco
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                T1 Auditada
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-snug">
              Raio-X do Provão <span className="text-blue-600 font-extrabold text-sm sm:text-base">PC-CE</span>
            </h1>
          </div>
        </div>

        {/* Actions & Links */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <a
            href="https://github.com/lucas-sva/mesmo-barco"
            target="_blank"
            rel="noreferrer"
            className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
          >
            <span>Mesmo Barco</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </a>

          <a
            href="https://www.cev.uece.br/wp-content/uploads/2026/10/comunicado2842026cev.pdf"
            target="_blank"
            rel="noreferrer"
            className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Comunicado 284/2026</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Alerta T2</span>
          </div>
        </div>
      </div>
    </header>
  );
};
