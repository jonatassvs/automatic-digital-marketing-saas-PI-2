import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const imageSchema: ComponentSchema = {
  component: "Image",
  label: "Imagem",
  acceptsChildren: false,
  fields: [
    {
      name: "src",
      label: "URL da imagem",
      type: "url",
      group: "content",
      required: true,
      defaultValue: "https://images.unsplash.com/photo-1556761175-b413da4baf72"
    },
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      group: "content",
      required: true,
      defaultValue: "Equipe atendendo cliente"
    }
  ]
};
