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
      group: "style",
      defaultValue: "row",
      options: [
        { label: "Linha", value: "row" },
        { label: "Coluna", value: "column" }
      ]
    },
    { name: "gap", label: "Espaco", type: "number", group: "style", defaultValue: 16 },
    {
      name: "align",
      label: "Alinhar",
      type: "select",
      group: "style",
      defaultValue: "stretch",
      options: [
        { label: "Inicio", value: "flex-start" },
        { label: "Centro", value: "center" },
        { label: "Esticar", value: "stretch" }
      ]
    }
  ]
};
