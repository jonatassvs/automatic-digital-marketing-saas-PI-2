import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const buttonSchema: ComponentSchema = {
  component: "Button",
  label: "Botao",
  acceptsChildren: false,
  fields: [
    { name: "text", label: "Texto", type: "text", required: true, defaultValue: "Fale conosco" },
    { name: "href", label: "Destino", type: "url", defaultValue: "#contato" },
    {
      name: "variant",
      label: "Estilo",
      type: "select",
      defaultValue: "primary",
      options: [
        { label: "Principal", value: "primary" },
        { label: "Secundario", value: "secondary" }
      ]
    }
  ]
};
