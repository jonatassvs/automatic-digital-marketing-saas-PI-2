import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const navbarSchema: ComponentSchema = {
  component: "Navbar",
  label: "Barra de Navegacao (Navbar)",
  acceptsChildren: true,
  fields: [
    { name: "logoText", label: "Texto do Logo", type: "text", group: "content", defaultValue: "Minha Marca" },
    { name: "logoImage", label: "URL da Imagem do Logo (opcional)", type: "url", group: "content", defaultValue: "" },
    { name: "logoAlt", label: "Texto alternativo do Logo", type: "text", group: "content", defaultValue: "Logo" },
    { name: "logoHref", label: "Link do Logo", type: "url", group: "content", defaultValue: "#" },
    { name: "logoWidth", label: "Largura max. do Logo (px)", type: "number", min: 20, max: 400, group: "style", defaultValue: 140 },
    { name: "backgroundColor", label: "Cor de Fundo da Barra", type: "color", group: "style", defaultValue: "#ffffff" },
    {
      name: "links",
      label: "Links de Navegação",
      type: "links",
      group: "content"
    },
    { name: "link1Text", label: "Link 1 - Texto", type: "text", group: "content", defaultValue: "Início" },
    { name: "link1Url", label: "Link 1 - URL", type: "url", group: "content", defaultValue: "#" },
    { name: "link2Text", label: "Link 2 - Texto", type: "text", group: "content", defaultValue: "Serviços" },
    { name: "link2Url", label: "Link 2 - URL", type: "url", group: "content", defaultValue: "#servicos" },
    { name: "link3Text", label: "Link 3 - Texto", type: "text", group: "content", defaultValue: "Sobre" },
    { name: "link3Url", label: "Link 3 - URL", type: "url", group: "content", defaultValue: "#sobre" },
    { name: "link4Text", label: "Link 4 - Texto", type: "text", group: "content", defaultValue: "Contato" },
    { name: "link4Url", label: "Link 4 - URL", type: "url", group: "content", defaultValue: "#contato" },
    { name: "link5Text", label: "Link 5 - Texto (opcional)", type: "text", group: "content", defaultValue: "" },
    { name: "link5Url", label: "Link 5 - URL (opcional)", type: "url", group: "content", defaultValue: "" },
    { name: "link6Text", label: "Link 6 - Texto (opcional)", type: "text", group: "content", defaultValue: "" },
    { name: "link6Url", label: "Link 6 - URL (opcional)", type: "url", group: "content", defaultValue: "" },
    { name: "ctaText", label: "Botao de Acao (CTA) - Texto", type: "text", group: "content", defaultValue: "" },
    { name: "ctaUrl", label: "Botao de Acao (CTA) - URL", type: "url", group: "content", defaultValue: "" },
    { name: "linkColor", label: "Cor dos Links", type: "color", group: "style", defaultValue: "#374151" },
    { name: "ctaBackgroundColor", label: "Cor de Fundo do CTA", type: "color", group: "style", defaultValue: "#2563eb" },
    { name: "ctaTextColor", label: "Cor do Texto do CTA", type: "color", group: "style", defaultValue: "#ffffff" },
    { name: "sticky", label: "Fixar no topo (Sticky)", type: "checkbox", group: "style", defaultValue: false }
  ]
};

