import React, { useState } from 'react';
import type { DisciplineStat, Candidate } from '../types/provao';
import { BookOpen, ShieldCheck, Skull, ChevronRight } from 'lucide-react';

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

  // Candidates who scored < 7 in this discipline
  const failedInThisDisc = candidates.filter(
    (c) => c.scores[selectedDiscipline.id - 1] < 7
  );

  // Pedagogical advice tailored for each discipline in the CFP
  const disciplineInsights: Record<string, { tips: string; focus: string; riskLevel: 'high' | 'medium' | 'low' }> = {
    D01: {
      tips: 'Atenção aos prazos de remessa de inquéritos, termos circunstanciados (TCO), autos de apreensão e formalidades de numeração e certidões cartorárias.',
      focus: 'Fluxo cartorário, prazos legais e formalização do IP.',
      riskLevel: 'medium',
    },
    D02: {
      tips: 'Caiu bastante na T1 (12 reprovações). Foco no planejamento operacional de mandados de busca e apreensão, hierarquia de comando e segurança orgânica da equipe.',
      focus: 'Briefing, planejamento de incursão e relatórios de missão.',
      riskLevel: 'medium',
    },
    D03: {
      tips: 'Cuidado extremo com a concisão técnica, objetividade, fundamentação probatória e vedação de emissão de juízos subjetivos sem lastro no relatório.',
      focus: 'Estrutura padrão do relatório de investigação policial e nexo causal.',
      riskLevel: 'medium',
    },
    D04: {
      tips: '3ª matéria mais perigosa do provão (19 reprovações). Atenção à parametrização das bases de dados policiais (SIP, Infopol, INFOSEG) e segurança da informação.',
      focus: 'Módulos de consulta, sigilo funcional e integração de dados.',
      riskLevel: 'high',
    },
    D05: {
      tips: 'Cadeia de custódia (art. 158-A a 158-F do CPP). Questões sobre isolamento, fixação, coleta e acondicionamento de vestígios geraram erros sutis.',
      focus: 'Etapas da cadeia de custódia e preservação de cena de crime.',
      riskLevel: 'medium',
    },
    D06: {
      tips: '2ª MAIOR VILÃ DO PROVÃO (30 reprovações, 18 exclusivas!). Atenção redobrada às qualificadoras de feminicídio, exames necroscópicos e primeiras medidas em local de morte violenta.',
      focus: 'Dinâmica de homicídio, feminicídio e confronto de versões de testemunhas.',
      riskLevel: 'high',
    },
    D07: {
      tips: 'Matéria com média mais alta (9.4). Requer atenção aos tipos penais da Lei 11.343/06 (art. 28 vs 33), laudos provisório e definitivo de constatação.',
      focus: 'Diferenciação usuário/traficante e validade do flagrante.',
      riskLevel: 'low',
    },
    D08: {
      tips: 'Média mais alta de todas (9.53). Foco em furto qualificado, roubo majorado, estelionato digital e receptação qualificada.',
      focus: 'Causas de aumento no roubo e estelionato eletrônico.',
      riskLevel: 'low',
    },
    D09: {
      tips: 'Foco nos crimes funcionais (peculato, concussão, corrupção passiva/ativa) e enriquecimento ilícito na nova Lei de Improbidade.',
      focus: 'Tipificação estrita e atos de ofício.',
      riskLevel: 'medium',
    },
    D10: {
      tips: 'A MAIOR VILÃ DO PROVÃO (40 reprovações, derrubou 27 alunos sozinha!). A CEV cobrou minúcias de extração lógica vs física, blindagem de sinal (Gaiola de Faraday), integridade de hash e espelhamento forense.',
      focus: 'Cadeia de custódia de dados móveis, técnicas de extração e software Cellebrite/IPED.',
      riskLevel: 'high',
    },
  };

  const currentInsight = disciplineInsights[selectedDiscipline.code] || {
    tips: 'Estude o plano de aula da AESP e resolva as questões anteriores.',
    focus: 'Conteúdo programático oficial.',
    riskLevel: 'medium',
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Raio-X das 10 Disciplinas Operacionais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Selecione uma disciplina abaixo para analisar a distribuição das notas, armadilhas da prova e alunos afetados.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
            D10 e D06 concentram 57% das reprovações
          </span>
        </div>
      </div>

      {/* 10 Disciplines Navigation Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {disciplines.map((d) => {
          const isSelected = d.code === selectedDisciplineCode;
          const isKiller = d.below_7_count >= 20;

          return (
            <button
              key={d.code}
              onClick={() => setSelectedDisciplineCode(d.code)}
              className={`tactile-button p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md border-blue-600 font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-mono font-bold ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {d.code}
                </span>
                {d.below_7_count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isKiller
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d.below_7_count} rep.
                  </span>
                )}
              </div>
              <p className="text-xs font-bold truncate leading-snug">{d.short}</p>
              <p className={`text-[11px] tabular-nums mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                Média: {d.average.toFixed(1)}/10
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Discipline Deep Dive Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        {/* Title and KPIs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {selectedDiscipline.code} · Questões {selectedDiscipline.range}
              </span>
              {selectedDiscipline.below_7_count >= 20 && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5 text-rose-600" />
                  Matéria Vilã
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{selectedDiscipline.name}</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center flex-shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Média Geral</span>
              <p className="text-lg font-extrabold text-slate-900 tabular-nums">
                {selectedDiscipline.average.toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-600">Reprovações (&lt;7)</span>
              <p className="text-lg font-extrabold text-rose-700 tabular-nums">
                {selectedDiscipline.below_7_count}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Vilã Única</span>
              <p className="text-lg font-extrabold text-slate-800 tabular-nums">
                {selectedDiscipline.sole_cause_count} casos
              </p>
            </div>
          </div>
        </div>

        {/* Pedagogical Guidance Box */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Diretriz Estratégica para os Alunos da T2
          </h4>
          <p className="text-xs sm:text-sm text-pretty leading-relaxed text-blue-950 font-medium">
            {currentInsight.tips}
          </p>
          <div className="mt-2 text-xs text-blue-800/80 font-semibold">
            Tópicos Críticos: <span className="font-normal text-blue-900">{currentInsight.focus}</span>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Distribuição de Notas dos 689 Alunos (0 a 10)
          </h4>
          <div className="grid grid-cols-11 gap-1 sm:gap-2 items-end h-36 pt-4 pb-2 border-b border-slate-100">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sc) => {
              const count = selectedDiscipline.distribution[String(sc)] || 0;
              const maxInDist = Math.max(...Object.values(selectedDiscipline.distribution), 1);
              const heightPct = Math.max((count / maxInDist) * 100, count > 0 ? 8 : 2);
              const isFail = sc < 7;

              return (
                <div key={sc} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 tabular-nums mb-1">
                    {count}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isFail ? 'bg-rose-500' : sc === 10 ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${count} alunos tiraram nota ${sc}`}
                  />
                  <span
                    className={`text-[11px] font-bold mt-1.5 tabular-nums ${
                      isFail ? 'text-rose-600' : 'text-slate-700'
                    }`}
                  >
                    {sc}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span className="text-rose-600 font-semibold">Notas em vermelho (0 a 6) reprovam o aluno</span>
            <span>Notas em cinza/azul (7 a 10) aprovam</span>
          </div>
        </div>

        {/* List of candidates who fell in this discipline */}
        {failedInThisDisc.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alunos da T1 que tiraram &lt; 7 nesta disciplina ({failedInThisDisc.length})
              </h4>
              <button
                onClick={() => onFilterTableByDiscipline(selectedDiscipline.code)}
                className="tactile-button text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos na Tabela Densa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
              {failedInThisDisc.map((c) => {
                const sc = c.scores[selectedDiscipline.id - 1];
                return (
                  <div
                    key={c.pedido}
                    onClick={() => onSelectCandidate(c)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 flex items-center justify-between text-xs cursor-pointer transition-colors tactile-button"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-900 block truncate">{c.nome}</span>
                      <span className="text-[11px] text-slate-400">Total: {c.total} pts</span>
                    </div>
                    <span className="tabular-nums font-extrabold text-xs px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
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
