import React, { useEffect } from 'react';
import type { Candidate, DisciplineStat } from '../types/provao';
import { MetricBadge } from './MetricBadge';
import { X, Trophy, AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-12">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-200 ease-out">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 tabular-nums">
                    Pedido #{candidate.pedido}
                  </span>
                  <MetricBadge type="segment" value={candidate.segment} />
                  <MetricBadge
                    type="situacao"
                    value={candidate.situacao}
                    failingCount={candidate.num_failing_disciplines}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {candidate.nome}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="tactile-button p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI pills */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/70 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Nota Provão
                </span>
                <p className="text-lg font-extrabold text-blue-700 tabular-nums">
                  {candidate.total}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Posição Provão
                </span>
                <p className="text-lg font-extrabold text-slate-800 tabular-nums">
                  {candidate.rank_provao}º
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Rank 1ª Fase
                </span>
                <p className="text-lg font-extrabold text-slate-800 tabular-nums flex items-center justify-center gap-1">
                  {candidate.rank_1a_fase ? `${candidate.rank_1a_fase}º` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Warning if failed despite high score */}
            {!isApproved && candidate.total >= 80 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs leading-relaxed flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-sm mb-0.5">
                    Choque de Realidade: Nota Total Alta, mas Reprovado!
                  </strong>
                  Este aluno fez <strong>{candidate.total} pontos</strong> no cômputo geral,
                  mas foi eliminado por tirar menos de 7 em{' '}
                  <strong>{candidate.num_failing_disciplines} disciplina(s)</strong>.
                </div>
              </div>
            )}

            {/* Comparison with 1st phase / Lotation Shift */}
            {candidate.rank_1a_fase && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Impacto na Escolha de Lotação
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Posição na 1ª fase: <strong>{candidate.rank_1a_fase}º</strong>
                  </span>
                  <span className="text-slate-600">
                    Posição Provão: <strong>{candidate.rank_provao}º</strong>
                  </span>
                </div>
                <div className="mt-2 text-xs flex items-center gap-1 font-semibold">
                  {candidate.rank_delta > 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      Ganhou {candidate.rank_delta} posições na classificação!
                    </span>
                  ) : candidate.rank_delta < 0 ? (
                    <span className="text-rose-600 flex items-center gap-1">
                      <ArrowDownRight className="w-4 h-4" />
                      Perdeu {Math.abs(candidate.rank_delta)} posições para a lotação.
                    </span>
                  ) : (
                    <span className="text-slate-600">Manteve a mesma posição relativa.</span>
                  )}
                </div>
              </div>
            )}

            {/* 10 Disciplines Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  Boletim das 10 Disciplinas (Corte: 7 pts)
                </h3>
                <span className="text-[11px] text-slate-400">Aluno vs Média</span>
              </div>

              <div className="space-y-2.5">
                {disciplines.map((d, idx) => {
                  const score = candidate.scores[idx];
                  const isFail = score < 7;
                  const avg = d.average;

                  return (
                    <div
                      key={d.code}
                      className={`p-3 rounded-xl border transition-colors ${
                        isFail
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-semibold truncate pr-2">
                          {d.id}. {d.name}
                        </span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                              isFail
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {score}/10
                          </span>
                        </div>
                      </div>

                      {/* Visual progress comparison */}
                      <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isFail ? 'bg-rose-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span>Corte mínimo: 7/10</span>
                        <span className="tabular-nums">Média geral: {avg.toFixed(1)}/10</span>
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
