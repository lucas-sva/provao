# Plano de Implementação — Mesmo Barco: Raio-X do Provão (PC-CE)

Dashboard de inteligência analítica e conscientização da Turma 2 (T2) sobre os resultados oficiais do Provão Final da Turma 1 (T1) do Curso de Formação de Oficiais Investigadores da Polícia Civil do Ceará (Comunicado Nº 284/2026-CEV/UECE).

---

## 1. Visão Geral e Contexto

O Provão Final da T1 da Polícia Civil do Ceará (CEV/UECE) avaliou 689 alunos em 10 disciplinas operacionais (100 questões). A análise profunda dos dados oficiais revela um **cenário de choque** que a Turma 2 precisa compreender com urgência:

- **122 alunos (17,7% — quase 1 a cada 5)** não alcançaram os perfis de aprovação.
- **O perigo invisível do corte por disciplina:** Apenas 21 alunos (3,1%) reprovaram pela pontuação global (< 80 pontos). **101 alunos (14,7%) foram reprovados exclusivamente pela régua mínima de 7 pontos por matéria**, mesmo com notas gerais altíssimas (alunos com 93, 90 e 89 pontos foram reprovados por tirar nota 6 em uma única matéria).
- **79 dos 101 reprovados (78,2%)** caíram por causa de **apenas uma disciplina vilã**.
- **As matérias vilãs identificadas:** *Extração de Dados de Dispositivos Móveis* (40 reprovações, sendo a vilã única de 27 candidatos) e *Investigação de Homicídios e Feminicídios* (30 reprovações, vilã única em 18 casos).
- **Impacto na Lotação:** Cruzando 100% dos dados com o histórico da 1ª fase do concurso (`candidates.json` do Mesmo Barco), a nota do provão provocou uma reorganização massiva na classificação final, determinando quem escolhe as melhores delegacias e cidades.

Este projeto transpõe o espírito comunitário e transparente do [Mesmo Barco](https://github.com/lucas-sva/mesmo-barco) para uma aplicação analítica de alto padrão, aplicando rigorosamente as diretrizes das skills de design solicitadas em **tons claros** (*light mode*):
- **`/emil-design-eng` e `/emil`**: Micro-interações táteis no pointer-down (`:active { transform: scale(0.97) }`), ausência de jitter através de `tabular-nums` em todas as métricas, raios de borda concêntricos, alinhamento óptico, textos balanceados (`text-wrap: balance` e `text-wrap: pretty`), e performance pura no compositor GPU.
- **`/antigravity-design-expert`**: Profundidade espacial e sensação de leveza (*weightlessness*), cartões translúcidos com glassmorphism acetinado em tons claros (`backdrop-filter: blur(16px)` sobre canvas texturizado suave), sombras difusas em camadas e animações de entrada fluidas.
- **`/logo-design`**: Marca e logotipo em SVG geométrico, integrando as linhas náuticas do "Mesmo Barco" com o prisma/feixe de luz do "Raio-X", otimizado para legibilidade em 16px (favicon), 32px e apresentações.

---

## 2. Decisões Acordadas no /grill-me

| Dimensão | Decisão Aprovada |
|---|---|
| **Público & Foco** | Painel Analítico Completo & Exploratório: ênfase em filtros avançados, histogramas de distribuição, médias, busca instantânea por nome/pedido e visualização em tabela densa com exportação. |
| **Identidade da Marca** | **"Mesmo Barco: Raio-X do Provão"** — integrando a autoridade e o carinho da comunidade do Mesmo Barco. |
| **Navegação** | **4 Visões Estratégicas Integradas**: (1) Visão Geral & Choque, (2) Tabela Densa & Explorador, (3) Raio-X das 10 Disciplinas, (4) Simulador de Risco T2. |
| **Estética Visual** | **Tons Claros (*Light Mode*) Premium**: Superfícies off-white/slate suave, vidro leitoso translúcido, acentos em Azul Policial e Alertas Âmbar/Rubi, obedecendo às regras de concentricidade, optical alignment e micro-interações do Emil. |
| **Transparência dos Dados** | **Modo Transparente Completo**: Nomes e pedidos públicos exibidos abertamente para busca direta e auditoria fidedigna (padrão CEV/UECE e Mesmo Barco). |
| **Hospedagem & Deploy** | Projeto autônomo completo em `/mnt/h/Meu Drive/provao` com base path `/provao/` configurado para GitHub Pages via GitHub Actions. |

---

## 3. Arquitetura do Sistema e Estrutura de Arquivos

```
/mnt/h/Meu Drive/provao/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # Pipeline CI/CD automático para GitHub Pages
├── data/
│   ├── comunicado2842026cev.pdf      # PDF oficial baixado da CEV/UECE
│   ├── parsed_provao.json            # Base intermediária de candidatos do provão
│   └── merged_candidates.json        # Cruzamento 100% com dados da 1ª fase (Mesmo Barco)
├── scripts/
│   ├── parse_provao.py               # Extrator e auditor dos dados do PDF
│   └── tests/
│       └── test_data_integrity.py    # Testes unitários de validação estatística
├── public/
│   ├── data/
│   │   ├── provao_summary.json       # Agregações, médias, rankings de vilãs e histogramas
│   │   └── candidates.json           # 689 registros enriquecidos para busca no frontend
│   ├── favicon.svg                   # Marca geométrica SVG criada via /logo-design
│   ├── favicon.ico
│   └── apple-touch-icon.png
├── src/
│   ├── assets/
│   │   └── brand/
│   │       ├── logo-mark.svg         # Símbolo geométrico isolado
│   │       └── logo-horizontal.svg   # Lockup tipográfico completo
│   ├── components/
│   │   ├── BrandHeader.tsx           # Barra superior com logo, status da base e navegação
│   │   ├── StatCard.tsx              # Cartão glassmorphic com tabular-nums e microinteração
│   │   ├── TabNavigation.tsx         # Navegação fluida entre as 4 visões com pílula deslizante
│   │   ├── CandidateDrawer.tsx       # Gaveta lateral detalhando o raio-x completo do aluno
│   │   ├── HistogramChart.tsx        # Gráfico SVG leve de distribuição das notas totais
│   │   ├── VillainDisciplineBar.tsx  # Termômetro visual das disciplinas que mais reprovaram
│   │   ├── ScatterPlotLotacao.tsx    # Visualização do impacto: Rank 1ª fase vs Provão
│   │   └── MetricBadge.tsx           # Pílula semântica (Aprovado, Caiu em Matéria, Caiu no Total)
│   ├── views/
│   │   ├── OverviewView.tsx          # Visão 1: KPIs, Choque de Realidade e Gráficos Globais
│   │   ├── TableExplorerView.tsx     # Visão 2: Tabela densa, busca Fuse.js, multi-filtros e CSV
│   │   ├── DisciplinesView.tsx       # Visão 3: Raio-X profundo das 10 matérias
│   │   └── SimulatorView.tsx         # Visão 4: Calculadora de Risco T2 ("E se fosse você?")
│   ├── lib/
│   │   ├── dataService.ts            # Carregamento e cache dos dados JSON
│   │   ├── searchEngine.ts           # Motor de busca difusa Fuse.js (nome e pedido)
│   │   └── riskCalculator.ts         # Regras oficiais de corte e cálculo da simulação
│   ├── types/
│   │   └── provao.ts                 # Tipagens TypeScript estritas para disciplinas e alunos
│   ├── App.tsx                       # Orquestrador de estado e layout
│   ├── index.css                     # Diretivas Tailwind v4, fontes, safe areas e resets do Emil
│   └── main.tsx                      # Ponto de entrada React 19
├── package.json
├── vite.config.ts                    # Base path '/provao/', plugins React e Tailwind
├── tsconfig.json
└── README.md
```
