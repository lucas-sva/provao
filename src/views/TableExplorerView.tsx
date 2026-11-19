import React, { useState, useMemo } from 'react';
import type { Candidate, DisciplineStat } from '../types/provao';
import { MetricBadge } from '../components/MetricBadge';
import Fuse from 'fuse.js';
import {
  Search,
  Download,
  Filter,
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
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
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Export CSV button */}
          <button
            onClick={exportCSV}
            className="tactile-button inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV ({filteredCandidates.length})</span>
          </button>
        </div>

        {/* Filter Selects (No abbreviated names!) */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-200/80 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </span>

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setDisplayCount(40);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer text-xs"
          >
            <option value="all">Todas as Situações</option>
            <option value="approved">Apenas Aprovados</option>
            <option value="failed_disc">Retido por Disciplina (&lt; 7)</option>
            <option value="failed_total">Retido no Total (&lt; 80)</option>
          </select>

          {/* Failing discipline select with Full Clean Names */}
          <select
            value={failingDisciplineFilter}
            onChange={(e) => {
              setFailingDisciplineFilter(e.target.value);
              setDisplayCount(40);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer text-xs max-w-[260px] sm:max-w-xs truncate"
          >
            <option value="all">Qualquer Disciplina</option>
            {disciplines.map((d) => (
              <option key={d.code} value={d.code}>
                Nota &lt; 7 em {d.name}
              </option>
            ))}
          </select>

          {/* Segment select */}
          <select
            value={segmentFilter}
            onChange={(e) => {
              setSegmentFilter(e.target.value);
              setDisplayCount(40);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer text-xs"
          >
            <option value="all">Todos os Segmentos</option>
            <option value="ampla">Ampla Concorrência</option>
            <option value="negro">Cotas Raciais (Negros)</option>
            <option value="pcd">PcD</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="tactile-button inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition-colors cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

          <div className="ml-auto text-slate-500 font-medium tabular-nums text-xs">
            Exibindo <strong>{filteredCandidates.length}</strong> de <strong>{candidates.length}</strong>
          </div>
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

                {/* 10 Discipline Scores Quick Strip */}
                <div className="pt-2 border-t border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Notas nas 10 Disciplinas (Corte: 7)</span>
                    <span className="text-blue-700 lowercase font-medium flex items-center">
                      ver raio-x <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {c.scores.map((sc, scIdx) => {
                      const d = disciplines[scIdx];
                      const isFail = sc < 7;
                      return (
                        <div
                          key={scIdx}
                          className={`p-1 rounded-md border text-[11px] font-bold tabular-nums ${
                            isFail
                              ? 'bg-red-800 text-white border-red-900'
                              : sc === 10
                              ? 'bg-blue-50 text-blue-900 border-blue-200'
                              : 'bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                          title={`${d?.name || `D0${scIdx+1}`}: ${sc} pts`}
                        >
                          <span className="text-[9px] font-mono text-slate-400 block font-normal leading-none mb-0.5">
                            {d?.code || `D${scIdx+1}`}
                          </span>
                          {sc}
                        </div>
                      );
                    })}
                  </div>
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
                    className="py-3 px-1.5 text-center font-mono text-[10px] whitespace-nowrap"
                    title={`${d.id}. ${d.name} (${d.range})`}
                  >
                    {d.code}
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

                      {/* 10 Discipline Scores */}
                      {c.scores.map((sc, scIdx) => (
                        <td key={scIdx} className="py-2.5 px-1.5 text-center text-[11px]">
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
