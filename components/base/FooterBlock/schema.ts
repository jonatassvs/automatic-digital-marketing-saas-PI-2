import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const footerSchema: ComponentSchema = {
  component: "Footer",
  label: "Rodapé (Footer)",
  category: "organism",
  description: "Rodapé enxuto montado com Grid, Flex, Textos e Links reutilizáveis.",
  acceptsChildren: true,
  fields: [
    { name: "background", label: "Cor de fundo", type: "color", group: "style", defaultValue: "#0f172a" },
    { name: "paddingY", label: "Espaçamento vertical", type: "number", group: "style", min: 0, max: 240, defaultValue: 56 }
  ]
};
