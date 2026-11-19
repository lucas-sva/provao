import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface MetricBadgeProps {
  type: 'situacao' | 'segment' | 'score' | 'rank_delta';
  value: string | number;
  failingCount?: number;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ type, value, failingCount }) => {
  if (type === 'situacao') {
    const valStr = String(value);
    if (valStr.includes('Alcançou os perfis')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Aprovado</span>
        </span>
      );
    }
    if (valStr.includes('perfil de disciplina')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/90 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>Caiu em Matéria {failingCount ? `(${failingCount})` : ''}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
        <XCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>Caiu no Total</span>
      </span>
    );
  }

  if (type === 'segment') {
    const valStr = String(value);
    let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
    if (valStr.includes('Negro')) {
      colorClass = 'bg-purple-50 text-purple-700 border-purple-200';
    } else if (valStr.includes('PCD') || valStr.includes('PcD')) {
      colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}>
        {valStr}
      </span>
    );
  }

  if (type === 'score') {
    const num = Number(value);
    const isFail = num < 7;
    return (
      <span
        className={`tabular-nums inline-block font-semibold ${
          isFail
            ? 'text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200/70'
            : num === 10
            ? 'text-blue-700 font-bold'
            : 'text-slate-800'
        }`}
      >
        {num}
      </span>
    );
  }

  if (type === 'rank_delta') {
    const num = Number(value);
    if (num > 0) {
      return (
        <span className="tabular-nums text-xs font-bold text-emerald-600 inline-flex items-center">
          +{num} ↑
        </span>
      );
    }
    if (num < 0) {
      return (
        <span className="tabular-nums text-xs font-bold text-rose-500 inline-flex items-center">
          {num} ↓
        </span>
      );
    }
    return <span className="tabular-nums text-xs text-slate-400">=</span>;
  }

  return <span>{value}</span>;
};
