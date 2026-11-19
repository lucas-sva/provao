import React, { useState, useEffect } from 'react';
import type { ActiveTab } from '../types/provao';
import {
  Menu,
  X,
  LayoutDashboard,
  Table2,
  BookOpen,
  ExternalLink,
  FileText,
  Code2,
  Shield,
  BarChart3,
} from 'lucide-react';

interface BrandHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  candidateCount: number;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  activeTab,
  onTabChange,
  candidateCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    desc: string;
  }> = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      desc: 'KPIs, disciplinas vilãs, histograma e lotação',
    },
    {
      id: 'explorer',
      label: 'Candidatos',
      icon: Table2,
      badge: `${candidateCount}`,
      desc: 'Busca instantânea e boletim individual completo',
    },
    {
      id: 'disciplines',
      label: 'Disciplinas',
      icon: BookOpen,
      badge: '10',
      desc: 'Médias, cortes e distribuição de acertos',
    },
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={baseUrl}
              className="tactile-button flex-shrink-0 flex items-center"
              title="Mesmo Barco - Raio-X do Provão"
            >
              <img
                src={`${baseUrl}logo.png`}
                alt="Mesmo Barco"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-xs border border-slate-200"
              />
            </a>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-700 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Mesmo Barco
                </span>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  T1 · Dados Auditados
                </span>
              </div>
              <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate">
                Raio-X do Provão <span className="text-slate-500 font-semibold">PC-CE</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`tactile-button flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-140 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded font-normal tabular-nums whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-slate-200/70 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick External Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="https://lucas-sva.github.io/mesmo-barco/"
              target="_blank"
              rel="noreferrer"
              className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Acessar o aplicativo Mesmo Barco"
            >
              <span>Mesmo Barco</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://www.cev.uece.br/wp-content/uploads/2026/10/comunicado2842026cev.pdf"
              target="_blank"
              rel="noreferrer"
              className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              title="Abrir Comunicado 284/2026 CEV/UECE oficial em PDF"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Edital 284/2026</span>
            </a>
          </div>

          {/* Mobile Hamburger Button (Botão de 3 listras) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="tactile-button p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop with Blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <img
                  src={`${baseUrl}logo.png`}
                  alt="Mesmo Barco"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Menu Principal</h2>
                  <p className="text-[11px] text-slate-500">Raio-X do Provão PC-CE</p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="tactile-button p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs in Drawer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Visualizações do App
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`tactile-button w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-200 text-blue-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-sm font-bold leading-tight">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap tabular-nums ${
                              isActive
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-normal leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Useful External Links */}
              <div className="pt-4 mt-4 border-t border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Links Oficiais & Comunidade
                </span>

                <a
                  href="https://lucas-sva.github.io/mesmo-barco/"
                  target="_blank"
                  rel="noreferrer"
                  className="tactile-button flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    App Mesmo Barco
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://www.cev.uece.br/wp-content/uploads/2026/10/comunicado2842026cev.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="tactile-button flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Comunicado Nº 284/2026 (PDF)
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://github.com/lucas-sva/provao"
                  target="_blank"
                  rel="noreferrer"
                  className="tactile-button flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    Repositório Aberto
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 mb-1 text-slate-700 font-semibold">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Base Auditada CEV/UECE</span>
              </div>
              <span>Turma 1 · 689 candidatos avaliados no Provão.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
