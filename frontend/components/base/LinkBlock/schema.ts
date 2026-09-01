import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const linkSchema: ComponentSchema = {
  component: "Link",
  label: "Link",
  acceptsChildren: false,
  fields: [
    { name: "text", label: "Texto", type: "text", required: true, defaultValue: "Saiba mais" },
    { name: "href", label: "Destino", type: "url", required: true, defaultValue: "#" }
  ]
};
