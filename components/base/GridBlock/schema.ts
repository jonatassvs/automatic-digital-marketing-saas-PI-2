import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const gridSchema: ComponentSchema = {
  component: "Grid",
  label: "Grade",
  category: "molecule",
  description: "Organiza elementos lado a lado em múltiplas colunas.",
  acceptsChildren: true,
  fields: [
    { name: "columns", label: "Colunas", type: "number", group: "style", defaultValue: 3 },
    { name: "gap", label: "Espaco", type: "number", group: "style", defaultValue: 20 }
  ]
};
