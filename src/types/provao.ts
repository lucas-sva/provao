export interface Candidate {
  pedido: number;
  nome: string;
  scores: number[]; // 10 scores
  total: number;
  situacao: 'Alcançou os perfis de aprovação' | 'Não atingiu o perfil de disciplina' | 'Não atingiu o perfil total';
  min_disc: number;
  failing_disciplines: string[]; // Codes e.g. ["D10", "D06"]
  num_failing_disciplines: number;
  segment: 'Ampla' | 'Negro' | 'PCD' | string;
  rank_1a_fase: number | null;
  rank_concurso_geral?: number | null;
  rank_pcd?: number | null;
  rank_negro?: number | null;
  t1_seat_type?: string | null;
  birth_date?: string | null;
  nota_objetiva_1a: number | null;
  nota_discursiva_1a: number | null;
  nota_total_1a: number | null;
  sexo: 'M' | 'F' | null;
  rank_provao: number;
  rank_delta: number; // Positive means climbed up, negative means fell
}

export interface DisciplineStat {
  id: number;
  code: string;
  name: string;
  short: string;
  range: string;
  average: number;
  max: number;
  min: number;
  below_7_count: number;
  below_7_pct: number;
  below_6_count: number;
  sole_cause_count: number;
  distribution: Record<string, number>; // "10": 450, "9": 120, etc.
}

export interface HistogramBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  approved: number;
  failed_disc: number;
  failed_total: number;
}

export interface TopFailedScore {
  nome: string;
  total: number;
  pedido: number;
  failing_disciplines: string[];
}

export interface ProvaoSummary {
  metadata: {
    source: string;
    exam_date: string;
    total_candidates: number;
    disciplines_count: number;
    questions_count: number;
  };
  kpis: {
    total_evaluated: number;
    approved_count: number;
    approved_pct: number;
    failed_disc_count: number;
    failed_disc_pct: number;
    failed_total_count: number;
    failed_total_pct: number;
    total_failed_count: number;
    total_failed_pct: number;
    avg_score: number;
    median_score: number;
    max_score: number;
    min_score: number;
    sole_discipline_fail_count: number;
    sole_discipline_fail_pct: number;
    two_discipline_fail_count: number;
  };
  disciplines: DisciplineStat[];
  villain_ranking: DisciplineStat[];
  histogram: HistogramBucket[];
  top_failed_scores: TopFailedScore[];
}

export type ActiveTab = 'overview' | 'explorer' | 'disciplines';
