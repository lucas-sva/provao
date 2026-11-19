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
      label: 'Visão Geral',
      icon: LayoutDashboard,
      badge: 'Panorama T1',
    },
    {
      id: 'explorer' as ActiveTab,
      label: 'Tabela de Candidatos',
      icon: Table2,
      badge: `${candidateCount} alunos`,
    },
    {
      id: 'disciplines' as ActiveTab,
      label: 'Análise por Disciplina',
      icon: BookOpen,
      badge: '10 Matérias',
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Simulador de Critérios',
      icon: Calculator,
      badge: 'Interativo',
    },
  ];

  return (
    <nav className="w-full bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto flex items-center gap-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tactile-button flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-120 cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                isActive ? 'text-blue-700' : 'text-slate-400'
              }`}
            />
            <span className="truncate">{tab.label}</span>
            {tab.badge && (
              <span
                className={`hidden md:inline-block text-[11px] px-1.5 py-0.2 rounded font-normal tabular-nums ${
                  isActive
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-slate-200/70 text-slate-500'
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
