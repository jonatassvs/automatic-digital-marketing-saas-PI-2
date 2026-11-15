import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const contactSchema: ComponentSchema = {
  component: "Contact",
  label: "Seção de Contato (Imagem + WhatsApp)",
  category: "organism",
  description: "Seção completa com container, título e descrição centralizados e grade com imagem + formulário do WhatsApp.",
  acceptsChildren: true,
  fields: [
    { name: "background", label: "Cor de fundo", type: "color", group: "style", defaultValue: "#f8fafc" },
    { name: "paddingY", label: "Espaçamento vertical", type: "number", group: "style", min: 0, max: 240, defaultValue: 72 }
  ]
};
