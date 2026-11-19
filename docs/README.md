# Documentação do Projeto — Mesmo Barco: Raio-X do Provão

Bem-vindo à documentação do **Mesmo Barco: Raio-X do Provão (PC-CE)**.

Esta documentação foi estruturada para garantir que qualquer desenvolvedor ou agente de IA (como o Antigravity) que clone este repositório consiga compreender integralmente o propósito, a arquitetura, as decisões técnicas e continuar a evolução do projeto sem atritos.

---

## 📚 Índice da Documentação

1. **[Plano de Implementação](PLANO_IMPLEMENTACAO.md)**: Documento mestre de concepção, escopo, requisitos e métricas do Provão.
2. **[Auditoria de Dados](AUDITORIA.md)**: Como os dados do PDF oficial (Comunicado 284/2026-CEV/UECE) foram extraídos, validados e cruzados com o banco do Mesmo Barco.
3. **[Decisões de Arquitetura (ADRs)](adr/)**:
   - [ADR 0001: Stack Tecnológica e Hospedagem](adr/0001-stack-e-hospedagem.md)
   - [ADR 0002: Design System em Tons Claros (Emil + Antigravity)](adr/0002-design-system-tons-claros-emil-antigravity.md)
   - [ADR 0003: Arquitetura de Dados, Regras de Corte e Cruzamento](adr/0003-arquitetura-de-dados-e-cruzamento.md)
   - [ADR 0004: Identidade Visual e Logotipo](adr/0004-identidade-e-marca.md)
   - [ADR 0005: 4 Visões Integradas e Simulador de Risco](adr/0005-quatro-visoes-e-simulador-t2.md)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ (ou Bun / npm)
- Python 3.10+ (para reprocessamento dos dados e execução dos testes de integridade)

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo de desenvolvimento
npm run dev

# 3. Testar a integridade dos dados estatísticos
python3 scripts/tests/test_data_integrity.py

# 4. Fazer build de produção
npm run build
```

---

## 🔄 Fluxo de Atualização dos Dados
Se a CEV/UECE publicar retificações ou se a Turma 2 tiver novos simulados:
1. Adicione o novo documento PDF ou planilha em `data/`.
2. Atualize ou execute o script `scripts/parse_provao.py`.
3. Os arquivos estáticos otimizados serão gerados em `public/data/`.
4. Faça commit e push para `main` — o GitHub Actions atualizará o GitHub Pages automaticamente!
