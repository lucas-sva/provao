import React from 'react';
import type { DisciplineStat } from '../types/provao';
import { BarChart2, Info, ChevronRight } from 'lucide-react';

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
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200/80">
                <BarChart2 className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Índice de Retenção por Disciplina
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Disciplinas que mais eliminaram candidatos pelo corte de 7 acertos (ordem decrescente).
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto whitespace-nowrap">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>78,2% das retenções em matéria única</span>
          </div>
        </div>

        {/* Ranking List with Scroll to balance height with HistogramChart */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1.5">
          {ranking.map((disc, idx) => {
            const isTop3 = idx < 3;
            const barWidth = Math.max((disc.below_7_count / maxFailures) * 100, 4);

            return (
              <div
                key={disc.code}
                onClick={() => onSelectDiscipline?.(disc.code)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-140 cursor-pointer tactile-button ${
                  isTop3
                    ? 'bg-red-50/20 border-slate-300 hover:bg-red-50/40 hover:border-red-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                {/* Header Row: Position + Name + Metrics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-start sm:items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold tabular-nums flex-shrink-0 mt-0.5 sm:mt-0 ${
                        idx === 0
                          ? 'bg-red-800 text-white shadow-2xs'
                          : idx === 1
                          ? 'bg-red-700 text-white shadow-2xs'
                          : idx === 2
                          ? 'bg-slate-700 text-white shadow-2xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug block">
                        {disc.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium sm:hidden block mt-0.5">
                        Questões {disc.range}
                      </span>
                    </div>
                  </div>

                  {/* Right Metrics Pills */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end text-xs tabular-nums pt-1 sm:pt-0">
                    <span className="text-[11px] text-slate-500">
                      Média: <strong className="text-slate-800">{disc.average.toFixed(1)}</strong>
                    </span>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${
                        disc.below_7_count > 0
                          ? 'bg-red-100 text-red-900 border border-red-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {disc.below_7_count} abaixo de 7
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === 0
                        ? 'bg-red-800'
                        : idx === 1
                        ? 'bg-red-700'
                        : idx === 2
                        ? 'bg-slate-700'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Bottom Details with Proper Spacing */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 gap-2 flex-wrap">
                  <span>
                    Retenção exclusiva em{' '}
                    <strong className="text-slate-800 tabular-nums font-bold">
                      {disc.sole_cause_count} casos
                    </strong>{' '}
                    <span className="text-slate-500 font-normal">
                      (pontuação total ≥ 80)
                    </span>
                  </span>

                  <span className="tabular-nums font-medium text-slate-600 ml-auto flex items-center gap-1">
                    <span>{disc.below_7_pct}% do total de alunos</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
