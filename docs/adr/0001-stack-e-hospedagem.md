# ADR 0001: Escolha da Stack Tecnológica e Hospedagem

## Status
Aprovado

## Contexto
O projeto tem como objetivo conscientizar os alunos da Turma 2 (T2) da Polícia Civil do Ceará (PC-CE) através da análise profunda dos dados do Provão Final da Turma 1 (T1). O criador já mantém o projeto comunitário de sucesso [Mesmo Barco](https://github.com/lucas-sva/mesmo-barco) com foco na fila do concurso, que opera com custo R$ 0,00 no GitHub Pages.

## Decisão
1. **Stack Central:**
   - **Runtime & Bundler:** Vite 8+ com suporte a ESM e build ultra veloz.
   - **Framework:** React 19 + TypeScript para segurança de tipos estrita.
   - **Estilização:** Tailwind CSS v4 para utilities atômicas e performance sem CSS runtime.
   - **Motor de Busca:** Fuse.js 7+ para busca difusa (*fuzzy search*) client-side instantânea por nome e número de pedido.
   - **Ícones:** Lucide React (vetores limpos, consistentes e com alinhamento óptico).
2. **Hospedagem & Deploy:**
   - Deploy estático automatizado via GitHub Actions para o **GitHub Pages**.
   - Base path configurado como `/provao/` para suportar o repositório `https://lucas-sva.github.io/provao/`.
3. **Pipeline de Dados:**
   - Script Python reprodutível em `scripts/parse_provao.py` gerando artefatos JSON estáticos pré-computados em `public/data/`, garantindo carregamento instantâneo no navegador.

## Consequências
- Custo de infraestrutura zero (R$ 0).
- Máxima transparência e facilidade de auditoria pública.
- Alta velocidade de carregamento (SPA estática pré-compilada sem dependência de backend em tempo real).
