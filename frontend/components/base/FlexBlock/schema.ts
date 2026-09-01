import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const flexSchema: ComponentSchema = {
  component: "Flex",
  label: "Flex",
  acceptsChildren: true,
  fields: [
    {
      name: "direction",
      label: "Direcao",
      type: "select",
      defaultValue: "row",
      options: [
        { label: "Linha", value: "row" },
        { label: "Coluna", value: "column" }
      ]
    },
    { name: "gap", label: "Espaco", type: "number", defaultValue: 16 },
    {
      name: "align",
      label: "Alinhar",
      type: "select",
      defaultValue: "stretch",
      options: [
        { label: "Inicio", value: "flex-start" },
        { label: "Centro", value: "center" },
        { label: "Esticar", value: "stretch" }
      ]
    }
  ]
};
