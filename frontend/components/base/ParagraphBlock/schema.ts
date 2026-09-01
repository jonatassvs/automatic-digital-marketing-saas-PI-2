import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const paragraphSchema: ComponentSchema = {
  component: "Paragraph",
  label: "Paragrafo",
  acceptsChildren: false,
  fields: [
    {
      name: "text",
      label: "Texto",
      type: "textarea",
      required: true,
      defaultValue: "Escreva uma mensagem clara para seus clientes."
    },
    { name: "color", label: "Cor", type: "color", defaultValue: "#475569" }
  ]
};
