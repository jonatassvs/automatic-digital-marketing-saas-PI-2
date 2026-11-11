import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const spacerSchema: ComponentSchema = {
  component: "Spacer",
  label: "Espacador",
  acceptsChildren: false,
  fields: [{ name: "height", label: "Altura", type: "number", group: "style", defaultValue: 24 }]
};
