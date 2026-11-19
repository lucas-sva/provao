import React, { useState, useMemo } from 'react';
import type { Candidate, DisciplineStat } from '../types/provao';
import { MetricBadge } from '../components/MetricBadge';
import Fuse from 'fuse.js';
import {
  Search,
  Download,
  ArrowUpDown,
  X,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

interface TableExplorerViewProps {
  candidates: Candidate[];
  disciplines: DisciplineStat[];
  onSelectCandidate: (candidate: Candidate) => void;
  initialDisciplineFilter?: string;
}

export const TableExplorerView: React.FC<TableExplorerViewProps> = ({
  candidates,
  disciplines,
  onSelectCandidate,
  initialDisciplineFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'failed_disc' | 'failed_total'>('all');
  const [failingDisciplineFilter, setFailingDisciplineFilter] = useState<string>(initialDisciplineFilter || 'all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'total' | 'rank_provao' | 'rank_1a_fase' | 'nome' | 'pedido'>('rank_provao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Progressive loading limit for smooth performance on mobile
  const [displayCount, setDisplayCount] = useState<number>(40);

  // Fuse.js index for instant search
  const fuse = useMemo(() => {
    return new Fuse(candidates, {
      keys: ['nome', 'pedido'],
      threshold: 0.3,
    });
  }, [candidates]);

  // Filtered & Searched data
  const filteredCandidates = useMemo(() => {
    let result = candidates;

    // Search
    if (searchTerm.trim()) {
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    // Status filter
    if (statusFilter === 'approved') {
      result = result.filter((c) => c.situacao.includes('Alcançou'));
    } else if (statusFilter === 'failed_disc') {
      result = result.filter((c) => c.situacao.includes('perfil de disciplina'));
    } else if (statusFilter === 'failed_total') {
      result = result.filter((c) => c.situacao.includes('perfil total'));
    }

    // Failing discipline filter
    if (failingDisciplineFilter !== 'all') {
      result = result.filter((c) => c.failing_disciplines.includes(failingDisciplineFilter));
    }

    // Segment filter
    if (segmentFilter !== 'all') {
      result = result.filter((c) => c.segment.toLowerCase().includes(segmentFilter.toLowerCase()));
    }

    // Sort
    return [...result].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (valA === null || valA === undefined) valA = 999999;
      if (valB === null || valB === undefined) valB = 999999;

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [candidates, fuse, searchTerm, statusFilter, failingDisciplineFilter, segmentFilter, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Pedido',
      'Nome',
      'Rank Provão',
      'Rank 1a Fase',
      'Delta',
      'Segmento',
      'Total',
      'Situação',
      ...disciplines.map((d) => d.name),
    ];

    const rows = filteredCandidates.map((c) => [
      c.pedido,
      `"${c.nome}"`,
      c.rank_provao,
      c.rank_1a_fase ?? '',
      c.rank_delta,
      `"${c.segment}"`,
      c.total,
      `"${c.situacao}"`,
      ...c.scores,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'provao_t1_resultado_auditado.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFailingDisciplineFilter('all');
    setSegmentFilter('all');
  };

  const hasActiveFilters =
    searchTerm !== '' || statusFilter !== 'all' || failingDisciplineFilter !== 'all' || segmentFilter !== 'all';

  const visibleCandidates = filteredCandidates.slice(0, displayCount);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3.5 bg-white">
        {/* Row 1: Search & Export CSV */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input (44px min touch target, 16px font to prevent mobile zoom) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayCount(40);
              }}
              placeholder="Buscar candidato por nome ou número do pedido..."
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="tactile-button absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-2 cursor-pointer"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Export CSV button */}
          <button
            onClick={exportCSV}
            className="tactile-button h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV ({filteredCandidates.length})</span>
          </button>
        </div>

        {/* Quick Filter Chips for Status (1-Tap Selection on Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => {
              setStatusFilter('all');
              setDisplayCount(40);
            }}
            className={`tactile-button px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Todos ({candidates.length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('approved');
              setDisplayCount(40);
            }}
            className={`tactile-button px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'approved'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Aprovados (567)
          </button>
          <button
            onClick={() => {
              setStatusFilter('failed_disc');
              setDisplayCount(40);
            }}
            className={`tactile-button px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'failed_disc'
                ? 'bg-red-800 text-white shadow-2xs'
                : 'bg-red-50 text-red-900 hover:bg-red-100 border border-red-200/60'
            }`}
          >
            Retidos por Matéria (101)
          </button>
          <button
            onClick={() => {
              setStatusFilter('failed_total');
              setDisplayCount(40);
            }}
            className={`tactile-button px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'failed_total'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Retidos no Total (21)
          </button>
        </div>

        {/* Row 2: Aligned Select Dropdowns (Full Clean Names, No Abbreviations!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-200/80 text-xs sm:text-sm">
          {/* Discipline with cut (< 7) select with Full Clean Names */}
          <div>
            <label htmlFor="filter-disc" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Disciplina com nota &lt; 7:
            </label>
            <select
              id="filter-disc"
              value={failingDisciplineFilter}
              onChange={(e) => {
                setFailingDisciplineFilter(e.target.value);
                setDisplayCount(40);
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">Todas as Disciplinas</option>
              {disciplines.map((d) => (
                <option key={d.code} value={d.code}>
                  Corte em {d.name} ({d.below_7_count} alunos)
                </option>
              ))}
            </select>
          </div>

          {/* Segment / Cota select */}
          <div>
            <label htmlFor="filter-seg" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Segmento / Cota de Concurso:
            </label>
            <select
              id="filter-seg"
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setDisplayCount(40);
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer text-xs sm:text-sm"
            >
              <option value="all">Todos os Segmentos</option>
              <option value="ampla">Ampla Concorrência</option>
              <option value="negro">Cotas Raciais (Negros)</option>
              <option value="pcd">PcD (Pessoas com Deficiência)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Active Filters Summary & Counter */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium tabular-nums">
              Exibindo <strong>{filteredCandidates.length}</strong> de <strong>{candidates.length}</strong> candidatos
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="tactile-button inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition-colors cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE VIEW: Rich Candidate Cards (sm:hidden) ── */}
      <div className="block sm:hidden space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 text-center text-slate-500 bg-white">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700">Nenhum candidato encontrado</p>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros ou a busca digitada.</p>
          </div>
        ) : (
          visibleCandidates.map((c) => {
            const isApproved = c.situacao.includes('Alcançou');
            return (
              <div
                key={c.pedido}
                onClick={() => onSelectCandidate(c)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer tactile-button shadow-2xs flex flex-col gap-2.5 ${
                  !isApproved
                    ? 'bg-red-50/25 border-red-200 hover:border-red-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top: Rank & Total Score */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-white tabular-nums shadow-xs">
                      {c.rank_provao}º lugar
                    </span>
                    <MetricBadge type="segment" value={c.segment} />
                  </div>

                  <span className="font-extrabold text-base text-blue-700 tabular-nums">
                    {c.total} <span className="text-xs font-normal text-slate-400">pts</span>
                  </span>
                </div>

                {/* Candidate Name: Full, wrapped naturally, ZERO ELLIPSIS! */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {c.nome}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 tabular-nums">
                    <span>Pedido #{c.pedido}</span>
                    <span>·</span>
                    <span>1ª Fase: <strong>{c.rank_1a_fase ? `${c.rank_1a_fase}º` : '—'}</strong></span>
                    <span>·</span>
                    <MetricBadge type="rank_delta" value={c.rank_delta} />
                  </div>
                </div>

                {/* Situation Badge */}
                <div>
                  <MetricBadge
                    type="situacao"
                    value={c.situacao}
                    failingCount={c.num_failing_disciplines}
                  />
                </div>

                {/* If candidate has failing disciplines, display full clean names */}
                {c.failing_disciplines.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs">
                    <span className="font-bold text-red-900 block mb-1">
                      Disciplina(s) abaixo do corte (&lt; 7):
                    </span>
                    <div className="space-y-1">
                      {c.failing_disciplines.map((code) => {
                        const d = disciplines.find((item) => item.code === code);
                        const sc = d ? c.scores[d.id - 1] : 0;
                        return (
                          <div key={code} className="flex items-center justify-between text-red-950 font-medium">
                            <span className="leading-snug pr-2">{d?.name || code}</span>
                            <span className="font-bold tabular-nums bg-red-800 text-white px-2 py-0.5 rounded text-[11px] flex-shrink-0 shadow-2xs">
                              {sc}/10 pts
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 10 Discipline Scores Quick Strip */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                    {c.scores.map((sc, scIdx) => {
                      const d = disciplines[scIdx];
                      const isFail = sc < 7;
                      return (
                        <div
                          key={scIdx}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold tabular-nums flex-shrink-0 ${
                            isFail
                              ? 'bg-red-800 text-white font-extrabold shadow-2xs'
                              : sc === 10
                              ? 'bg-blue-50 text-blue-900 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                          title={`${d?.name || `Matéria ${scIdx+1}`}: ${sc} pts`}
                        >
                          {sc}
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-xs text-blue-700 font-semibold hover:underline flex items-center ml-auto flex-shrink-0">
                    Detalhes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Load More Button for Mobile */}
        {filteredCandidates.length > visibleCandidates.length && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 40)}
              className="tactile-button w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs shadow-xs hover:bg-slate-50 cursor-pointer"
            >
              Carregar mais candidatos ({filteredCandidates.length - visibleCandidates.length} restantes)
            </button>
          </div>
        )}
      </div>

      {/* ── DESKTOP VIEW: Full Dense Audit Table (hidden sm:block) ── */}
      <div className="hidden sm:block glass-panel rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleSort('rank_provao')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pedido')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Pedido</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('nome')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 select-none min-w-[240px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Nome do Aluno</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rank_1a_fase')}
                  className="py-3 px-2 cursor-pointer hover:bg-slate-200/60 select-none text-center"
                  title="Classificação na 1ª Fase"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>1ª Fase</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center" title="Delta de Posição">
                  Delta
                </th>
                <th className="py-3 px-2">Cota</th>
                {disciplines.map((d) => (
                  <th
                    key={d.code}
                    className="py-3 px-1 text-center font-bold text-[11px] text-slate-700 w-9 min-w-[36px] max-w-[40px] whitespace-nowrap cursor-help select-none"
                    title={`${d.id}. ${d.name} (Questões ${d.range} do Provão)`}
                  >
                    <span className="block">{d.id}</span>
                  </th>
                ))}
                <th
                  onClick={() => handleSort('total')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 select-none text-right font-extrabold text-blue-800"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Situação Oficial</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Nenhum aluno encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const isApproved = c.situacao.includes('Alcançou');
                  return (
                    <tr
                      key={c.pedido}
                      onClick={() => onSelectCandidate(c)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        !isApproved ? 'bg-red-50/15' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold tabular-nums text-slate-700">
                        {c.rank_provao}º
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                        {c.pedido}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 min-w-[220px]">
                        {c.nome}
                      </td>
                      <td className="py-2.5 px-2 text-center tabular-nums text-slate-500">
                        {c.rank_1a_fase ? `${c.rank_1a_fase}º` : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <MetricBadge type="rank_delta" value={c.rank_delta} />
                      </td>
                      <td className="py-2.5 px-2">
                        <MetricBadge type="segment" value={c.segment} />
                      </td>

                      {/* 10 Discipline Scores (Fixed Dimension for Flawless Vertical Alignment) */}
                      {c.scores.map((sc, scIdx) => (
                        <td key={scIdx} className="py-2.5 px-1 text-center w-9 min-w-[36px] max-w-[40px]">
                          <MetricBadge type="score" value={sc} />
                        </td>
                      ))}

                      <td className="py-2.5 px-3 text-right font-extrabold text-sm text-blue-700 tabular-nums">
                        {c.total}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <MetricBadge
                          type="situacao"
                          value={c.situacao}
                          failingCount={c.num_failing_disciplines}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
