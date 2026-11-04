# Frontend e editor

## Fluxo atual

`app/page.tsx` renderiza `PageEditor`, um componente cliente. `usePageEditorState` começa com uma cópia de `components/editor/samplePage.ts` e mantém a página em `useState`.

```text
samplePage → estado React → ações do editor → árvore JSON atualizada
                               ↓
                   validação e canvas → renderer → componentes React
```

As alterações não fazem requisições HTTP, não são gravadas no MongoDB e não são persistidas em localStorage. Recarregar reinicia o exemplo. “Salvo localmente” é uma indicação visual sem persistência; os botões do topbar ainda não executam save/preview pela API.

## Responsabilidades

| Arquivo/diretório | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Entrada da tela |
| `components/editor/PageEditor/index.tsx` | Coordenação dos painéis e modal |
| `usePageEditorState.ts` | Estado, seleção, alterações e validação |
| `pageTree.ts` | Busca, inserção, exclusão, duplicação e movimentação |
| `EditorCanvas.tsx` | Visualização e seleção |
| `PropertiesPanel.tsx` e painéis associados | Controles e configurações |
| `components/base/` | Componentes visuais e schemas |
| `renderer/` | Registro, normalização, renderização e validação |
| `types/page.ts` | Contrato TypeScript da página e SEO |

Schemas descrevem campos, opções e suporte a filhos. Os controles usam essas informações. Validação no navegador melhora a experiência, mas não substitui a validação independente do servidor.

## Renderer e contrato

Uma página contém `id`, `name`, `status`, `seo`, `components` e `design` opcional. Cada nó contém `id`, `component`, `props` e filhos opcionais. O registro admite Section, Container, Flex, Grid, Text, Image, Button, Link e Spacer. Títulos são `Text` com `type: "heading"` e `level: "h1"`; não existe `Heading` no contrato atual.

O renderer resolve nomes no registro, normaliza propriedades e renderiza filhos recursivamente. Não importa módulos a partir de entrada do usuário. Design, fontes e responsividade estão em [Componentes](componentes.md).

## Integração pendente

1. Criar telas de cadastro/login usando os endpoints existentes.
2. Manter a sessão Bearer em memória no cliente e tratar expiração/logout; evitar localStorage para tokens.
3. Carregar página autorizada e inicializar o estado com a resposta validada.
4. Salvar com `POST /api/pages` ou `PUT /api/pages/:pageId`, exibindo sucesso/falha reais.
5. Integrar preview, publicação, SEO e analytics à interface.
6. Criar HTML público reutilizando o renderer e gerando metadata no servidor.

Esses itens são trabalho futuro. API access deve ficar separado das alterações da árvore e dos componentes visuais. Não é necessário mudar o contrato JSON para começar.

[Índice](README.md)
