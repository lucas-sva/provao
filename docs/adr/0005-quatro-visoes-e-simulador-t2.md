# ADR 0005: 4 Visões Integradas e Simulador de Risco T2

## Status
Aprovado

## Contexto
Para atender tanto a quem quer um choque rápido de dados quanto a quem deseja explorar detalhadamente candidatos e matérias, o painel precisa de uma arquitetura modular clara e intuitiva.

## Decisão
Organizar o aplicativo em 4 visões integradas com transição de abas por pílula deslizante fluida:
1. **Visão 1 — Visão Geral & Choque de Realidade:**
   - KPIs de impacto imediato (Aprovados vs Reprovados por Disciplina vs Reprovados no Total).
   - Termômetro das Matérias Vilãs (Extração de Dados Móveis e Homicídios no topo).
   - Histograma de distribuição de notas.
   - Impacto na lotação (Rank da 1ª fase vs Provão).
2. **Visão 2 — Tabela Densa & Explorador:**
   - Busca instantânea difusa (Fuse.js) por nome e pedido.
   - Filtros por situação, matéria crítica (< 7), segmento e faixa de nota.
   - Tabela compacta com badges semânticos e gaveta lateral de raio-x individual do aluno.
   - Exportação em CSV.
3. **Visão 3 — Raio-X por Disciplina:**
   - Detalhamento aprofundado das 10 disciplinas.
   - Médias, desvio, distribuição de notas de 0 a 10 e lista de alunos afetados.
4. **Visão 4 — Simulador de Risco T2:**
   - O usuário insere suas notas esperadas nas 10 matérias.
   - Cálculo instantâneo do veredito (Aprovado, Caiu em Matéria, Caiu no Total).
   - Botões de "Casos Reais" com 1 clique (ex: caso de 93 pontos reprovado por 1 matéria).

## Consequências
- Atende todos os perfis de usuários da T2 (visão rápida, consulta a colegas, estudo das disciplinas e autoavaliação).
