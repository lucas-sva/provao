import React from 'react';
import type { ActiveTab } from '../types/provao';
import { LayoutDashboard, Table2, BookOpen, Calculator } from 'lucide-react';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  candidateCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  candidateCount,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Visão Geral & Choque',
      icon: LayoutDashboard,
      badge: 'Destaques',
    },
    {
      id: 'explorer' as ActiveTab,
      label: 'Tabela Densa',
      icon: Table2,
      badge: `${candidateCount} alunos`,
    },
    {
      id: 'disciplines' as ActiveTab,
      label: 'Raio-X das 10 Matérias',
      icon: BookOpen,
      badge: 'Vilãs',
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Simulador de Risco T2',
      icon: Calculator,
      badge: 'Interativo',
      highlight: true,
    },
  ];

  return (
    <nav className="w-full bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/90 shadow-inner overflow-x-auto flex items-center gap-1.5 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tactile-button flex-1 min-w-[140px] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/90 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            />
            <span className="truncate">{tab.label}</span>
            {tab.badge && (
              <span
                className={`hidden md:inline-block text-[11px] px-1.5 py-0.5 rounded-md tabular-nums ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
