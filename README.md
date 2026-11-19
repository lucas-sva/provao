# Mesmo Barco: Raio-X do Provão (PC-CE)

[![Deploy to GitHub Pages](https://github.com/lucas-sva/provao/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/lucas-sva/provao/actions/workflows/deploy-pages.yml)

Dashboard público, auditável e de alta precisão para a análise dos resultados oficiais do **Provão Final da Turma 1 (T1)** do Curso de Formação de Oficial Investigador da Polícia Civil do Estado do Ceará (**Comunicado Nº 284/2026-CEV/UECE**).

Construído sob o espírito comunitário do projeto irmão [Mesmo Barco](https://github.com/lucas-sva/mesmo-barco) por **Lucas Galdino**, este painel tem como missão primordial **gerar choque de realidade e conscientizar a Turma 2 (T2)** sobre a gravidade pedagógica e as armadilhas invisíveis desta avaliação decisiva.

---

## 🚨 O Choque de Realidade: O que a T2 Precisa Saber

A análise matemática dos 689 candidatos avaliados na T1 revela um cenário alarmante:

1. **Quase 1 a cada 5 alunos foi reprovado:** 122 candidatos (17,7%) não atingiram os perfis de aprovação na primeira chamada.
2. **O perigo invisível do corte por disciplina:** Apenas 21 alunos (3,1%) caíram pela pontuação total (&lt; 80 pontos). **101 alunos (14,7%) foram eliminados exclusivamente por tirar menos de 7 em alguma matéria**, mesmo fazendo pontuações totais altíssimas!
   - Aluno com **93 PONTOS** no total foi reprovado por tirar 6 em Homicídios e Feminicídios.
   - Aluno com **90 PONTOS** no total foi reprovado por tirar 6 em Relatório de Investigação.
   - Três alunos com **89 PONTOS** foram eliminados por uma única nota 6.
3. **A Cilada da Matéria Única:** Desses 101 alunos que caíram na régua de disciplina, **79 candidatos (78,2%) foram derrubados por APENAS UMA disciplina**!
4. **O Ranking das Matérias Vilãs:**
   - 🥇 **1º Lugar:** *Extração de Dados de Dispositivos Móveis (Q. 91 a 100)*: derrubou 40 alunos (vilã única em 27 casos). Menor média de todas (8,20).
   - 🥈 **2º Lugar:** *Investigação de Homicídios e Feminicídios (Q. 51 a 60)*: derrubou 30 alunos (vilã única em 18 casos).
   - 🥉 **3º Lugar:** *Sistemas de Informações Policiais (Q. 31 a 40)*: derrubou 19 alunos (vilã única em 11 casos).
5. **Reviravolta na Escolha de Lotação:** A nota do provão provocou saltos e quedas de mais de 100 posições na fila final, decidindo quem fica na capital, na região metropolitana ou vai para o interior distante.

---

## 🖥️ Módulos da Aplicação

1. **Visão Geral & Choque:** KPIs executivos, Termômetro visual das Vilãs do Provão, Histograma de notas com corte em 80 e o impacto real na reclassificação da 1ª fase.
2. **Tabela Densa (Explorador Completo):** Busca instantânea por nome ou número de pedido (via Fuse.js), filtros multicritério por situação e matéria, ordenação por qualquer coluna e exportação dos dados filtrados em CSV.
3. **Raio-X das 10 Disciplinas:** Análise individual detalhada de cada matéria com médias, distribuição de notas de 0 a 10 e orientações pedagógicas exclusivas para a T2.
4. **Simulador de Risco T2 ("E se fosse você?"):** Calculadora tátil interativa onde o aluno simula suas 10 notas e recebe o diagnóstico instantâneo da banca (com botões de 1 clique para testar casos reais de choque da T1).

---

## 🎨 Design System e Rigor Visual

A aplicação foi integralmente desenvolvida em **tons claros (*light mode*)** aplicando os preceitos de:
- **`emil-design-eng` / `emil`:**
  - Micro-interações táteis no pointer-down (`:active { transform: scale(0.97) }`).
  - Prevenção total de jitter layout com números tabulares (`tabular-nums`) em 100% das métricas.
  - Raios de borda concêntricos (`outer = inner + padding`).
  - Balanceamento de texto (`text-wrap: balance` e `text-wrap: pretty`).
  - Polimento mobile-native (`100dvh`, sem highlight de toque, inputs com fonte $\ge$ 16px).
- **`antigravity-design-expert`:**
  - Profundidade espacial e sensação de leveza (*weightlessness*).
  - Cartões em glassmorphism translúcido suave (`backdrop-filter: blur(16px)` com `bg-white/80`).
  - Sombras multicamadas suaves e difusas.
- **`logo-design`:**
  - Logotipo e marca geométrica em SVG vetorial escalável (`logo-mark.svg`), fundindo as linhas náuticas da proa com o feixe diagnóstico do raio-x.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite 8
- **Estilização:** Tailwind CSS v4
- **Busca:** Fuse.js 7 (fuzzy search client-side instantânea)
- **Ícones:** Lucide React (alinhamento óptico)
- **Delight:** Canvas-Confetti (acertos na simulação)
- **Deploy:** GitHub Pages via GitHub Actions (Custo R$ 0)

---

## 📂 Estrutura e Documentação para Próximos Agentes

Toda a documentação técnica para continuidade do trabalho em qualquer máquina está disponível na pasta `docs/`:

- **[docs/PLANO_IMPLEMENTACAO.md](docs/PLANO_IMPLEMENTACAO.md)**: Plano de arquitetura e requisitos originais.
- **[docs/AUDITORIA.md](docs/AUDITORIA.md)**: Como os dados foram auditados, proveniência e regras da CEV/UECE.
- **[docs/adr/](docs/adr/)**: Registros de Decisão Arquitetural (ADRs 0001 a 0005).

### Executar Localmente
```bash
# Instalar dependências
npm install --no-bin-links

# Iniciar servidor local
npm run dev

# Rodar testes de integridade estatística
npm run test:data

# Compilar para produção
npm run build
```

---

*Projeto independente de colega para colega. Não possui vínculo institucional com a Polícia Civil do Ceará, CEV/UECE ou AESP/CE.*
