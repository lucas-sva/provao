import React from 'react';
import type { HistogramBucket } from '../types/provao';
import { BarChart3 } from 'lucide-react';

interface HistogramChartProps {
  buckets: HistogramBucket[];
  totalCandidates: number;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ buckets }) => {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Distribuição das Notas Totais
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Frequência de notas e o impacto do corte mínimo de 80 pontos.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Aprovados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
            <span className="text-slate-600 font-medium">Caiu por Disciplina</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500"></span>
            <span className="text-slate-600 font-medium">Caiu no Total</span>
          </div>
        </div>
      </div>

      {/* Bars container */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 items-end h-56 pt-6 pb-2">
        {buckets.map((b) => {
          const heightPct = Math.max((b.count / maxCount) * 100, 6);
          const isBelowCutoff = b.max < 80;

          // Segment heights within the bar
          const approvedHeight = b.count > 0 ? (b.approved / b.count) * 100 : 0;
          const failedDiscHeight = b.count > 0 ? (b.failed_disc / b.count) * 100 : 0;
          const failedTotalHeight = b.count > 0 ? (b.failed_total / b.count) * 100 : 0;

          return (
            <div key={b.range} className="flex flex-col items-center h-full justify-end group">
              {/* Tooltip / Counter above bar */}
              <span className="text-[11px] font-bold text-slate-700 tabular-nums mb-1 group-hover:text-blue-600 transition-colors">
                {b.count}
              </span>

              {/* Stacked bar */}
              <div
                className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse shadow-xs transition-all duration-300 group-hover:opacity-90"
                style={{ height: `${heightPct}%` }}
              >
                {/* Approved segment */}
                {approvedHeight > 0 && (
                  <div
                    className="w-full bg-emerald-500"
                    style={{ height: `${approvedHeight}%` }}
                    title={`${b.approved} aprovados`}
                  />
                )}
                {/* Failed discipline segment */}
                {failedDiscHeight > 0 && (
                  <div
                    className="w-full bg-rose-500"
                    style={{ height: `${failedDiscHeight}%` }}
                    title={`${b.failed_disc} reprovados por disciplina`}
                  />
                )}
                {/* Failed total segment */}
                {failedTotalHeight > 0 && (
                  <div
                    className="w-full bg-amber-500"
                    style={{ height: `${failedTotalHeight}%` }}
                    title={`${b.failed_total} reprovados no total`}
                  />
                )}
              </div>

              {/* X Axis Label */}
              <span
                className={`text-[11px] mt-2 font-semibold tabular-nums text-center ${
                  isBelowCutoff ? 'text-rose-600 font-bold' : 'text-slate-600'
                }`}
              >
                {b.range}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>
            Faixas de <strong>80 a 94 pontos</strong> registraram{' '}
            <strong className="text-rose-600 tabular-nums font-bold">101 reprovações</strong> por falha em disciplina única!
          </span>
        </div>
        <span className="text-slate-400 font-medium">Nota mínima de corte global: 80 pontos</span>
      </div>
    </div>
  );
};
