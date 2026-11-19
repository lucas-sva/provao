import React from 'react';
import type { DisciplineStat } from '../types/provao';
import { BarChart2, Info } from 'lucide-react';

interface VillainDisciplineBarProps {
  ranking: DisciplineStat[];
  totalEvaluated?: number;
  onSelectDiscipline?: (code: string) => void;
}

export const VillainDisciplineBar: React.FC<VillainDisciplineBarProps> = ({
  ranking,
  onSelectDiscipline,
}) => {
  const maxFailures = Math.max(...ranking.map((d) => d.below_7_count), 1);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              <BarChart2 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Índice de Retenção por Disciplina
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Distribuição dos candidatos que obtiveram pontuação inferior ao corte de 7 pontos por matéria.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
          <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>78,2% das retenções em matéria única</span>
        </div>
      </div>

      <div className="space-y-3">
        {ranking.map((disc, idx) => {
          const isTop3 = idx < 3;
          const barWidth = Math.max((disc.below_7_count / maxFailures) * 100, 4);

          return (
            <div
              key={disc.code}
              onClick={() => onSelectDiscipline?.(disc.code)}
              className={`p-3 rounded-lg border transition-all duration-120 cursor-pointer tactile-button ${
                isTop3
                  ? 'bg-slate-50/80 border-slate-300/80 hover:bg-slate-100/70'
                  : 'bg-white border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5 gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold tabular-nums flex-shrink-0 ${
                      idx === 0
                        ? 'bg-slate-900 text-white'
                        : idx === 1
                        ? 'bg-slate-700 text-white'
                        : idx === 2
                        ? 'bg-slate-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-slate-900 font-bold truncate">
                    {disc.name}
                  </span>
                  <span className="text-slate-400 font-normal text-xs hidden sm:inline">
                    ({disc.range})
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 tabular-nums">
                  <span className="text-xs text-slate-500">
                    Média: <strong className="text-slate-800">{disc.average.toFixed(1)}</strong>
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      disc.below_7_count > 0
                        ? 'bg-red-50 text-red-900 border border-red-200/80'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {disc.below_7_count} abaixo do corte
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    idx === 0
                      ? 'bg-red-800'
                      : idx === 1
                      ? 'bg-red-700/90'
                      : idx === 2
                      ? 'bg-slate-600'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>
                  Retenção exclusiva em{' '}
                  <strong className="text-slate-800 tabular-nums font-semibold">
                    {disc.sole_cause_count} casos
                  </strong>{' '}
                  (candidato com total $\ge$ 80)
                </span>
                <span className="tabular-nums">
                  {disc.below_7_pct}% dos avaliados
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
