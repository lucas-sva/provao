import React from 'react';
import type { ActiveTab } from '../types/provao';
import { LayoutDashboard, Table2, BookOpen } from 'lucide-react';

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
    },
    {
      id: 'explorer' as ActiveTab,
      label: 'Candidatos',
      badge: `${candidateCount}`,
      icon: Table2,
    },
    {
      id: 'disciplines' as ActiveTab,
      label: 'Disciplinas',
      badge: '10',
      icon: BookOpen,
    },
  ];

  return (
    <nav
      className="md:hidden w-full bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1"
      aria-label="Navegação rápida móvel"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tactile-button flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-140 cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 flex-shrink-0 ${
                isActive ? 'text-blue-700' : 'text-slate-400'
              }`}
            />
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold tabular-nums whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                    : 'bg-slate-200/80 text-slate-500'
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
