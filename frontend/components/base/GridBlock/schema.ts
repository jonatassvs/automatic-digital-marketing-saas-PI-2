import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const gridSchema: ComponentSchema = {
  component: "Grid",
  label: "Grade",
  acceptsChildren: true,
  fields: [
    { name: "columns", label: "Colunas", type: "number", defaultValue: 3 },
    { name: "gap", label: "Espaco", type: "number", defaultValue: 20 }
  ]
};
