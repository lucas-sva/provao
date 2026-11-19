import React, { useEffect } from 'react';
import type { Candidate, DisciplineStat } from '../types/provao';
import { MetricBadge } from './MetricBadge';
import { X, Trophy, AlertCircle, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';

interface CandidateDrawerProps {
  candidate: Candidate | null;
  disciplines: DisciplineStat[];
  onClose: () => void;
}

export const CandidateDrawer: React.FC<CandidateDrawerProps> = ({
  candidate,
  disciplines,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (candidate) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidate, onClose]);

  if (!candidate) return null;

  const isApproved = candidate.situacao.includes('Alcançou os perfis');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-200 ease-out">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/90">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/90 text-slate-800 tabular-nums">
                    Pedido #{candidate.pedido}
                  </span>
                  <MetricBadge type="segment" value={candidate.segment} />
                  {candidate.rank_concurso_geral && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 tabular-nums"
                      title="Classificação Geral no Concurso Amplo (Edital 17)"
                    >
                      Geral Concurso #{candidate.rank_concurso_geral}
                    </span>
                  )}
                  {candidate.rank_pcd && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 tabular-nums">
                      PcD #{candidate.rank_pcd}
                    </span>
                  )}
                  {candidate.rank_negro && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
                      Negro #{candidate.rank_negro}
                    </span>
                  )}
                  {candidate.t1_seat_type && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80">
                      {candidate.t1_seat_type}
                    </span>
                  )}
                  <MetricBadge
                    type="situacao"
                    value={candidate.situacao}
                    failingCount={candidate.num_failing_disciplines}
                  />
                </div>

                {/* Candidate Name: never truncated! */}
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {candidate.nome}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="tactile-button p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 cursor-pointer flex-shrink-0"
                aria-label="Fechar painel do candidato"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI pills */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                  Nota Provão
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-blue-700 tabular-nums">
                  {candidate.total}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                  Classificação
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums">
                  {candidate.rank_provao}º
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                  1ª Fase
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-slate-800 tabular-nums">
                  {candidate.rank_1a_fase ? `${candidate.rank_1a_fase}º` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Context message if high score but failed discipline */}
            {!isApproved && candidate.total >= 80 && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-red-900 mb-0.5">
                    Critério Normativo: Nota Global Alta com Retenção Setorial
                  </strong>
                  O candidato alcançou <strong>{candidate.total} pontos</strong> no cômputo geral,
                  porém obteve nota inferior a 7 em{' '}
                  <strong>{candidate.num_failing_disciplines} matéria(s)</strong> do plano pedagógico.
                </div>
              </div>
            )}

            {/* Impact on lotation */}
            {candidate.rank_1a_fase && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 mb-1.5 text-slate-800 font-bold">
                  <Trophy className="w-4 h-4 text-indigo-600" />
                  <span>Variação na Fila de Lotação</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 tabular-nums">
                  <span>Posição inicial (1ª fase): <strong>{candidate.rank_1a_fase}º</strong></span>
                  <span>Posição no Provão: <strong>{candidate.rank_provao}º</strong></span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/80 font-medium">
                  {candidate.rank_delta > 0 ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4 text-emerald-700" />
                      Avançou {candidate.rank_delta} posições na classificação final da T1.
                    </span>
                  ) : candidate.rank_delta < 0 ? (
                    <span className="text-slate-600 flex items-center gap-1">
                      <ArrowDownRight className="w-4 h-4 text-slate-500" />
                      Recuou {Math.abs(candidate.rank_delta)} posições na classificação final da T1.
                    </span>
                  ) : (
                    <span className="text-slate-500">Manteve exatamente a mesma posição relativa.</span>
                  )}
                </div>
              </div>
            )}

            {/* 10 Disciplines Breakdown (Full Clean Names!) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  Desempenho nas 10 Disciplinas (Corte: 7 pts)
                </h3>
                <span className="text-[11px] text-slate-400">Nota vs Média</span>
              </div>

              <div className="space-y-2">
                {disciplines.map((d, idx) => {
                  const score = candidate.scores[idx];
                  const isFail = score < 7;
                  const avg = d.average;

                  return (
                    <div
                      key={d.code}
                      className={`p-3 rounded-xl border transition-colors ${
                        isFail
                          ? 'bg-red-50/60 border-red-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between text-xs font-medium mb-1.5 gap-2">
                        <span className="text-slate-900 font-bold leading-snug">
                          {d.id}. {d.name}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-extrabold text-xs tabular-nums flex-shrink-0 ${
                            isFail
                              ? 'bg-red-800 text-white shadow-2xs'
                              : score === 10
                              ? 'bg-blue-50 text-blue-900 border border-blue-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {score}/10
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFail ? 'bg-red-800' : 'bg-slate-800'
                          }`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 tabular-nums">
                        <span>Exigência regulamentar: ≥ 7/10</span>
                        <span>Média da turma: <strong>{avg.toFixed(1)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
