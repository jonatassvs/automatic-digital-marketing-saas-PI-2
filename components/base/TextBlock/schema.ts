import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const textSchema: ComponentSchema = {
  component: "Text",
  label: "Texto",
  acceptsChildren: false,
  fields: [
    {
      name: "type",
      label: "Tipo de texto",
      type: "select",
      group: "content",
      defaultValue: "paragraph",
      options: [
        { label: "Paragrafo", value: "paragraph" },
        { label: "Heading", value: "heading" },
        { label: "Lista", value: "list" },
        { label: "Citacao", value: "quote" },
        { label: "Codigo", value: "code" },
        { label: "Texto curto", value: "inline" }
      ]
    },
    {
      name: "level",
      label: "Nivel",
      type: "select",
      group: "content",
      defaultValue: "h2",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "H4", value: "h4" },
        { label: "H5", value: "h5" },
        { label: "H6", value: "h6" }
      ]
    },
    {
      name: "listType",
      label: "Tipo de lista",
      type: "select",
      group: "content",
      defaultValue: "ul",
      options: [
        { label: "Marcadores", value: "ul" },
        { label: "Numerada", value: "ol" }
      ]
    },
    {
      name: "text",
      label: "Texto",
      type: "textarea",
      group: "content",
      required: true,
      defaultValue: "Novo texto"
    },
    {
      name: "richText",
      label: "Texto formatado",
      type: "richText",
      group: "content",
      defaultValue: []
    },
    { name: "color", label: "Cor", type: "color", group: "style", defaultValue: "#17202a" },
    {
      name: "align",
      label: "Alinhamento",
      type: "select",
      group: "style",
      defaultValue: "left",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" }
      ]
    },
    {
      name: "bold",
      label: "Negrito",
      type: "checkbox",
      group: "style",
      defaultValue: false
    },
    {
      name: "italic",
      label: "Italico",
      type: "checkbox",
      group: "style",
      defaultValue: false
    },
    {
      name: "underline",
      label: "Sublinhado",
      type: "checkbox",
      group: "style",
      defaultValue: false
    },
    {
      name: "strike",
      label: "Riscado",
      type: "checkbox",
      group: "style",
      defaultValue: false
    },
    {
      name: "fontSizeMobile",
      label: "Fonte (px)",
      type: "number",
      group: "style",
      responsive: true,
      min: 8, max: 120, defaultValue: 24
    },
    {
      name: "useDesktopFontSize",
      label: "Usar tamanho diferente no desktop",
      type: "checkbox",
      group: "style",
      defaultValue: false
    },
    {
      name: "fontSizeDesktop",
      label: "Fonte no desktop (px)",
      type: "number",
      group: "style",
      responsive: true,
      min: 8, max: 120, defaultValue: 32
    }
  ]
};
