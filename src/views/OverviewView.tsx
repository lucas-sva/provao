import React from 'react';
import type { Candidate, ProvaoSummary } from '../types/provao';
import { StatCard } from '../components/StatCard';
import { VillainDisciplineBar } from '../components/VillainDisciplineBar';
import { HistogramChart } from '../components/HistogramChart';
import { ScatterPlotLotacao } from '../components/ScatterPlotLotacao';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface OverviewViewProps {
  summary: ProvaoSummary;
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigateToSimulator: () => void;
  onSelectDiscipline: (code: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  summary,
  candidates,
  onSelectCandidate,
  onNavigateToSimulator,
  onSelectDiscipline,
}) => {
  const { kpis, villain_ranking, histogram, top_failed_scores } = summary;

  return (
    <div className="space-y-6">
      {/* Informative / Journalistic Executive Briefing Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-xl border border-slate-200 shadow-xs bg-white">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Panorama Analítico · Turma 1</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            Diagnóstico dos Resultados da Avaliação Final (CFP / PC-CE)
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed text-pretty">
            Dos 689 alunos avaliados no provão da primeira turma (Comunicado Nº 284/2026-CEV/UECE),{' '}
            <strong className="text-slate-900 font-semibold">122 (17,7%)</strong> não alcançaram os perfis de aprovação na lista preliminar. A análise quantitativa revela que a pontuação total não foi a principal barreira:{' '}
            <strong className="text-slate-900 font-semibold">101 candidatos foram desclassificados exclusivamente pelo critério de 7 pontos por disciplina</strong>, incluindo alunos com pontuações globais de até <strong className="text-slate-900 font-semibold">93 e 90 pontos</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToSimulator}
              className="tactile-button inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Acessar Simulador de Critérios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Critérios oficiais: mínimo 7 em cada disciplina e mínimo 80 no total
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total de Avaliados"
          value={kpis.total_evaluated}
          subtitle="Candidatos presentes no Provão da T1"
          icon={<Users className="w-4 h-4 text-slate-500" />}
          badge="689 alunos"
        />

        <StatCard
          title="Aprovados nos Perfis"
          value={kpis.approved_count}
          subtitle="Atingiram simultaneamente o corte global e o setorial"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          badge={`${kpis.approved_pct}%`}
          badgeVariant="emerald"
        />

        <StatCard
          title="Retidos por Disciplina"
          value={kpis.failed_disc_count}
          subtitle="Obtiveram nota < 7 em pelo menos uma disciplina"
          icon={<AlertCircle className="w-4 h-4 text-red-800" />}
          badge={`${kpis.failed_disc_pct}%`}
          badgeVariant="rose"
        />

        <StatCard
          title="Retidos no Total"
          value={kpis.failed_total_count}
          subtitle="Não atingiram o mínimo de 80 pontos globais"
          icon={<AlertCircle className="w-4 h-4 text-amber-700" />}
          badge={`${kpis.failed_total_pct}%`}
          badgeVariant="amber"
        />
      </div>

      {/* Notable Cases: High total scores with discipline retention */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Casos Notáveis: Desempenho Global Elevado com Retenção Setorial
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registros oficiais de alunos que obtiveram pontuações globais elevadas (&ge; 80 pts), mas não cumpriram a exigência mínima de 7 acertos por matéria.
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Regra CEV: Mínimo 7 por disciplina
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {top_failed_scores.slice(0, 6).map((tf) => {
            const candidateObj = candidates.find((c) => c.pedido === tf.pedido);
            return (
              <div
                key={tf.pedido}
                onClick={() => candidateObj && onSelectCandidate(candidateObj)}
                className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all cursor-pointer tactile-button"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2">
                    {tf.nome}
                  </span>
                  <span className="tabular-nums font-bold text-xs px-2 py-0.2 rounded bg-slate-800 text-white">
                    {tf.total} pts
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-400">Disciplina abaixo do corte: </span>
                  <span className="font-medium text-red-900">
                    {tf.failing_disciplines.join(', ')}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-200/60">
                  <span>Pedido #{tf.pedido}</span>
                  <span className="text-slate-600 font-medium hover:underline">Ver detalhes →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retention Ranking & Histogram Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VillainDisciplineBar
          ranking={villain_ranking}
          totalEvaluated={kpis.total_evaluated}
          onSelectDiscipline={onSelectDiscipline}
        />
        <HistogramChart buckets={histogram} totalCandidates={kpis.total_evaluated} />
      </div>

      {/* Impact on Lotation / Choice of Precinct */}
      <ScatterPlotLotacao
        candidates={candidates}
        onSelectCandidate={onSelectCandidate}
      />
    </div>
  );
};
