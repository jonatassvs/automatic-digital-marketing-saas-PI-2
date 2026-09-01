import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const containerSchema: ComponentSchema = {
  component: "Container",
  label: "Container",
  acceptsChildren: true,
  fields: [
    { name: "maxWidth", label: "Largura maxima", type: "number", defaultValue: 1120 },
    {
      name: "align",
      label: "Alinhamento",
      type: "select",
      defaultValue: "left",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" }
      ]
    }
  ]
};
