import type { ComponentName, PageComponent } from "@/types/page";
import type { ComponentCategory, ComponentSchema } from "@/renderer/schemas/schemaTypes";
import { componentSchemas, creatableComponents } from "@/renderer/schemas/componentSchemas";
import { createDefaultProps } from "@/renderer/validation";
import { createEditorComponent } from "./pageTree";

export type AtomicCategoryInfo = {
  id: ComponentCategory;
  label: string;
  singularLabel: string;
  description: string;
};

export type CatalogItem = {
  id: string;
  label: string;
  description: string;
  category: ComponentCategory;
  componentName: ComponentName;
  isPreset?: boolean;
  badge?: string;
  createNode: () => PageComponent;
};

export const ATOMIC_CATEGORIES: AtomicCategoryInfo[] = [
  {
    id: "atom",
    label: "Átomos",
    singularLabel: "Átomo",
    description: "Elementos básicos e indivisíveis como textos, botões, imagens, links e espaçadores."
  },
  {
    id: "molecule",
    label: "Moléculas",
    singularLabel: "Molécula",
    description: "Agrupadores de layout e blocos combinados prontos para estruturar conteúdos."
  },
  {
    id: "organism",
    label: "Organismos",
    singularLabel: "Organismo",
    description: "Seções completas e estruturas autônomas para montar a página rapidamente."
  }
];

let nodeSequence = 0;

function nextComponentId(prefix: string): string {
  nodeSequence += 1;
  return `${prefix.toLowerCase()}-${Date.now()}-${nodeSequence}`;
}

export function createNodeWithProps(
  component: ComponentName,
  customProps: Record<string, unknown> = {},
  children?: PageComponent[],
  idPrefix?: string
): PageComponent {
  const schema = componentSchemas[component];
  return {
    id: nextComponentId(idPrefix ?? component),
    component,
    props: {
      ...createDefaultProps(component),
      ...customProps
    },
    children: schema.acceptsChildren ? (children ?? []) : undefined
  };
}

function getSchemaCategory(schema: ComponentSchema): ComponentCategory {
  if (schema.category) {
    return schema.category;
  }
  if (!schema.acceptsChildren) {
    return "atom";
  }
  if (schema.component === "Section" || schema.component === "Navbar") {
    return "organism";
  }
  return "molecule";
}

const baseCatalogItems: CatalogItem[] = creatableComponents.map((schema) => {
  const category = getSchemaCategory(schema);
  return {
    id: `base-${schema.component.toLowerCase()}`,
    label: schema.label,
    description: schema.description ?? "Componente configurável da página.",
    category,
    componentName: schema.component,
    isPreset: false,
    badge: schema.component === "Form" ? "WhatsApp" : category === "atom" ? "Base" : "Layout",
    createNode: () => createEditorComponent(schema.component)
  };
});

const presetCatalogItems: CatalogItem[] = [
  {
    id: "preset-molecule-cta-block",
    label: "Bloco de Chamada (Texto + Botão)",
    description: "Combinação pronta de título, parágrafo explicativo e botão de ação.",
    category: "molecule",
    componentName: "Flex",
    isPreset: true,
    badge: "Pronto",
    createNode: () =>
      createNodeWithProps(
        "Flex",
        { direction: "column", gap: 14, align: "flex-start" },
        [
          createNodeWithProps(
            "Text",
            {
              type: "heading",
              level: "h3",
              text: "Destaque o diferencial do seu negócio",
              color: "#111827",
              fontSizeMobile: 24,
              fontSizeDesktop: 28,
              useDesktopFontSize: true
            },
            undefined,
            "cta-heading"
          ),
          createNodeWithProps(
            "Text",
            {
              type: "paragraph",
              text: "Explique em poucas palavras como seu produto ou serviço resolve o problema do cliente.",
              color: "#4b5563",
              fontSizeMobile: 16,
              fontSizeDesktop: 16
            },
            undefined,
            "cta-text"
          ),
          createNodeWithProps(
            "Button",
            {
              text: "Quero saber mais",
              href: "#contato",
              variant: "primary"
            },
            undefined,
            "cta-button"
          )
        ],
        "cta-block"
      )
  },
  {
    id: "preset-molecule-feature-card",
    label: "Card de Benefício / Serviço",
    description: "Bloco vertical com título, descrição curta e link de saiba mais.",
    category: "molecule",
    componentName: "Flex",
    isPreset: true,
    badge: "Pronto",
    createNode: () =>
      createNodeWithProps(
        "Flex",
        {
          direction: "column",
          gap: 10,
          align: "flex-start",
          mobilePaddingTop: 20,
          mobilePaddingRight: 20,
          mobilePaddingBottom: 20,
          mobilePaddingLeft: 20,
          mobileBackgroundColor: "#f8fafc",
          mobileBorderRadius: 12
        },
        [
          createNodeWithProps(
            "Text",
            {
              type: "heading",
              level: "h3",
              text: "Atendimento Rápido",
              color: "#111827",
              fontSizeMobile: 20,
              fontSizeDesktop: 22
            },
            undefined,
            "card-title"
          ),
          createNodeWithProps(
            "Text",
            {
              type: "paragraph",
              text: "Acompanhe cada etapa com suporte dedicado para garantir o melhor resultado.",
              color: "#4b5563",
              fontSizeMobile: 15,
              fontSizeDesktop: 15
            },
            undefined,
            "card-desc"
          ),
          createNodeWithProps(
            "Link",
            {
              text: "Conhecer detalhes →",
              href: "#contato"
            },
            undefined,
            "card-link"
          )
        ],
        "feature-card"
      )
  },
  {
    id: "preset-molecule-image-card",
    label: "Card com Imagem e Texto",
    description: "Bloco visual com foto no topo, título de destaque e legenda descritiva.",
    category: "molecule",
    componentName: "Flex",
    isPreset: true,
    badge: "Pronto",
    createNode: () =>
      createNodeWithProps(
        "Flex",
        { direction: "column", gap: 12, align: "stretch" },
        [
          createNodeWithProps(
            "Image",
            {
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
              alt: "Equipe trabalhando em projeto",
              aspectRatio: "16 / 9",
              borderRadius: 10
            },
            undefined,
            "media-image"
          ),
          createNodeWithProps(
            "Text",
            {
              type: "heading",
              level: "h3",
              text: "Solução sob medida",
              color: "#111827",
              fontSizeMobile: 20,
              fontSizeDesktop: 22
            },
            undefined,
            "media-title"
          ),
          createNodeWithProps(
            "Text",
            {
              type: "paragraph",
              text: "Projetos planejados para atrair visitantes e converter em clientes reais.",
              color: "#4b5563",
              fontSizeMobile: 15,
              fontSizeDesktop: 15
            },
            undefined,
            "media-text"
          )
        ],
        "image-card"
      )
  },
  {
    id: "preset-organism-hero",
    label: "Seção Hero (Principal)",
    description: "Seção de abertura em 2 colunas com título principal, descrição, botão CTA e imagem.",
    category: "organism",
    componentName: "Section",
    isPreset: true,
    badge: "Seção Pronta",
    createNode: () =>
      createNodeWithProps(
        "Section",
        { background: "#f8fbfa", paddingY: 72 },
        [
          createNodeWithProps(
            "Container",
            { maxWidth: 1120, align: "left" },
            [
              createNodeWithProps(
                "Grid",
                { columns: 2, gap: 32 },
                [
                  createNodeWithProps(
                    "Flex",
                    { direction: "column", gap: 16, align: "flex-start" },
                    [
                      createNodeWithProps(
                        "Text",
                        {
                          type: "heading",
                          level: "h2",
                          text: "Transforme visitantes em clientes todos os dias",
                          color: "#111827",
                          useDesktopFontSize: true,
                          fontSizeMobile: 32,
                          fontSizeDesktop: 44
                        },
                        undefined,
                        "hero-heading"
                      ),
                      createNodeWithProps(
                        "Text",
                        {
                          type: "paragraph",
                          text: "Apresente sua oferta com clareza, destaque seus benefícios e facilite o contato imediato.",
                          color: "#4b5563",
                          fontSizeMobile: 17,
                          fontSizeDesktop: 18
                        },
                        undefined,
                        "hero-subtitle"
                      ),
                      createNodeWithProps(
                        "Button",
                        {
                          text: "Solicitar orçamento",
                          href: "#contato",
                          variant: "primary"
                        },
                        undefined,
                        "hero-cta"
                      )
                    ],
                    "hero-copy"
                  ),
                  createNodeWithProps(
                    "Image",
                    {
                      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
                      alt: "Apresentação de resultados para clientes",
                      aspectRatio: "4 / 3",
                      borderRadius: 12
                    },
                    undefined,
                    "hero-image"
                  )
                ],
                "hero-grid"
              )
            ],
            "hero-container"
          )
        ],
        "hero-section"
      )
  },
  {
    id: "preset-organism-benefits",
    label: "Seção de Benefícios (3 Colunas)",
    description: "Seção completa com cabeçalho centralizado e grade de 3 diferenciais.",
    category: "organism",
    componentName: "Section",
    isPreset: true,
    badge: "Seção Pronta",
    createNode: () =>
      createNodeWithProps(
        "Section",
        { background: "#ffffff", paddingY: 64 },
        [
          createNodeWithProps(
            "Container",
            { maxWidth: 1120, align: "center" },
            [
              createNodeWithProps(
                "Text",
                {
                  type: "heading",
                  level: "h2",
                  text: "Por que escolher nossa empresa?",
                  color: "#111827",
                  align: "center",
                  fontSizeMobile: 28,
                  fontSizeDesktop: 34,
                  useDesktopFontSize: true
                },
                undefined,
                "benefits-heading"
              ),
              createNodeWithProps("Spacer", { height: 24 }, undefined, "benefits-spacer"),
              createNodeWithProps(
                "Grid",
                { columns: 3, gap: 24 },
                [
                  createNodeWithProps(
                    "Flex",
                    { direction: "column", gap: 8, align: "flex-start" },
                    [
                      createNodeWithProps(
                        "Text",
                        { type: "heading", level: "h3", text: "1. Qualidade Garantida", color: "#111827", fontSizeMobile: 20 },
                        undefined,
                        "benefit-1-title"
                      ),
                      createNodeWithProps(
                        "Text",
                        { type: "paragraph", text: "Processos validados para entregar excelência em cada atendimento.", color: "#4b5563", fontSizeMobile: 15 },
                        undefined,
                        "benefit-1-text"
                      )
                    ],
                    "benefit-1"
                  ),
                  createNodeWithProps(
                    "Flex",
                    { direction: "column", gap: 8, align: "flex-start" },
                    [
                      createNodeWithProps(
                        "Text",
                        { type: "heading", level: "h3", text: "2. Agilidade na Entrega", color: "#111827", fontSizeMobile: 20 },
                        undefined,
                        "benefit-2-title"
                      ),
                      createNodeWithProps(
                        "Text",
                        { type: "paragraph", text: "Prazos claros e acompanhamento próximo do início ao fim.", color: "#4b5563", fontSizeMobile: 15 },
                        undefined,
                        "benefit-2-text"
                      )
                    ],
                    "benefit-2"
                  ),
                  createNodeWithProps(
                    "Flex",
                    { direction: "column", gap: 8, align: "flex-start" },
                    [
                      createNodeWithProps(
                        "Text",
                        { type: "heading", level: "h3", text: "3. Suporte Dedicado", color: "#111827", fontSizeMobile: 20 },
                        undefined,
                        "benefit-3-title"
                      ),
                      createNodeWithProps(
                        "Text",
                        { type: "paragraph", text: "Tire dúvidas rapidamente com nossa equipe sempre disponível.", color: "#4b5563", fontSizeMobile: 15 },
                        undefined,
                        "benefit-3-text"
                      )
                    ],
                    "benefit-3"
                  )
                ],
                "benefits-grid"
              )
            ],
            "benefits-container"
          )
        ],
        "benefits-section"
      )
  },
  {
    id: "preset-organism-cta-banner",
    label: "Seção de Chamada Final (CTA)",
    description: "Faixa de conversão centralizada com título persuasivo e botão de contato.",
    category: "organism",
    componentName: "Section",
    isPreset: true,
    badge: "Seção Pronta",
    createNode: () =>
      createNodeWithProps(
        "Section",
        { background: "#eff6ff", paddingY: 64 },
        [
          createNodeWithProps(
            "Container",
            { maxWidth: 860, align: "center" },
            [
              createNodeWithProps(
                "Flex",
                { direction: "column", gap: 16, align: "center" },
                [
                  createNodeWithProps(
                    "Text",
                    {
                      type: "heading",
                      level: "h2",
                      text: "Pronto para dar o próximo passo?",
                      color: "#1e3a8a",
                      align: "center",
                      fontSizeMobile: 28,
                      fontSizeDesktop: 34,
                      useDesktopFontSize: true
                    },
                    undefined,
                    "cta-banner-title"
                  ),
                  createNodeWithProps(
                    "Text",
                    {
                      type: "paragraph",
                      text: "Entre em contato agora mesmo e receba um atendimento personalizado para a sua necessidade.",
                      color: "#3b82f6",
                      align: "center",
                      fontSizeMobile: 17,
                      fontSizeDesktop: 17
                    },
                    undefined,
                    "cta-banner-text"
                  ),
                  createNodeWithProps(
                    "Button",
                    {
                      text: "Falar com especialista",
                      href: "#contato",
                      variant: "primary",
                      alignment: "center"
                    },
                    undefined,
                    "cta-banner-btn"
                  )
                ],
                "cta-banner-flex"
              )
            ],
            "cta-banner-container"
          )
        ],
        "cta-banner-section"
      )
  }
];

export const componentCatalog: CatalogItem[] = [...baseCatalogItems, ...presetCatalogItems];

export function getCatalogByCategory(category: ComponentCategory): CatalogItem[] {
  return componentCatalog.filter((item) => item.category === category);
}
