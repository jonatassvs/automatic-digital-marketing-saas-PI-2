import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const linkSchema: ComponentSchema = {
  component: "Link",
  label: "Link",
  category: "atom",
  description: "Link de texto simples para navegação rápida.",
  acceptsChildren: false,
  fields: [
    { name: "text", label: "Texto", type: "text", group: "content", required: true, defaultValue: "Saiba mais" },
    { name: "href", label: "Destino", type: "url", group: "content", required: true, defaultValue: "#" }
  ]
};
