import React, { useState, useMemo } from 'react';
import type { Candidate } from '../types/provao';
import { Compass, TrendingUp, TrendingDown, Info } from 'lucide-react';

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
    return validCandidates.slice(0, 100);
  }, [validCandidates, filterMode]);

  // Top gainers and losers
  const topGainer = useMemo(() => {
    return [...validCandidates].sort((a, b) => b.rank_delta - a.rank_delta)[0];
  }, [validCandidates]);

  const topFaller = useMemo(() => {
    return [...validCandidates].sort((a, b) => a.rank_delta - b.rank_delta)[0];
  }, [validCandidates]);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              O Impacto do Provão na Fila de Lotação
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparativo entre a classificação da 1ª Fase e a nota do Provão. A nota final define quem escolhe primeiro a cidade/delegacia.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`tactile-button px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amostra Geral
          </button>
          <button
            onClick={() => setFilterMode('climbers')}
            className={`tactile-button px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'climbers' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maiores Saltos (↑)
          </button>
          <button
            onClick={() => setFilterMode('fallers')}
            className={`tactile-button px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'fallers' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maiores Quedas (↓)
          </button>
          <button
            onClick={() => setFilterMode('failed')}
            className={`tactile-button px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'failed' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reprovados
          </button>
        </div>
      </div>

      {/* Highlights: top gainer and faller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {topGainer && (
          <div
            onClick={() => onSelectCandidate(topGainer)}
            className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 cursor-pointer hover:bg-emerald-50 transition-colors tactile-button"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Maior Salto de Posição
              </span>
              <span className="tabular-nums font-extrabold text-emerald-700">+{topGainer.rank_delta} posições</span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">{topGainer.nome}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Passou em {topGainer.rank_1a_fase}º na 1ª fase → Tirou <strong>{topGainer.total} pts</strong> no Provão e subiu para {topGainer.rank_provao}º!
            </p>
          </div>
        )}

        {topFaller && (
          <div
            onClick={() => onSelectCandidate(topFaller)}
            className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 cursor-pointer hover:bg-rose-50 transition-colors tactile-button"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                Maior Queda de Posição
              </span>
              <span className="tabular-nums font-extrabold text-rose-700">{topFaller.rank_delta} posições</span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">{topFaller.nome}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Passou em {topFaller.rank_1a_fase}º na 1ª fase → Ficou em {topFaller.rank_provao}º no Provão com {topFaller.total} pts.
            </p>
          </div>
        )}
      </div>

      {/* Compact Interactive List */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
          {filtered.slice(0, 15).map((c) => {
            return (
              <div
                key={c.pedido}
                onClick={() => onSelectCandidate(c)}
                className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer transition-colors tactile-button"
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className="font-semibold text-slate-900 truncate">{c.nome}</span>
                  <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">#{c.pedido}</span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 tabular-nums">
                  <span className="text-slate-500">
                    1ª Fase: <strong className="text-slate-700">{c.rank_1a_fase}º</strong>
                  </span>
                  <span className="text-slate-500">
                    Provão: <strong className="text-blue-700">{c.total} pts ({c.rank_provao}º)</strong>
                  </span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      c.rank_delta > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.rank_delta < 0
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {c.rank_delta > 0 ? `+${c.rank_delta}` : c.rank_delta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>Clique em qualquer candidato para ver o raio-x e boletim individual completo.</span>
      </div>
    </div>
  );
};
