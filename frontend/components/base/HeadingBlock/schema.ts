import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const headingSchema: ComponentSchema = {
  component: "Heading",
  label: "Titulo",
  acceptsChildren: false,
  fields: [
    {
      name: "level",
      label: "Nivel",
      type: "select",
      defaultValue: 2,
      options: [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 }
      ]
    },
    { name: "text", label: "Texto", type: "text", required: true, defaultValue: "Novo titulo" },
    { name: "color", label: "Cor", type: "color", defaultValue: "#17202a" }
  ]
};
