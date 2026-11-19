import React from 'react';
import type { HistogramBucket } from '../types/provao';
import { BarChart3 } from 'lucide-react';

interface HistogramChartProps {
  buckets: HistogramBucket[];
  totalCandidates?: number;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ buckets }) => {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Distribuição das Notas Globais
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Frequência de notas e correlação com os critérios de corte (80 pontos globais e 7 pontos por matéria).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-700"></span>
            <span className="text-slate-600 font-medium">Aprovados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-800"></span>
            <span className="text-slate-600 font-medium">Retido por Disciplina</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-700"></span>
            <span className="text-slate-600 font-medium">Retido por Total</span>
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
              <span className="text-[11px] font-bold text-slate-600 tabular-nums mb-1 group-hover:text-slate-900 transition-colors">
                {b.count}
              </span>

              {/* Stacked bar */}
              <div
                className="w-full rounded-t overflow-hidden flex flex-col-reverse shadow-2xs transition-all duration-200"
                style={{ height: `${heightPct}%` }}
              >
                {approvedHeight > 0 && (
                  <div
                    className="w-full bg-slate-700"
                    style={{ height: `${approvedHeight}%` }}
                    title={`${b.approved} aprovados`}
                  />
                )}
                {failedDiscHeight > 0 && (
                  <div
                    className="w-full bg-red-800"
                    style={{ height: `${failedDiscHeight}%` }}
                    title={`${b.failed_disc} retidos por disciplina`}
                  />
                )}
                {failedTotalHeight > 0 && (
                  <div
                    className="w-full bg-amber-700"
                    style={{ height: `${failedTotalHeight}%` }}
                    title={`${b.failed_total} retidos no total`}
                  />
                )}
              </div>

              {/* X Axis Label */}
              <span
                className={`text-[11px] mt-2 font-medium tabular-nums text-center ${
                  isBelowCutoff ? 'text-red-900 font-bold' : 'text-slate-600'
                }`}
              >
                {b.range}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Nas faixas de <strong>80 a 94 pontos</strong>, <strong>101 alunos</strong> não atingiram aprovação pelo critério individual de disciplina.
        </span>
        <span className="text-slate-400 font-medium">Nota mínima de corte global: 80 pontos</span>
      </div>
    </div>
  );
};
