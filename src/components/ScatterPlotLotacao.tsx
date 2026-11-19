import React, { useState, useMemo } from 'react';
import type { Candidate } from '../types/provao';
import { Compass, TrendingUp, TrendingDown, Info, ChevronRight } from 'lucide-react';

interface ScatterPlotLotacaoProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

export const ScatterPlotLotacao: React.FC<ScatterPlotLotacaoProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'climbers' | 'fallers' | 'failed'>('all');

  // Filter candidates with valid 1st phase ranking
  const validCandidates = useMemo(() => {
    return candidates.filter((c) => c.rank_1a_fase !== null);
  }, [candidates]);

  const filtered = useMemo(() => {
    if (filterMode === 'climbers') {
      return [...validCandidates].sort((a, b) => b.rank_delta - a.rank_delta).slice(0, 50);
    }
    if (filterMode === 'fallers') {
      return [...validCandidates].sort((a, b) => a.rank_delta - b.rank_delta).slice(0, 50);
    }
    if (filterMode === 'failed') {
      return validCandidates.filter((c) => !c.situacao.includes('Alcançou os perfis'));
    }
    return validCandidates.slice(0, 50);
  }, [validCandidates, filterMode]);

  // Top gainers and losers
  const topGainer = useMemo(() => {
    return [...validCandidates].sort((a, b) => b.rank_delta - a.rank_delta)[0];
  }, [validCandidates]);

  const topFaller = useMemo(() => {
    return [...validCandidates].sort((a, b) => a.rank_delta - b.rank_delta)[0];
  }, [validCandidates]);

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm bg-white">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              O Impacto do Provão na Fila de Lotação
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparativo entre a classificação na 1ª Fase e o resultado no Provão (decisivo para a escolha de delegacias).
          </p>
        </div>

        {/* Filter buttons with touch targets */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold overflow-x-auto self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`tactile-button px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
              filterMode === 'all'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amostra Geral
          </button>
          <button
            onClick={() => setFilterMode('climbers')}
            className={`tactile-button px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
              filterMode === 'climbers'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maiores Saltos (↑)
          </button>
          <button
            onClick={() => setFilterMode('fallers')}
            className={`tactile-button px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
              filterMode === 'fallers'
                ? 'bg-white text-rose-800 shadow-xs border border-rose-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maiores Quedas (↓)
          </button>
          <button
            onClick={() => setFilterMode('failed')}
            className={`tactile-button px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
              filterMode === 'failed'
                ? 'bg-white text-red-900 shadow-xs border border-red-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reprovados
          </button>
        </div>
      </div>

      {/* Highlights: top gainer and faller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {topGainer && (
          <div
            onClick={() => onSelectCandidate(topGainer)}
            className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors tactile-button shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Maior Salto de Posição
              </span>
              <span className="tabular-nums font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                +{topGainer.rank_delta} posições
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mt-1">
              {topGainer.nome}
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Passou em <strong>{topGainer.rank_1a_fase}º</strong> na 1ª fase → Tirou <strong>{topGainer.total} pontos</strong> no Provão e subiu para <strong>{topGainer.rank_provao}º lugar</strong>!
            </p>
          </div>
        )}

        {topFaller && (
          <div
            onClick={() => onSelectCandidate(topFaller)}
            className="p-3.5 sm:p-4 rounded-xl bg-rose-50/70 border border-rose-200 cursor-pointer hover:bg-rose-50 transition-colors tactile-button shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-700" />
                Maior Queda de Posição
              </span>
              <span className="tabular-nums font-extrabold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-300">
                {topFaller.rank_delta} posições
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mt-1">
              {topFaller.nome}
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Passou em <strong>{topFaller.rank_1a_fase}º</strong> na 1ª fase → Obteve <strong>{topFaller.total} pontos</strong> no Provão e recuou para <strong>{topFaller.rank_provao}º lugar</strong>.
            </p>
          </div>
        )}
      </div>

      {/* ── RESPONSIVE CANDIDATE LIST (NO NAME TRUNCATION ON MOBILE!) ── */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {filtered.slice(0, 30).map((c) => {
            const isApproved = c.situacao.includes('Alcançou');
            return (
              <div
                key={c.pedido}
                onClick={() => onSelectCandidate(c)}
                className={`p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-blue-50/40 cursor-pointer transition-colors tactile-button ${
                  !isApproved ? 'bg-red-50/20' : ''
                }`}
              >
                {/* Line 1: Full Candidate Name (NO ellipsis, wraps naturally!) + Delta Badge */}
                <div className="flex items-start justify-between sm:justify-start gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug block">
                      {c.nome}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] block sm:hidden mt-0.5">
                      Pedido #{c.pedido}
                    </span>
                  </div>

                  {/* Rank Delta Badge on Mobile (shown right next to name on mobile) */}
                  <span
                    className={`sm:hidden font-bold px-2 py-0.5 rounded-md text-[11px] tabular-nums whitespace-nowrap self-start ${
                      c.rank_delta > 0
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : c.rank_delta < 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.rank_delta > 0 ? `+${c.rank_delta} ↑` : c.rank_delta < 0 ? `${c.rank_delta} ↓` : '='}
                  </span>
                </div>

                {/* Line 2 on Mobile / Right Column on Desktop: Stats */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap justify-between sm:justify-end text-xs tabular-nums pt-1 sm:pt-0">
                  <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                    #{c.pedido}
                  </span>

                  <span className="text-slate-600 bg-slate-100 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded text-[11px] sm:text-xs">
                    1ª Fase: <strong className="text-slate-800 font-bold">{c.rank_1a_fase}º</strong>
                  </span>

                  <span className="text-slate-600 bg-blue-50/70 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded text-[11px] sm:text-xs">
                    Provão:{' '}
                    <strong className="text-blue-700 font-extrabold">
                      {c.total} pts ({c.rank_provao}º)
                    </strong>
                  </span>

                  {/* Delta Badge on Desktop */}
                  <span
                    className={`hidden sm:inline-flex font-bold px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap tabular-nums ${
                      c.rank_delta > 0
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : c.rank_delta < 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {c.rank_delta > 0 ? `+${c.rank_delta} ↑` : c.rank_delta < 0 ? `${c.rank_delta} ↓` : '='}
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>Toque em qualquer candidato para abrir o raio-x e boletim individual com as 10 notas.</span>
      </div>
    </div>
  );
};
