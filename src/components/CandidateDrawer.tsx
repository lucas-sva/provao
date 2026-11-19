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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!candidate) return null;

  const isApproved = candidate.situacao.includes('Alcançou os perfis');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-150"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-12">
        <div className="w-screen max-w-md bg-white shadow-xl border-l border-slate-200 flex flex-col transform transition-transform duration-150 ease-out">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 tabular-nums">
                    Pedido #{candidate.pedido}
                  </span>
                  <MetricBadge type="segment" value={candidate.segment} />
                  <MetricBadge
                    type="situacao"
                    value={candidate.situacao}
                    failingCount={candidate.num_failing_disciplines}
                  />
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {candidate.nome}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="tactile-button p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI pills */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/70 text-center">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Nota Provão
                </span>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {candidate.total}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Classificação
                </span>
                <p className="text-lg font-bold text-slate-800 tabular-nums">
                  {candidate.rank_provao}º
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  1ª Fase
                </span>
                <p className="text-lg font-bold text-slate-800 tabular-nums flex items-center justify-center gap-1">
                  {candidate.rank_1a_fase ? `${candidate.rank_1a_fase}º` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Context message if high score but failed discipline */}
            {!isApproved && candidate.total >= 80 && (
              <div className="p-3.5 rounded-lg bg-red-50/70 border border-red-200 text-red-950 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-red-900 mb-0.5">
                    Critério Normativo: Nota Global Elevada com Retenção
                  </strong>
                  O candidato obteve <strong>{candidate.total} pontos</strong> no cômputo geral,
                  porém obteve nota inferior a 7 em{' '}
                  <strong>{candidate.num_failing_disciplines} disciplina(s)</strong>.
                </div>
              </div>
            )}

            {/* Impact on lotation */}
            {candidate.rank_1a_fase && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 mb-1.5 text-slate-800 font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Variação na Fila de Lotação</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Posição inicial (1ª fase): <strong>{candidate.rank_1a_fase}º</strong></span>
                  <span>Posição no Provão: <strong>{candidate.rank_provao}º</strong></span>
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 font-medium">
                  {candidate.rank_delta > 0 ? (
                    <span className="text-emerald-800 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
                      Avançou {candidate.rank_delta} posições na classificação final.
                    </span>
                  ) : candidate.rank_delta < 0 ? (
                    <span className="text-slate-600 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" />
                      Recuou {Math.abs(candidate.rank_delta)} posições na classificação final.
                    </span>
                  ) : (
                    <span className="text-slate-500">Manteve a mesma posição relativa.</span>
                  )}
                </div>
              </div>
            )}

            {/* 10 Disciplines Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                  Desempenho por Disciplina (Corte: 7 pts)
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
                      className={`p-2.5 rounded-lg border transition-colors ${
                        isFail
                          ? 'bg-red-50/50 border-red-200'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-semibold truncate pr-2">
                          {d.id}. {d.name}
                        </span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span
                            className={`px-2 py-0.2 rounded font-bold text-xs ${
                              isFail
                                ? 'bg-red-800 text-white'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {score}/10
                          </span>
                        </div>
                      </div>

                      {/* Visual progress bar */}
                      <div className="relative w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isFail ? 'bg-red-800' : 'bg-slate-700'
                          }`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>Corte mínimo: 7/10</span>
                        <span className="tabular-nums">Média da turma: {avg.toFixed(1)}</span>
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
