import React, { useState } from 'react';
import type { DisciplineStat, Candidate } from '../types/provao';
import { BookOpen, ShieldCheck, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';

interface DisciplinesViewProps {
  disciplines: DisciplineStat[];
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onFilterTableByDiscipline: (code: string) => void;
}

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  disciplines,
  candidates,
  onSelectCandidate,
  onFilterTableByDiscipline,
}) => {
  const [selectedDisciplineCode, setSelectedDisciplineCode] = useState<string>(disciplines[0].code);

  const selectedDiscipline = disciplines.find((d) => d.code === selectedDisciplineCode) || disciplines[0];

  const failedInThisDisc = candidates.filter(
    (c) => c.scores[selectedDiscipline.id - 1] < 7
  );

  const disciplineInsights: Record<string, { tips: string; focus: string; retentionType: 'alta' | 'moderada' | 'baixa' }> = {
    D01: {
      tips: 'Atenção aos prazos regimentais de remessa de inquéritos policiais, termos circunstanciados de ocorrência (TCO), autos de apreensão e formalidades de certidões cartorárias.',
      focus: 'Fluxo cartorário, prazos legais, livro de registro e formalização do IP.',
      retentionType: 'moderada',
    },
    D02: {
      tips: 'Registrou 29 retenções no corte. Foco no planejamento operacional de mandados de busca e apreensão, hierarquia de comando e segurança orgânica da equipe policial.',
      focus: 'Briefing, planejamento tático de incursão, ordens de missão e relatórios operacionais.',
      retentionType: 'moderada',
    },
    D03: {
      tips: 'Requer concisão técnica, objetividade, fundamentação probatória e vedação estrita de emissão de juízos subjetivos sem lastro no relatório policial.',
      focus: 'Estrutura padrão do relatório de investigação policial e estabelecimento do nexo causal.',
      retentionType: 'moderada',
    },
    D04: {
      tips: 'Terceira matéria com maior volume de retenções (34 casos). Atenção à parametrização das bases de dados policiais (SIP, Infopol, INFOSEG) e protocolos de segurança da informação.',
      focus: 'Módulos de consulta, sigilo funcional, perfis de acesso e integração de dados.',
      retentionType: 'alta',
    },
    D05: {
      tips: 'Cadeia de custódia (art. 158-A a 158-F do CPP). Questões sobre isolamento, fixação, coleta e acondicionamento de vestígios geraram divergências.',
      focus: 'Etapas da cadeia de custódia, lacres forenses e preservação de cena de crime.',
      retentionType: 'moderada',
    },
    D06: {
      tips: 'Segunda disciplina com maior índice de retenção (46 casos, sendo 18 exclusivos). Atenção às qualificadoras de feminicídio, exames necroscópicos e primeiras medidas em local de morte violenta.',
      focus: 'Dinâmica de homicídio, feminicídio, isolamento do corpo e confronto de versões testemunhais.',
      retentionType: 'alta',
    },
    D07: {
      tips: 'Disciplina com elevado índice de acertos médios (9,40). Atenção aos tipos da Lei 11.343/06 (art. 28 vs 33), laudos de constatação e validade da prisão em flagrante.',
      focus: 'Diferenciação legal entre usuário e traficante, laudo provisório e definitivo.',
      retentionType: 'baixa',
    },
    D08: {
      tips: 'Maior média geral observada na turma (9,53). Foco em furto qualificado, roubo majorado, estelionato digital e receptação.',
      focus: 'Causas de aumento no roubo, fraudes eletrônicas e recuperação de ativos subtraídos.',
      retentionType: 'baixa',
    },
    D09: {
      tips: 'Foco nos crimes funcionais contra a administração pública (peculato, concussão, corrupção passiva/ativa) e enriquecimento ilícito na Lei de Improbidade Administrativa.',
      focus: 'Tipificação estrita, atos de ofício e tutela da probidade administrativa.',
      retentionType: 'moderada',
    },
    D10: {
      tips: 'Maior volume de retenções do provão (59 casos, 27 exclusivos). A banca cobrou minúcias de extração lógica vs física, blindagem eletromagnética (Gaiola de Faraday), cálculo de hash e espelhamento forense.',
      focus: 'Cadeia de custódia de dados móveis, técnicas de extração, integridade de hash e softwares forenses.',
      retentionType: 'alta',
    },
  };

  const currentInsight = disciplineInsights[selectedDiscipline.code] || {
    tips: 'Acompanhe as diretrizes do plano de aula da AESP e resolva as questões da turma anterior.',
    focus: 'Conteúdo programático oficial.',
    retentionType: 'moderada',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            Análise Individual das Disciplinas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Examine a curva de notas dos 689 alunos, média da turma e reprovações no corte individual (mínimo de 7 acertos).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-900 font-bold border border-red-200/80">
            Extração de Dados e Homicídios concentram 57% das retenções
          </span>
        </div>
      </div>

      {/* Prominent Discipline Selector Dropdown (Intuitive and Mobile-First) */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm bg-white space-y-3">
        <label htmlFor="discipline-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Selecione a disciplina para analisar:
        </label>

        <div className="relative">
          <select
            id="discipline-select"
            value={selectedDisciplineCode}
            onChange={(e) => setSelectedDisciplineCode(e.target.value)}
            className="w-full h-12 sm:h-14 pl-4 pr-11 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-slate-200 focus:border-blue-600 text-slate-900 font-bold text-sm sm:text-base focus:outline-none transition-all cursor-pointer shadow-2xs appearance-none"
          >
            {disciplines.map((d) => (
              <option key={d.code} value={d.code} className="py-2 text-slate-900 font-medium">
                {d.name} — Média: {d.average.toFixed(2)} | {d.below_7_count} abaixo de 7
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <span>
            Questões <strong>{selectedDiscipline.range}</strong> do caderno de provas
          </span>
          <span className="font-semibold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            {selectedDiscipline.below_7_count} alunos ({selectedDiscipline.below_7_pct}%) retidos no corte (&lt; 7)
          </span>
        </div>
      </div>

      {/* Selected Discipline Deep Dive Card */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5 bg-white">
        {/* Title and KPIs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                Questões {selectedDiscipline.range}
              </span>
              {selectedDiscipline.below_7_count >= 20 && (
                <span className="text-xs font-bold text-red-900 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-700" />
                  Alta Retenção no Corte Setorial
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
              {selectedDiscipline.name}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Média Geral</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                {selectedDiscipline.average.toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200">
              <span className="text-[10px] uppercase font-bold text-red-800 block mb-0.5">Abaixo de 7</span>
              <p className="text-base sm:text-lg font-bold text-red-900 tabular-nums">
                {selectedDiscipline.below_7_count}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Retenção Única</span>
              <p className="text-base sm:text-lg font-bold text-slate-800 tabular-nums">
                {selectedDiscipline.sole_cause_count} <span className="text-xs font-normal text-slate-500">casos</span>
              </p>
            </div>
          </div>
        </div>

        {/* Informative Guidance Box */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Orientações de Estudo e Foco Temático (CFP / T2)
          </h4>
          <p className="text-xs sm:text-sm text-pretty leading-relaxed text-slate-700">
            {currentInsight.tips}
          </p>
          <div className="mt-2 text-xs text-slate-600 font-medium">
            Tópicos Principais: <span className="font-semibold text-slate-900">{currentInsight.focus}</span>
          </div>
        </div>

        {/* Score Distribution Chart (0 to 10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Distribuição de Acertos dos 689 Alunos (Notas de 0 a 10)
            </h4>
            <span className="text-xs text-slate-400 hidden sm:inline">Corte mínimo: 7 acertos</span>
          </div>

          <div className="grid grid-cols-11 gap-1 sm:gap-2 items-end h-36 pt-4 pb-2 border-b border-slate-200/80">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sc) => {
              const count = selectedDiscipline.distribution[String(sc)] || 0;
              const maxInDist = Math.max(...Object.values(selectedDiscipline.distribution), 1);
              const heightPct = Math.max((count / maxInDist) * 100, count > 0 ? 8 : 2);
              const isFail = sc < 7;

              return (
                <div key={sc} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-500 tabular-nums mb-1">
                    {count}
                  </span>
                  <div
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isFail ? 'bg-red-800' : sc === 10 ? 'bg-slate-900' : 'bg-slate-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${count} alunos tiraram nota ${sc}`}
                  />
                  <span
                    className={`text-xs font-bold mt-1.5 tabular-nums ${
                      isFail ? 'text-red-900' : 'text-slate-800'
                    }`}
                  >
                    {sc}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 mt-2 gap-1">
            <span className="text-red-900 font-semibold">
              Notas de 0 a 6: reprovação no critério individual de disciplina
            </span>
            <span>Notas de 7 a 10: dentro do perfil regulamentar</span>
          </div>
        </div>

        {/* List of candidates with < 7 in this discipline */}
        {failedInThisDisc.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Alunos com nota inferior a 7 nesta disciplina ({failedInThisDisc.length})
              </h4>
              <button
                onClick={() => onFilterTableByDiscipline(selectedDiscipline.code)}
                className="tactile-button text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Filtrar na Tabela Geral</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
              {failedInThisDisc.map((c) => {
                const sc = c.scores[selectedDiscipline.id - 1];
                return (
                  <div
                    key={c.pedido}
                    onClick={() => onSelectCandidate(c)}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 hover:bg-white flex items-center justify-between gap-2 text-xs cursor-pointer transition-colors tactile-button shadow-2xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-900 block leading-snug">
                        {c.nome}
                      </span>
                      <span className="text-[11px] text-slate-500 tabular-nums mt-0.5 block">
                        Total geral: <strong>{c.total} pts</strong> · Pedido #{c.pedido}
                      </span>
                    </div>

                    <span className="tabular-nums font-extrabold text-xs px-2.5 py-1 rounded-md bg-red-800 text-white whitespace-nowrap shadow-xs">
                      {sc}/10
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
