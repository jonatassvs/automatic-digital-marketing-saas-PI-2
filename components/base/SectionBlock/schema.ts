import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const sectionSchema: ComponentSchema = {
  component: "Section",
  label: "Secao",
  category: "organism",
  description: "Faixa estrutural de página com cor de fundo e espaçamento.",
  acceptsChildren: true,
  fields: [
    { name: "background", label: "Cor de fundo", type: "color", group: "style", defaultValue: "#ffffff" },
    { name: "paddingY", label: "Espacamento vertical", type: "number", group: "style", defaultValue: 72 }
  ]
};
