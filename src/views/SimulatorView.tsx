import React, { useState } from 'react';
import type { DisciplineStat } from '../types/provao';
import { calculateRisk, type SimulationResult } from '../lib/riskCalculator';
import confetti from 'canvas-confetti';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface SimulatorViewProps {
  disciplines: DisciplineStat[];
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ disciplines }) => {
  // Default: start with average scores (rounded to integers)
  const defaultScores = disciplines.map((d) => Math.round(d.average));
  const [scores, setScores] = useState<number[]>(defaultScores);

  const result: SimulationResult = calculateRisk(scores, disciplines);

  const handleScoreChange = (index: number, newScore: number) => {
    const clamped = Math.max(0, Math.min(10, newScore));
    const nextScores = [...scores];
    nextScores[index] = clamped;
    setScores(nextScores);

    // If this move makes the user approved, shoot celebration confetti
    const nextResult = calculateRisk(nextScores, disciplines);
    if (nextResult.isApproved && !result.isApproved) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const setPreset = (presetScores: number[]) => {
    setScores(presetScores);
    const nextResult = calculateRisk(presetScores, disciplines);
    if (nextResult.isApproved) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Simulador de Risco do Provão (T2)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Insira suas notas esperadas de 0 a 10 nas 10 disciplinas e veja na hora o veredito oficial da régua CEV/UECE.
          </p>
        </div>

        {/* Real cases presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 mr-1 hidden sm:inline">Testar Casos Reais:</span>

          <button
            onClick={() => setPreset([10, 9, 10, 10, 10, 6, 10, 10, 9, 9])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold cursor-pointer"
            title="Helenário Sero: Fez 93 pontos mas foi reprovado por 1 nota 6 em Homicídios"
          >
            Caso 93 pts Reprovado
          </button>

          <button
            onClick={() => setPreset([10, 9, 6, 10, 9, 9, 10, 10, 9, 8])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold cursor-pointer"
            title="Carlos Aleff: Fez 90 pontos mas foi reprovado por nota 6 em Relatório"
          >
            Caso 90 pts Reprovado
          </button>

          <button
            onClick={() => setPreset([8, 8, 8, 8, 8, 8, 8, 8, 8, 8])}
            className="tactile-button px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold cursor-pointer"
          >
            Aprovado no Limite (80 pts)
          </button>

          <button
            onClick={() => setScores(defaultScores)}
            className="tactile-button p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 cursor-pointer"
            title="Resetar para a média da T1"
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
            className={`glass-panel p-6 rounded-2xl border transition-all duration-300 shadow-md ${
              result.isApproved
                ? 'bg-gradient-to-br from-emerald-50/70 to-white border-emerald-200 ring-2 ring-emerald-500/20'
                : result.hasPassedTotal
                ? 'bg-gradient-to-br from-rose-50/70 to-white border-rose-200 ring-2 ring-rose-500/20'
                : 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Veredito Oficial CEV/UECE
            </span>

            {/* Verdict Status */}
            <div className="mt-2 flex items-center gap-2.5">
              {result.isApproved ? (
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : result.hasPassedTotal ? (
                <div className="p-2 rounded-xl bg-rose-500 text-white shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h3
                  className={`text-lg font-extrabold leading-snug ${
                    result.isApproved
                      ? 'text-emerald-800'
                      : result.hasPassedTotal
                      ? 'text-rose-800'
                      : 'text-amber-800'
                  }`}
                >
                  {result.isApproved
                    ? 'Aprovado nos Perfis!'
                    : result.hasPassedTotal
                    ? 'Reprovado por Disciplina!'
                    : 'Reprovado por Nota Total'}
                </h3>
                <span className="text-xs text-slate-500">
                  {result.isApproved
                    ? 'Cumpre todos os requisitos'
                    : result.hasPassedTotal
                    ? 'Atingiu a nota geral, mas zerou na régua de matéria'
                    : 'Não atingiu os 80 pontos mínimos'}
                </span>
              </div>
            </div>

            {/* Score Big Meter */}
            <div className="mt-5 p-4 rounded-xl bg-white border border-slate-200/90 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pontuação Total Simulada
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  {result.total}
                </span>
                <span className="text-sm font-bold text-slate-400">/100</span>
              </div>

              {/* Progress Bar towards 80 */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    result.isApproved
                      ? 'bg-emerald-500'
                      : result.hasPassedTotal
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(result.total, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Corte Geral: 80 pts</span>
                <span className="tabular-nums font-semibold">
                  {result.hasPassedTotal
                    ? `+${result.total - 80} acima do corte`
                    : `Faltam ${result.pointsNeededTotal} pts`}
                </span>
              </div>
            </div>

            {/* Details about Failing Disciplines */}
            {!result.hasPassedDisciplines && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
                <strong className="font-bold flex items-center gap-1.5 text-rose-800">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Matérias com nota abaixo de 7 ({result.failingDisciplines.length}):
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-rose-800/90">
                  {result.failingDisciplines.map((f) => (
                    <li key={f.code}>
                      <strong>{f.short}</strong>: {f.score}/10 pts (precisa de pelo menos 7)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 10 Disciplines Sliders */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ajuste as 10 Notas (0 a 10)
            </h3>
            <span className="text-xs text-slate-500">Mínimo necessário: 7 em cada</span>
          </div>

          <div className="space-y-3">
            {disciplines.map((d, idx) => {
              const currentScore = scores[idx];
              const isFail = currentScore < 7;

              return (
                <div
                  key={d.code}
                  className={`p-3 rounded-xl border transition-all ${
                    isFail
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-mono text-slate-400 text-[11px]">{d.code}</span>
                      <span className="text-slate-900 truncate font-bold">{d.name}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`tabular-nums font-bold text-xs px-2.5 py-0.5 rounded-md ${
                          isFail
                            ? 'bg-rose-600 text-white'
                            : currentScore === 10
                            ? 'bg-blue-600 text-white'
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
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
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
