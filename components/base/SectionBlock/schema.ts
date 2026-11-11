import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const sectionSchema: ComponentSchema = {
  component: "Section",
  label: "Secao",
  acceptsChildren: true,
  fields: [
    { name: "background", label: "Cor de fundo", type: "color", group: "style", defaultValue: "#ffffff" },
    { name: "paddingY", label: "Espacamento vertical", type: "number", group: "style", defaultValue: 72 }
  ]
};
