import React, { useState } from 'react';
import type { DisciplineStat } from '../types/provao';
import { calculateRisk, type SimulationResult } from '../lib/riskCalculator';
import confetti from 'canvas-confetti';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Info,
} from 'lucide-react';

interface SimulatorViewProps {
  disciplines: DisciplineStat[];
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ disciplines }) => {
  const defaultScores = disciplines.map((d) => Math.round(d.average));
  const [scores, setScores] = useState<number[]>(defaultScores);

  const result: SimulationResult = calculateRisk(scores, disciplines);

  const handleScoreChange = (index: number, newScore: number) => {
    const clamped = Math.max(0, Math.min(10, newScore));
    const nextScores = [...scores];
    nextScores[index] = clamped;
    setScores(nextScores);

    const nextResult = calculateRisk(nextScores, disciplines);
    if (nextResult.isApproved && !result.isApproved) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const setPreset = (presetScores: number[]) => {
    setScores(presetScores);
    const nextResult = calculateRisk(presetScores, disciplines);
    if (nextResult.isApproved) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              <Calculator className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Simulador de Critérios de Aprovação (T2)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Insira notas estimadas de 0 a 10 nas 10 disciplinas para conferir o atendimento às regras do edital (mínimo 7 por matéria e 80 globais).
          </p>
        </div>

        {/* Real cases presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-medium text-slate-500 mr-1 hidden sm:inline">Exemplos da T1:</span>

          <button
            onClick={() => setPreset([10, 9, 10, 10, 10, 6, 10, 10, 9, 9])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium cursor-pointer"
            title="Helenário Sero: 93 pontos globais com nota 6 em Homicídios"
          >
            Exemplo 93 pts (Retido em D06)
          </button>

          <button
            onClick={() => setPreset([10, 9, 6, 10, 9, 9, 10, 10, 9, 8])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium cursor-pointer"
            title="Carlos Aleff: 90 pontos globais com nota 6 em Relatório"
          >
            Exemplo 90 pts (Retido em D03)
          </button>

          <button
            onClick={() => setPreset([8, 8, 8, 8, 8, 8, 8, 8, 8, 8])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-medium cursor-pointer"
          >
            Corte Exato (80 pts)
          </button>

          <button
            onClick={() => setScores(defaultScores)}
            className="tactile-button p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 cursor-pointer"
            title="Resetar para a média da turma"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Result Banner & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Verdict Card */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className={`glass-panel p-5 sm:p-6 rounded-xl border transition-all duration-200 shadow-xs bg-white ${
              result.isApproved
                ? 'border-emerald-200 ring-1 ring-emerald-500/20'
                : result.hasPassedTotal
                ? 'border-red-200 ring-1 ring-red-500/20'
                : 'border-amber-200 ring-1 ring-amber-500/20'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Veredito Conforme Edital
            </span>

            {/* Verdict Status */}
            <div className="mt-2 flex items-center gap-2.5">
              {result.isApproved ? (
                <div className="p-2 rounded-lg bg-emerald-700 text-white shadow-2xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : result.hasPassedTotal ? (
                <div className="p-2 rounded-lg bg-red-800 text-white shadow-2xs">
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-amber-700 text-white shadow-2xs">
                  <XCircle className="w-5 h-5" />
                </div>
              )}

              <div>
                <h3
                  className={`text-base font-bold leading-snug ${
                    result.isApproved
                      ? 'text-emerald-900'
                      : result.hasPassedTotal
                      ? 'text-red-950'
                      : 'text-amber-950'
                  }`}
                >
                  {result.isApproved
                    ? 'Aprovado nos Perfis'
                    : result.hasPassedTotal
                    ? 'Retido no Perfil de Disciplina'
                    : 'Retido no Perfil Total'}
                </h3>
                <span className="text-xs text-slate-500">
                  {result.isApproved
                    ? 'Atende simultaneamente a ambos os requisitos'
                    : result.hasPassedTotal
                    ? 'Atingiu a nota geral, mas obteve nota < 7 em matéria'
                    : 'Pontuação geral inferior a 80 pontos'}
                </span>
              </div>
            </div>

            {/* Score Big Meter */}
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pontuação Total Simulada
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-slate-900 tabular-nums">
                  {result.total}
                </span>
                <span className="text-sm font-medium text-slate-400">/100</span>
              </div>

              {/* Progress Bar towards 80 */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    result.isApproved
                      ? 'bg-emerald-700'
                      : result.hasPassedTotal
                      ? 'bg-red-800'
                      : 'bg-amber-700'
                  }`}
                  style={{ width: `${Math.min(result.total, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Corte Geral: 80 pts</span>
                <span className="tabular-nums font-medium">
                  {result.hasPassedTotal
                    ? `+${result.total - 80} acima do corte`
                    : `Déficit de ${result.pointsNeededTotal} pts`}
                </span>
              </div>
            </div>

            {/* Details about Failing Disciplines */}
            {!result.hasPassedDisciplines && (
              <div className="mt-3.5 p-3 rounded-lg bg-red-50/70 border border-red-200 text-xs text-red-950 space-y-1">
                <strong className="font-semibold flex items-center gap-1.5 text-red-900">
                  <Info className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                  Disciplinas com pontuação inferior a 7 ({result.failingDisciplines.length}):
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-red-900/90 pl-1">
                  {result.failingDisciplines.map((f) => (
                    <li key={f.code}>
                      <strong>{f.short}</strong>: {f.score}/10 pts (mínimo exigido: 7)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 10 Disciplines Sliders */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ajuste de Pontuação por Disciplina (0 a 10)
            </h3>
            <span className="text-xs text-slate-500">Exigência: $\ge$ 7 pontos em cada</span>
          </div>

          <div className="space-y-2.5">
            {disciplines.map((d, idx) => {
              const currentScore = scores[idx];
              const isFail = currentScore < 7;

              return (
                <div
                  key={d.code}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isFail
                      ? 'bg-red-50/30 border-red-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-mono text-slate-400 text-[11px]">{d.code}</span>
                      <span className="text-slate-800 truncate font-semibold">{d.name}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`tabular-nums font-bold text-xs px-2 py-0.2 rounded ${
                          isFail
                            ? 'bg-red-800 text-white'
                            : currentScore === 10
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {currentScore} pts
                      </span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={currentScore}
                      onChange={(e) => handleScoreChange(idx, parseInt(e.target.value, 10))}
                      className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleScoreChange(idx, currentScore - 1)}
                        className="tactile-button w-6 h-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer select-none"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreChange(idx, currentScore + 1)}
                        className="tactile-button w-6 h-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
