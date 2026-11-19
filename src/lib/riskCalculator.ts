import type { DisciplineStat } from '../types/provao';

export interface SimulationResult {
  total: number;
  minScore: number;
  hasPassedTotal: boolean;
  hasPassedDisciplines: boolean;
  isApproved: boolean;
  statusText: 'Alcançou os perfis de aprovação' | 'Não atingiu o perfil de disciplina' | 'Não atingiu o perfil total';
  failingDisciplines: { code: string; short: string; score: number }[];
  pointsNeededTotal: number;
  riskLevel: 'safe' | 'warning' | 'danger';
}

export function calculateRisk(
  scores: number[],
  disciplines: DisciplineStat[]
): SimulationResult {
  const total = scores.reduce((a, b) => a + b, 0);
  const minScore = Math.min(...scores);
  const hasPassedTotal = total >= 80;

  const failingDisciplines: { code: string; short: string; score: number }[] = [];
  disciplines.forEach((d, idx) => {
    const sc = scores[idx] ?? 0;
    if (sc < 7) {
      failingDisciplines.push({
        code: d.code,
        short: d.short,
        score: sc,
      });
    }
  });

  const hasPassedDisciplines = failingDisciplines.length === 0;
  const isApproved = hasPassedTotal && hasPassedDisciplines;

  let statusText: SimulationResult['statusText'];
  let riskLevel: SimulationResult['riskLevel'];

  if (isApproved) {
    statusText = 'Alcançou os perfis de aprovação';
    riskLevel = 'safe';
  } else if (!hasPassedDisciplines && hasPassedTotal) {
    statusText = 'Não atingiu o perfil de disciplina';
    riskLevel = 'danger'; // High danger because the user had 80+ points but still failed!
  } else {
    statusText = 'Não atingiu o perfil total';
    riskLevel = 'danger';
  }

  const pointsNeededTotal = Math.max(0, 80 - total);

  return {
    total,
    minScore,
    hasPassedTotal,
    hasPassedDisciplines,
    isApproved,
    statusText,
    failingDisciplines,
    pointsNeededTotal,
    riskLevel,
  };
}
