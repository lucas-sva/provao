# ADR 0002: Design System em Tons Claros (Emil + Antigravity)

## Status
Aprovado

## Contexto
O usuário especificou que a aplicação deve ser estritamente pautada nas diretrizes de UX e UI das skills `/emil-design-eng`, `/emil`, e `/antigravity-design-expert`, com uma clara preferência por **tons claros** (*light mode*).

## Decisão
Adotar um Design System híbrido de alta fidelidade combinando:
1. **Diretrizes do Emil Kowalski (`/emil`):**
   - **Feedback no Pointer-Down:** `:active { transform: scale(0.97); transition: transform 100ms ease-out; }` em botões, abas e cartões clicáveis.
   - **Ausência de Jitter com Números Tabulares:** Uso obrigatório de `tabular-nums` (`font-variant-numeric: tabular-nums`) em todas as notas, rankings, contagens e percentuais.
   - **Raios Concêntricos:** `outer radius = inner radius + padding` (padrão: `rounded-2xl` no container, `rounded-xl` no card, `rounded-lg` na tag/chip).
   - **Alinhamento Óptico:** Compensação de 1px a 2px em ícones assimétricos.
   - **Legibilidade Tipográfica:** `text-wrap: balance` nos títulos/cabeçalhos e `text-wrap: pretty` nos parágrafos.
   - **Polimento Mobile-Native:** `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, altura `100dvh` e campos de input com tamanho de fonte $\ge 16$px.
   - **Regra de Ouro da Animação:** Animar apenas propriedades GPU (`transform` e `opacity`), nunca animar ações de alta frequência (filtros e abas devem responder instantaneamente).
2. **Diretrizes de Antigravidade (`/antigravity-design-expert` em Tons Claros):**
   - **Leveza Espacial (*Weightlessness*):** Cartões parecem flutuar sobre um canvas suave off-white (`slate-50`/`gray-50`) com sombras difusas e suaves multicamadas (`0 10px 30px -5px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025)`).
   - **Glassmorphism Leitoso:** `backdrop-filter: blur(16px)` com `bg-white/80` e bordas semi-translúcidas `border-slate-200/80` com sutil linha de luz interna.
   - **Paleta Semântica:** Azul Policial Ceará (`#1e40af`) para dados institucionais, Rubi Alerta (`#ef4444`) para notas $\le 6$ e matérias vilãs, Verde Esmeralda (`#059669`) para aprovação.

## Consequências
- A interface transmite alta sofisticação, clareza técnica e autoridade forense.
- Foco em legibilidade em ambientes claros e dispositivos móveis (smartphones dos alunos do CFP).
