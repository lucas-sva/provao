import React from 'react';
import type { Candidate, ProvaoSummary } from '../types/provao';
import { StatCard } from '../components/StatCard';
import { VillainDisciplineBar } from '../components/VillainDisciplineBar';
import { HistogramChart } from '../components/HistogramChart';
import { ScatterPlotLotacao } from '../components/ScatterPlotLotacao';
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  AlertOctagon,
  Flame,
  ArrowRight,
  ShieldCheck,
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
    <div className="space-y-8">
      {/* Shock Alert Banner for T2 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white p-6 sm:p-7 shadow-lg border border-rose-700/60">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-rose-300" />
            Choque de Realidade para a Turma 2 (T2)
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Quase 1 a cada 5 alunos da T1 não passou no Provão.
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-rose-100/90 text-pretty leading-relaxed">
            De 689 alunos avaliados, <strong className="text-white underline decoration-rose-400">122 foram reprovados (17,7%)</strong>. O maior perigo não foi a nota geral: <strong className="text-white">101 alunos foram eliminados exclusivamente pelo corte de 7 pontos por matéria</strong>, inclusive colegas que fizeram <strong className="text-white font-extrabold">93, 90 e 89 pontos</strong> no total!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToSimulator}
              className="tactile-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-900 font-bold text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <span>Simular meu risco na T2</span>
              <ArrowRight className="w-4 h-4 text-rose-800" />
            </button>
            <span className="text-xs text-rose-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Regra da CEV: mínimo 7 em todas as 10 matérias e 80 no total
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Avaliados"
          value={kpis.total_evaluated}
          subtitle="Candidatos presentes na T1 (Oficial Investigador)"
          icon={<Users className="w-5 h-5 text-slate-500" />}
          badge="689 nomes"
        />

        <StatCard
          title="Aprovados Plenos"
          value={kpis.approved_count}
          subtitle="Cumpriram corte total (≥80) e corte de matéria (≥7)"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          badge={`${kpis.approved_pct}%`}
          badgeVariant="emerald"
        />

        <StatCard
          title="Caiu por Disciplina"
          value={kpis.failed_disc_count}
          subtitle="Tiveram nota < 7 em alguma matéria (maior vilão)"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          badge={`${kpis.failed_disc_pct}%`}
          badgeVariant="rose"
          highlight={true}
        />

        <StatCard
          title="Caiu no Total"
          value={kpis.failed_total_count}
          subtitle="Fizeram menos de 80 pontos no somatório total"
          icon={<AlertOctagon className="w-5 h-5 text-amber-600" />}
          badge={`${kpis.failed_total_pct}%`}
          badgeVariant="amber"
        />
      </div>

      {/* Top Shock Casualties Table */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                O Perigo Invisível: Alunos com Notão que Reprovaram
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Casos reais da T1 de alunos que pontuaram muito acima de 80, mas caíram pela régua de corte de 7 pontos por matéria.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 text-rose-800">
            Corte CEV/UECE: Mínimo 7 por matéria
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {top_failed_scores.slice(0, 6).map((tf) => {
            const candidateObj = candidates.find((c) => c.pedido === tf.pedido);
            return (
              <div
                key={tf.pedido}
                onClick={() => candidateObj && onSelectCandidate(candidateObj)}
                className="p-3.5 rounded-xl bg-white border border-rose-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer tactile-button"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2">
                    {tf.nome}
                  </span>
                  <span className="tabular-nums font-extrabold text-sm px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                    {tf.total} pts
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-400">Reprovou por: </span>
                  <span className="font-semibold text-rose-700">
                    {tf.failing_disciplines.join(', ')}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Pedido #{tf.pedido}</span>
                  <span className="text-blue-600 font-medium">Ver Raio-X →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Villain Ranking & Histogram Split */}
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
