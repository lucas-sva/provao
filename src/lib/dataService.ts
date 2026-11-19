import type { Candidate, ProvaoSummary } from '../types/provao';

let cachedSummary: ProvaoSummary | null = null;
let cachedCandidates: Candidate[] | null = null;

export async function fetchSummary(): Promise<ProvaoSummary> {
  if (cachedSummary) return cachedSummary;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const res = await fetch(`${baseUrl}data/provao_summary.json`);
  if (!res.ok) {
    throw new Error(`Falha ao carregar provao_summary.json (status ${res.status})`);
  }
  cachedSummary = await res.json();
  return cachedSummary!;
}

export async function fetchCandidates(): Promise<Candidate[]> {
  if (cachedCandidates) return cachedCandidates;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const res = await fetch(`${baseUrl}data/candidates.json`);
  if (!res.ok) {
    throw new Error(`Falha ao carregar candidates.json (status ${res.status})`);
  }
  cachedCandidates = await res.json();
  return cachedCandidates!;
}
