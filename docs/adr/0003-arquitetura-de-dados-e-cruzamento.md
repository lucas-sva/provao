# ADR 0003: Arquitetura de Dados, Regras de Corte e Cruzamento com a 1ª Fase

## Status
Aprovado

## Contexto
O Comunicado Nº 284/2026-CEV/UECE divulgou os resultados individuais do Provão em formato PDF (689 candidatos). Para potencializar a conscientização da Turma 2, é essencial auditar as regras reais da banca e cruzar esses dados com o histórico da primeira fase do concurso.

## Decisão
1. **Regras Oficiais de Corte Auditadas nos Dados:**
   - **Perfil de Disciplina:** O aluno deve acertar no mínimo **7 questões (70%)** em cada uma das 10 disciplinas.
   - **Perfil Total:** O aluno deve obter no mínimo **80 pontos (80%)** no cômputo geral.
   - Constatação: 101 alunos (14,7%) caíram pelo corte de disciplina e apenas 21 (3,1%) pelo corte total.
2. **Cruzamento Integral (100% de Match):**
   - Cruzamento pelo número de `pedido` com o arquivo `candidates.json` do Mesmo Barco.
   - Enriquecimento com: Classificação da 1ª fase (`rank_geral`), Notas da Prova Objetiva e Discursiva, Segmento (Ampla Concorrência, Cotas de Negros, PcD) e Sexo.
3. **Análise de Reclassificação e Lotação:**
   - A nota do Provão é determinante para a escolha das delegacias (lotação). O dashboard demonstrará graficamente como alunos que estavam muito bem posicionados na 1ª fase perderam posições por relaxarem no provão, enquanto alunos focados subiram dezenas de posições.

## Consequências
- A base é 100% fidedigna, validada por testes estatísticos unitários.
- A narrativa para a T2 ganha força irresistível: *"O provão pode custar a sua vaga ou a delegacia dos seus sonhos."*
