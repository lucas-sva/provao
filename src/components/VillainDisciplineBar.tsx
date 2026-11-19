import React from 'react';
import type { DisciplineStat } from '../types/provao';
import { Skull, AlertOctagon } from 'lucide-react';

interface VillainDisciplineBarProps {
  ranking: DisciplineStat[];
  totalEvaluated?: number;
  onSelectDiscipline?: (code: string) => void;
}

export const VillainDisciplineBar: React.FC<VillainDisciplineBarProps> = ({
  ranking,
  onSelectDiscipline,
}) => {
  // Max failures for scaling bar
  const maxFailures = Math.max(...ranking.map((d) => d.below_7_count), 1);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Skull className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              O Termômetro das Matérias Vilãs
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ranking das disciplinas que mais reprovaram alunos no critério de corte (&lt; 7 pontos).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-800 text-xs font-semibold">
          <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>78,2% caíram por apenas 1 matéria</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {ranking.map((disc, idx) => {
          const isTop3 = idx < 3;
          const barWidth = Math.max((disc.below_7_count / maxFailures) * 100, 4);

          return (
            <div
              key={disc.code}
              onClick={() => onSelectDiscipline?.(disc.code)}
              className={`p-3 rounded-xl border transition-all duration-150 ${
                isTop3
                  ? 'bg-rose-50/30 border-rose-200/70 hover:bg-rose-50/50 hover:border-rose-300'
                  : 'bg-white/60 border-slate-200/60 hover:bg-slate-50/80'
              } cursor-pointer tactile-button`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5 gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-extrabold tabular-nums flex-shrink-0 ${
                      idx === 0
                        ? 'bg-rose-600 text-white shadow-xs'
                        : idx === 1
                        ? 'bg-amber-600 text-white'
                        : idx === 2
                        ? 'bg-slate-700 text-white'
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
                    className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      disc.below_7_count > 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {disc.below_7_count} reprovações
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-rose-600'
                      : idx === 1
                      ? 'bg-rose-500'
                      : idx === 2
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>
                  Vilã solitária em{' '}
                  <strong className="text-slate-800 tabular-nums font-semibold">
                    {disc.sole_cause_count} casos
                  </strong>{' '}
                  (aluno fez $\ge$ 80 geral, mas caiu só aqui)
                </span>
                <span className="tabular-nums">
                  {disc.below_7_pct}% dos alunos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
