# Auditoria dos Dados do Provão T1 — Comunicado 284/2026-CEV/UECE

Este documento registra a proveniência, a metodologia de extração e os testes de integridade aplicados sobre os dados do Provão Final do Curso de Formação Profissional (CFP) para o cargo de Oficial Investigador de Polícia (OIPCE).

---

## 1. Fonte Oficial Primária

- **Documento:** Comunicado Nº 284/2026-CEV/UECE (14 de outubro de 2026).
- **Órgão:** Comissão Executiva do Vestibular da Universidade Estadual do Ceará (CEV/UECE) em conjunto com a Academia Estadual de Segurança Pública do Ceará (AESP/CE).
- **Conteúdo:** Resultado da Avaliação de Verificação de Aprendizagem (aplicada em 27/09/2026) contendo acertos em 10 disciplinas (10 questões cada, totalizando 100 questões) e situação final.
- **Arquivo local:** `data/comunicado2842026cev.pdf`

---

## 2. As 10 Disciplinas Avaliadas

| Cód | Nome Oficial da Disciplina | Questões |
|---|---|---|
| **D1** | Gestão de Expedientes e Procedimentos Cartorários | 01 a 10 |
| **D2** | Gestão de Seção de Investigações e Operações | 11 a 20 |
| **D3** | Relatório de Investigação | 21 a 30 |
| **D4** | Sistemas de Informações Policiais | 31 a 40 |
| **D5** | Preservação da Prova e do Local do Crime | 41 a 50 |
| **D6** | Investigação de Homicídios e Feminicídios | 51 a 60 |
| **D7** | Investigação de Crimes de Tráfico de Drogas | 61 a 70 |
| **D8** | Investigação de Crimes Contra o Patrimônio | 71 a 80 |
| **D9** | Investigação de Crime de Corrupção e Contra a Administração Pública | 81 a 90 |
| **D10** | Extração de Dados de Dispositivos Móveis | 91 a 100 |

---

## 3. Critérios Oficiais de Aprovação

Auditados rigorosamente a partir da classificação dos 689 candidatos:
1. **Perfil de Disciplina:** O candidato deve acertar no mínimo **7 questões (70%)** em **TODAS** as 10 disciplinas. Caso tire 6 ou menos em qualquer disciplina, constará como *"Não atingiu o perfil de disciplina"*.
2. **Perfil Total:** O candidato deve obter no mínimo **80 pontos (80%)** no cômputo geral. Caso obtenha menos de 80 pontos, constará como *"Não atingiu o perfil total"*.
3. **Aprovação Plena:** O candidato atinge a situação *"Alcançou os perfis de aprovação"* exclusivamente se cumprir simultaneamente o Perfil de Disciplina e o Perfil Total.

---

## 4. Estatísticas Centrais Auditadas

- **Total de Alunos Avaliados:** 689
- **Aprovados:** 567 (82,3%)
- **Reprovados no Perfil de Disciplina:** 101 (14,7%)
- **Reprovados no Perfil Total:** 21 (3,1%)
- **Total Geral de Não Aprovados:** 122 (17,7%) — quase 1 a cada 5 alunos!

### As Vilãs do Provão (Disciplinas com mais notas < 7)
1. **D10 — Extração de Dados de Dispositivos Móveis:** 40 alunos caíram nesta disciplina (sendo a causa única em 27 casos). Média: 8,20.
2. **D6 — Investigação de Homicídios e Feminicídios:** 30 alunos caíram nesta disciplina (causa única em 18 casos). Média: 8,55.
3. **D4 — Sistemas de Informações Policiais:** 19 alunos caíram nesta disciplina (causa única em 11 casos). Média: 8,93.
4. **D2 — Gestão de Seção de Investigações e Operações:** 12 alunos caíram (< 7). Média: 8,84.
5. **D5 — Preservação da Prova e do Local do Crime:** 12 alunos caíram (< 7). Média: 8,90.

---

## 5. Cruzamento com o Mesmo Barco (1ª Fase)

- **Taxa de Cruzamento:** 100,0% dos 689 candidatos foram cruzados com sucesso via `pedido` com o arquivo `candidates.json` do [Mesmo Barco](https://github.com/lucas-sva/mesmo-barco).
- **Variáveis Enriquecidas:**
  - `segment` (Ampla, Negro, PcD)
  - `rank_geral` da 1ª fase do concurso
  - Notas da Prova Objetiva e Discursiva
  - Sexo
