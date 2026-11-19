import React from 'react';
import { ExternalLink, FileText, Info } from 'lucide-react';

export const BrandHeader: React.FC = () => {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand Lockup with user's official Mesmo Barco / T2 badge */}
        <div className="flex items-center gap-3">
          <a href={baseUrl} className="tactile-button flex-shrink-0">
            <img
              src={`${baseUrl}logo.png`}
              alt="Mesmo Barco T2"
              className="w-10 h-10 rounded-full object-cover shadow-xs border border-slate-200"
            />
          </a>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Mesmo Barco
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                T1 · Dados Oficiais
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              Raio-X do Provão <span className="text-slate-600 font-medium text-sm sm:text-base">PC-CE</span>
            </h1>
          </div>
        </div>

        {/* Actions & Links */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Link to Mesmo Barco Web App on GitHub Pages */}
          <a
            href="https://lucas-sva.github.io/mesmo-barco/"
            target="_blank"
            rel="noreferrer"
            className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
            title="Acessar o aplicativo do Mesmo Barco"
          >
            <span>Mesmo Barco</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </a>

          <a
            href="https://www.cev.uece.br/wp-content/uploads/2026/10/comunicado2842026cev.pdf"
            target="_blank"
            rel="noreferrer"
            className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Comunicado 284/2026</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Painel Informativo T2</span>
          </div>
        </div>
      </div>
    </header>
  );
};
