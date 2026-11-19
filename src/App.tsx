import React, { useState, useEffect } from 'react';
import type { Candidate, ProvaoSummary, ActiveTab } from './types/provao';
import { fetchSummary, fetchCandidates } from './lib/dataService';
import { BrandHeader } from './components/BrandHeader';
import { TabNavigation } from './components/TabNavigation';
import { CandidateDrawer } from './components/CandidateDrawer';
import { OverviewView } from './views/OverviewView';
import { TableExplorerView } from './views/TableExplorerView';
import { DisciplinesView } from './views/DisciplinesView';
import { SimulatorView } from './views/SimulatorView';
import { Loader2, AlertCircle, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [summary, setSummary] = useState<ProvaoSummary | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [tableDisciplineFilter, setTableDisciplineFilter] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumData, candData] = await Promise.all([
          fetchSummary(),
          fetchCandidates(),
        ]);
        setSummary(sumData);
        setCandidates(candData);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Falha ao carregar a base de dados do provão.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilterTableByDiscipline = (code: string) => {
    setTableDisciplineFilter(code);
    setActiveTab('explorer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <h2 className="text-lg font-bold text-slate-900">Carregando Raio-X do Provão...</h2>
        <p className="text-xs text-slate-500 mt-1">Auditando os 689 resultados da T1 da PC-CE</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-rose-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Erro ao carregar dados</h2>
          <p className="text-xs text-slate-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="tactile-button mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Sticky Header */}
      <BrandHeader />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          candidateCount={candidates.length}
        />

        {/* View Switcher */}
        {activeTab === 'overview' && (
          <OverviewView
            summary={summary}
            candidates={candidates}
            onSelectCandidate={setSelectedCandidate}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onSelectDiscipline={handleFilterTableByDiscipline}
          />
        )}

        {activeTab === 'explorer' && (
          <TableExplorerView
            candidates={candidates}
            disciplines={summary.disciplines}
            onSelectCandidate={setSelectedCandidate}
            initialDisciplineFilter={tableDisciplineFilter}
          />
        )}

        {activeTab === 'disciplines' && (
          <DisciplinesView
            disciplines={summary.disciplines}
            candidates={candidates}
            onSelectCandidate={setSelectedCandidate}
            onFilterTableByDiscipline={handleFilterTableByDiscipline}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView disciplines={summary.disciplines} />
        )}
      </main>

      {/* Candidate Detailed Radiograph Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        disciplines={summary.disciplines}
        onClose={() => setSelectedCandidate(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Mesmo Barco: Raio-X do Provão</strong> · Ferramenta comunitária auditável criada por Lucas Galdino.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lucas-sva/mesmo-barco"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub Mesmo Barco
            </a>
            <span>·</span>
            <a
              href="https://www.cev.uece.br"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Portal CEV/UECE
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
