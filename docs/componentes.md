# Componentes e contrato JSON

## Estrutura

A fonte TypeScript é `types/page.ts`. A página contém `id`, `name`, `status`, `seo`, `components` e `design` opcional. Os componentes são nós declarativos, não HTML ou código React:

```json
{
  "id": "hero",
  "component": "Container",
  "props": {},
  "children": [
    {"id":"titulo","component":"Text","props":{"type":"heading","level":"h1","text":"Meu negócio"},"children":[]}
  ]
}
```

IDs devem ser únicos na página, com letras ASCII, números, underscore ou hífen e até 100 caracteres. O backend limita a árvore a 80 componentes e 8 níveis. Somente componentes que aceitam filhos podem receber uma lista não vazia.

O registro está em `renderer/componentRegistry.tsx`. Componentes atuais: Section, Container, Flex, Grid, Text, Image, Button, Link e Spacer. `Text` cobre parágrafo, título, lista, citação, código e texto inline. Form, Input, Video, componentes públicos reutilizáveis e código personalizado ainda não fazem parte desse contrato.

Cada componente tem um `schema.ts` em `components/base/`. Os schemas definem campos, tipos, valores padrão, limites e opções; `renderer/schemas/componentSchemas.ts` os reúne. Consulte esses arquivos para a lista exata de propriedades de cada componente. O renderer normaliza valores para exibição; o backend rejeita entradas inválidas com seu próprio validator, usando o snapshot em `server/validators/component-contract.json`.

## Aparência de Image e Button

Largura e altura têm valor numérico e unidade separados. Nas dimensões legadas de Image/Button, zero significa tamanho automático. A largura é limitada pelo elemento pai. Image usa por padrão largura 100% e proporção 4:3; proporção automática permite dimensões intrínsecas. Altura explícita prevalece sobre proporção.

Image oferece object-fit, posição do recorte, fundo, estratégia de carregamento, bordas, opacidade, sombras e margens. Mantenha texto alternativo significativo em imagens de conteúdo.

Button preserva as cores primary/secondary até ativar `customColors`. As cores de hover também se aplicam ao foco por teclado; movimento respeita `prefers-reduced-motion`. O botão é um link de navegação. `linkTarget` escolhe `_self` ou `_blank`; `newTab` é fallback legado quando linkTarget não existe. Nova aba usa `noopener noreferrer`.

No canvas, o texto do botão é editado como texto simples e aplicado ao perder foco ou pressionar Enter; cliques não navegam. Texto vazio restaura o rótulo anterior. Fora do modo de edição, o renderer produz links normais; a rota pública HTML ainda não foi implementada.

`fontSizeMobile`/`fontSizeDesktop` de Text e `fontSize` de Button são números em pixels no JSON/controles. A renderização divide por 16 para emitir rem e respeitar o tamanho raiz do navegador. Cores configuráveis aceitam hexadecimal de seis dígitos.

## Estilos responsivos compartilhados

Os nove schemas herdam a lista permitida de `renderer/schemas/responsiveStyles.ts`. `components/base/responsiveStyle.ts` aplica estilos na raiz semântica dos componentes. `components/base/responsive.scss` resolve variáveis CSS com breakpoint padrão de 720px; `app/layout.tsx` carrega o stylesheet.

Os campos usam prefixos mobile/desktop: `mobilePaddingTop: 16`, `desktopPaddingTop: 48`, `mobileBackgroundColor: "#ffffff"`. Campos ausentes preservam padrões; valores desktop ausentes usam mobile. Desativar um campo no painel remove a substituição. Nesses campos compartilhados, zero é explícito, inclusive em largura/altura, diferentemente das dimensões legadas de Image/Button.

Há padding/margin por lado, fundo, cor do texto, bordas, raio, opacidade, dimensões, largura máxima e gap. Margens podem ser negativas; padding não. Gap aplica-se a layouts flex/grid. Cores responsivas do botão preservam o tratamento configurado de hover/foco.

## Design e fontes por página

```json
{"mobileMaxWidth":720,"fonts":[],"defaultFont":"system"}
```

Esse objeto fica em `design`. `mobileMaxWidth` é inteiro de 320 a 1600 (padrão 720). `fonts` aceita até seis famílias únicas do catálogo. `defaultFont` é `system` ou uma família adicionada. Documentos antigos continuam válidos.

`PageRenderer` aceita design e produz CSS com escopo para o breakpoint, links de fontes e a pilha de fontes. Mobile inclui o limite; desktop usa seu complemento, incluindo larguras fracionárias. A navegação do aplicativo editor mantém seus próprios breakpoints.

`renderer/pageDesign.ts` valida, normaliza e constrói URLs de fontes permitidas. `PageDesignStyles.tsx` deriva regras dos schemas compartilhados. Tamanhos de texto e colunas de grid usam a mesma fronteira. Classes de escopo isolam páginas com configurações diferentes.

O catálogo atual tem 12 famílias Google Fonts. O painel permite adicionar/remover e selecionar o padrão. Text, Button e Link aceitam `fontFamily` como `inherit`, `system` ou família do catálogo adicionada à página. Remover uma família redefine suas referências recursivamente para inherit. A interface mostra a configuração; não garante que o download da fonte tenha funcionado. Fontes do sistema são fallback.

O código gera chamadas CSS2 com pesos 400/700 normal/itálico e `display=swap`. Outros pesos numéricos dependem da correspondência feita pelo navegador. Somente famílias adicionadas são carregadas; não são aceitos CSS, URLs de provedor ou scripts arbitrários.

## Alterar ou adicionar componentes

1. Inspecione o contrato e os componentes existentes; preserve documentos atuais.
2. Implemente o componente visual e seu schema com campos permitidos.
3. Atualize tipos, registro e schemas agregados, quando aplicável.
4. Revise a validação independente do servidor e os impactos em SEO, acessibilidade e analytics.
5. Execute `npm run contract:export` e revise o diff; depois `npm run contract:check`.
6. Atualize testes de renderização/validação. Documente mudanças incompatíveis e sua migração, se houver.

`npm test` cobre componentes, design, padrões seguros, remoção de fontes, SSR, contrato e backend. `node tests/page-design-browser.cjs` verifica estilos computados em quatro larguras com Microsoft Edge headless no Windows; usa arquivos e perfis temporários próprios. Execute também typecheck/lint nas mudanças de implementação.

[Índice](README.md) · [Exemplos da API](api.md)
