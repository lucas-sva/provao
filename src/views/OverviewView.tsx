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
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface OverviewViewProps {
  summary: ProvaoSummary;
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectDiscipline: (code: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  summary,
  candidates,
  onSelectCandidate,
  onSelectDiscipline,
}) => {
  const { kpis, villain_ranking, histogram, top_failed_scores } = summary;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
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
          subtitle="Atingiram corte global (≥ 80) e setorial (≥ 7)"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          badge={`${kpis.approved_pct}%`}
          badgeVariant="emerald"
        />

        <StatCard
          title="Retidos por Disciplina"
          value={kpis.failed_disc_count}
          subtitle="Obtiveram nota < 7 em ao menos uma matéria"
          icon={<AlertCircle className="w-4 h-4 text-red-800" />}
          badge={`${kpis.failed_disc_pct}%`}
          badgeVariant="rose"
        />

        <StatCard
          title="Retidos no Total"
          value={kpis.failed_total_count}
          subtitle="Não atingiram o mínimo de 80 pontos globais"
          icon={<AlertTriangle className="w-4 h-4 text-amber-700" />}
          badge={`${kpis.failed_total_pct}%`}
          badgeVariant="amber"
        />
      </div>

      {/* Notable Cases: High total scores with discipline retention */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Casos Notáveis: Pontuação Global Alta com Retenção por Disciplina
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed text-pretty">
              Alunos que conquistaram excelente pontuação total (≥ 80 pontos), mas foram desclassificados pelo corte mínimo individual de 7 acertos.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200/80 self-start sm:self-auto whitespace-nowrap">
            Corte CEV: Mínimo 7 por matéria
          </span>
        </div>

        {/* Responsive Grid of Notable Cases (No text cutting, no ellipsis) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {top_failed_scores.slice(0, 6).map((tf) => {
            const candidateObj = candidates.find((c) => c.pedido === tf.pedido);
            return (
              <div
                key={tf.pedido}
                onClick={() => candidateObj && onSelectCandidate(candidateObj)}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer tactile-button shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  {/* Candidate Name & Score Badge */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {tf.nome}
                    </span>
                    <span className="tabular-nums font-extrabold text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-white flex-shrink-0 shadow-xs">
                      {tf.total} pts
                    </span>
                  </div>

                  {/* Failing Disciplines with Full Clear Name */}
                  <div className="mt-2 text-xs">
                    <span className="text-slate-500 block text-[11px] font-medium mb-1">
                      Disciplina abaixo do corte:
                    </span>
                    <div className="space-y-1">
                      {tf.failing_disciplines.map((fd, fdIdx) => (
                        <span
                          key={fdIdx}
                          className="inline-block w-full px-2.5 py-1 rounded-md bg-red-50 text-red-900 font-semibold border border-red-200/80 leading-snug text-pretty text-[11px]"
                        >
                          {fd}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200/60">
                  <span className="font-mono text-[11px] text-slate-500">
                    Pedido #{tf.pedido}
                  </span>
                  <span className="text-blue-700 font-semibold text-xs flex items-center gap-1 hover:underline">
                    Ver raio-x <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retention Ranking & Global Score Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
