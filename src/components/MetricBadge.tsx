import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/90">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
          <span>Aprovado</span>
        </span>
      );
    }
    if (valStr.includes('perfil de disciplina')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-900 border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
          <span>Retido por Disciplina {failingCount ? `(${failingCount})` : ''}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
        <XCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
        <span>Retido por Total</span>
      </span>
    );
  }

  if (type === 'segment') {
    const valStr = String(value);
    let colorClass = 'bg-slate-50 text-slate-700 border-slate-200';
    if (valStr.includes('Negro')) {
      colorClass = 'bg-slate-50 text-slate-800 border-slate-200';
    } else if (valStr.includes('PCD') || valStr.includes('PcD')) {
      colorClass = 'bg-slate-50 text-slate-800 border-slate-200';
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
        {valStr}
      </span>
    );
  }

  if (type === 'score') {
    const num = Number(value);
    const isFail = num < 7;
    return (
      <span
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold tabular-nums text-center mx-auto text-xs ${
          isFail
            ? 'bg-red-800 text-white shadow-2xs font-extrabold'
            : num === 10
            ? 'bg-blue-50 text-blue-900 border border-blue-200/90 font-bold'
            : 'text-slate-800 bg-slate-50 border border-slate-200/70 font-semibold'
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
        <span className="tabular-nums text-xs font-semibold text-emerald-700 inline-flex items-center">
          +{num} ↑
        </span>
      );
    }
    if (num < 0) {
      return (
        <span className="tabular-nums text-xs font-semibold text-slate-600 inline-flex items-center">
          {num} ↓
        </span>
      );
    }
    return <span className="tabular-nums text-xs text-slate-400">=</span>;
  }

  return <span>{value}</span>;
};
