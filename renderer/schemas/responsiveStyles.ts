import type { SchemaField } from "./schemaTypes";

// One allowlist drives controls, validation and responsive rendering for every block.
export const basicStyleFields: SchemaField[] = [
  ...["Top", "Right", "Bottom", "Left"].flatMap(side => [
    { name: `padding${side}`, label: `Padding ${ {Top: "superior", Right: "direito", Bottom: "inferior", Left: "esquerdo"}[side] } (px)`, type: "number" as const, min: 0, max: 1000 },
    { name: `margin${side}`, label: `Margem ${ {Top: "superior", Right: "direito", Bottom: "inferior", Left: "esquerdo"}[side] } (px)`, type: "number" as const, min: -1000, max: 1000 }
  ]),
  { name: "backgroundColor", label: "Cor de fundo", type: "color" },
  { name: "color", label: "Cor do texto", type: "color" },
  { name: "borderColor", label: "Cor da borda", type: "color" },
  { name: "borderWidth", label: "Espessura da borda (px)", type: "number", min: 0, max: 30 },
  { name: "borderRadius", label: "Arredondamento (px)", type: "number", min: 0, max: 1000 },
  { name: "borderStyle", label: "Estilo da borda", type: "select", options: ["none", "solid", "dashed", "dotted", "double"].map(value => ({ label: value, value })) },
  { name: "opacity", label: "Opacidade (%)", type: "number", min: 0, max: 100 },
  { name: "width", label: "Largura (px)", type: "number", min: 0, max: 3840 },
  { name: "height", label: "Altura (px)", type: "number", min: 0, max: 3840 },
  { name: "maxWidth", label: "Largura m?xima (px)", type: "number", min: 0, max: 3840 },
  { name: "gap", label: "Espa?o entre filhos (px)", type: "number", min: 0, max: 1000 }
];
export function responsiveFieldName(device: "mobile" | "desktop", name: string) {
  return `${device}${name[0].toUpperCase()}${name.slice(1)}`;
}
export const responsiveStyleFields: SchemaField[] = (["mobile", "desktop"] as const).flatMap(device =>
  basicStyleFields.map(field => ({ ...field, name: responsiveFieldName(device, field.name), group: "style", responsive: true }))
);
