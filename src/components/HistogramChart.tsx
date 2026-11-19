import React, { useState } from 'react';
import type { HistogramBucket } from '../types/provao';
import { BarChart3, Info } from 'lucide-react';

interface HistogramChartProps {
  buckets: HistogramBucket[];
  totalCandidates?: number;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ buckets }) => {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const [activeBucketIndex, setActiveBucketIndex] = useState<number | null>(null);

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm bg-white flex flex-col justify-between">
      <div>
        {/* Header and Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Distribuição das Notas Globais
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Frequência de notas e correlação com os critérios de corte (mínimo 80 global e 7 por matéria).
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span>
              <span className="text-slate-700 font-medium">Aprovados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-800"></span>
              <span className="text-slate-700 font-medium">Retido por Disciplina</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span>
              <span className="text-slate-700 font-medium">Retido por Total</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE VIEW: Horizontal Stacked Rows (sm:hidden) ── */}
        <div className="block sm:hidden space-y-2.5 pt-1">
          {buckets.map((b, idx) => {
            const isBelowCutoff = b.max < 80;
            const barWidthPct = Math.max((b.count / maxCount) * 100, 4);
            const approvedPct = b.count > 0 ? (b.approved / b.count) * 100 : 0;
            const failedDiscPct = b.count > 0 ? (b.failed_disc / b.count) * 100 : 0;
            const failedTotalPct = b.count > 0 ? (b.failed_total / b.count) * 100 : 0;
            const isSelected = activeBucketIndex === idx;

            return (
              <div
                key={b.range}
                onClick={() => setActiveBucketIndex(isSelected ? null : idx)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer tactile-button ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300/50'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                {/* Top Label & Count */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span
                    className={`font-bold tabular-nums px-2 py-0.5 rounded-md ${
                      isBelowCutoff
                        ? 'bg-red-100 text-red-900 border border-red-200'
                        : 'bg-slate-200/80 text-slate-800 border border-slate-300'
                    }`}
                  >
                    Faixa: {b.range} pts
                  </span>

                  <span className="tabular-nums font-extrabold text-xs text-slate-900">
                    {b.count} {b.count === 1 ? 'aluno' : 'alunos'}
                  </span>
                </div>

                {/* Horizontal Stacked Bar */}
                <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden flex shadow-2xs">
                  <div
                    className="h-full flex rounded-full overflow-hidden"
                    style={{ width: `${barWidthPct}%` }}
                  >
                    {approvedPct > 0 && (
                      <div
                        className="h-full bg-slate-800 transition-all duration-300"
                        style={{ width: `${approvedPct}%` }}
                        title={`${b.approved} aprovados`}
                      />
                    )}
                    {failedDiscPct > 0 && (
                      <div
                        className="h-full bg-red-800 transition-all duration-300"
                        style={{ width: `${failedDiscPct}%` }}
                        title={`${b.failed_disc} retidos por disciplina`}
                      />
                    )}
                    {failedTotalPct > 0 && (
                      <div
                        className="h-full bg-amber-600 transition-all duration-300"
                        style={{ width: `${failedTotalPct}%` }}
                        title={`${b.failed_total} retidos por total`}
                      />
                    )}
                  </div>
                </div>

                {/* Subtext breakdown */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 tabular-nums">
                  <span className="flex items-center gap-2">
                    {b.approved > 0 && (
                      <span className="text-slate-800 font-semibold">{b.approved} aprovados</span>
                    )}
                    {b.failed_disc > 0 && (
                      <span className="text-red-900 font-semibold">
                        {b.failed_disc} retidos por mat.
                      </span>
                    )}
                    {b.failed_total > 0 && (
                      <span className="text-amber-700 font-semibold">
                        {b.failed_total} retidos total
                      </span>
                    )}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {((b.count / 689) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DESKTOP VIEW: Vertical Stacked Bar Chart (hidden sm:grid) ── */}
        <div className="hidden sm:grid grid-cols-8 gap-2.5 items-end h-64 pt-6 pb-2">
          {buckets.map((b) => {
            const heightPct = Math.max((b.count / maxCount) * 100, 6);
            const isBelowCutoff = b.max < 80;

            const approvedHeight = b.count > 0 ? (b.approved / b.count) * 100 : 0;
            const failedDiscHeight = b.count > 0 ? (b.failed_disc / b.count) * 100 : 0;
            const failedTotalHeight = b.count > 0 ? (b.failed_total / b.count) * 100 : 0;

            return (
              <div key={b.range} className="flex flex-col items-center h-full justify-end group">
                {/* Total count badge above bar */}
                <span className="text-xs font-bold text-slate-700 tabular-nums mb-1.5 group-hover:text-blue-700 group-hover:scale-105 transition-all">
                  {b.count}
                </span>

                {/* Stacked vertical bar */}
                <div
                  className="w-full rounded-t-md overflow-hidden flex flex-col-reverse shadow-xs transition-all duration-200 group-hover:brightness-110"
                  style={{ height: `${heightPct}%` }}
                >
                  {approvedHeight > 0 && (
                    <div
                      className="w-full bg-slate-800"
                      style={{ height: `${approvedHeight}%` }}
                      title={`${b.approved} aprovados nesta faixa`}
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
                      className="w-full bg-amber-600"
                      style={{ height: `${failedTotalHeight}%` }}
                      title={`${b.failed_total} retidos no total`}
                    />
                  )}
                </div>

                {/* X Axis Score Range Label */}
                <span
                  className={`text-xs mt-2 font-bold tabular-nums text-center whitespace-nowrap ${
                    isBelowCutoff ? 'text-red-900' : 'text-slate-700'
                  }`}
                >
                  {b.range}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Nas faixas de <strong>80 a 94 pontos</strong>, <strong>101 alunos</strong> não atingiram aprovação pelo critério individual de disciplina.
          </span>
        </div>
        <span className="text-slate-600 font-semibold whitespace-nowrap self-end sm:self-auto bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Nota mínima de corte global: 80 pontos
        </span>
      </div>
    </div>
  );
};
