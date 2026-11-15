import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const spacerSchema: ComponentSchema = {
  component: "Spacer",
  label: "Espacador",
  category: "atom",
  description: "Espaço vertical em branco para separar elementos.",
  acceptsChildren: false,
  fields: [{ name: "height", label: "Altura", type: "number", group: "style", defaultValue: 24 }]
};
