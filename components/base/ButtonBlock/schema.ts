import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export const buttonSchema: ComponentSchema = {
  component: "Button",
  label: "Botao",
  acceptsChildren: false,
  fields: [
    { name: "linkTarget", label: "Abrir link", type: "select", group: "content", options: [{ label: "Na mesma aba", value: "_self" }, { label: "Em outra aba", value: "_blank" }] },
    { name: "text", label: "Texto", type: "text", group: "content", required: true, defaultValue: "Fale conosco" },
    { name: "href", label: "Destino", type: "url", group: "content", defaultValue: "#contato" },
    {
      name: "variant",
      label: "Estilo",
      type: "select",
      group: "style",
      defaultValue: "primary",
      options: [
        { label: "Principal", value: "primary" },
        { label: "Secundario", value: "secondary" }
      ]
    },
    {
      "name": "width",
      "label": "Largura (0 = autom?tica)",
      "type": "number",
      "group": "style",
      "defaultValue": 0,
      "min": 0,
      "max": 2400
    },
    {
      "name": "widthUnit",
      "label": "Unidade da largura",
      "type": "select",
      "group": "style",
      "defaultValue": "px",
      "options": [
        {
          "label": "px",
          "value": "px"
        },
        {
          "label": "%",
          "value": "%"
        },
        {
          "label": "vw",
          "value": "vw"
        },
        {
          "label": "rem",
          "value": "rem"
        }
      ]
    },
    {
      "name": "height",
      "label": "Altura (0 = autom?tica)",
      "type": "number",
      "group": "style",
      "defaultValue": 0,
      "min": 0,
      "max": 2400
    },
    {
      "name": "heightUnit",
      "label": "Unidade da altura",
      "type": "select",
      "group": "style",
      "defaultValue": "px",
      "options": [
        {
          "label": "px",
          "value": "px"
        },
        {
          "label": "vh",
          "value": "vh"
        },
        {
          "label": "rem",
          "value": "rem"
        }
      ]
    },
    {
      "name": "borderRadius",
      "label": "Arredondamento (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 8,
      "min": 0,
      "max": 1000
    },
    {
      "name": "borderWidth",
      "label": "Espessura da borda (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 0,
      "min": 0,
      "max": 30
    },
    {
      "name": "borderStyle",
      "label": "Estilo da borda",
      "type": "select",
      "group": "style",
      "defaultValue": "solid",
      "options": [
        {
          "label": "solid",
          "value": "solid"
        },
        {
          "label": "dashed",
          "value": "dashed"
        },
        {
          "label": "dotted",
          "value": "dotted"
        },
        {
          "label": "double",
          "value": "double"
        }
      ]
    },
    {
      "name": "borderColor",
      "label": "Cor da borda",
      "type": "color",
      "group": "style",
      "defaultValue": "#d7dde5"
    },
    {
      "name": "opacity",
      "label": "Opacidade (%)",
      "type": "number",
      "group": "style",
      "defaultValue": 100,
      "min": 0,
      "max": 100
    },
    {
      "name": "shadow",
      "label": "Sombra",
      "type": "select",
      "group": "style",
      "defaultValue": "none",
      "options": [
        {
          "label": "none",
          "value": "none"
        },
        {
          "label": "soft",
          "value": "soft"
        },
        {
          "label": "medium",
          "value": "medium"
        },
        {
          "label": "strong",
          "value": "strong"
        }
      ]
    },
    {
      "name": "marginTop",
      "label": "Margem superior (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 0,
      "min": 0,
      "max": 2400
    },
    {
      "name": "marginBottom",
      "label": "Margem inferior (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 0,
      "min": 0,
      "max": 2400
    },
    {
      "name": "alignment",
      "label": "Posi??o horizontal",
      "type": "select",
      "group": "style",
      "defaultValue": "left",
      "options": [
        {
          "label": "left",
          "value": "left"
        },
        {
          "label": "center",
          "value": "center"
        },
        {
          "label": "right",
          "value": "right"
        }
      ]
    },
    {
      "name": "newTab",
      "label": "Abrir em nova aba",
      "type": "checkbox",
      "group": "content",
      "defaultValue": false
    },
    {
      "name": "customColors",
      "label": "Usar cores personalizadas",
      "type": "checkbox",
      "group": "style",
      "defaultValue": false
    },
    {
      "name": "backgroundColor",
      "label": "Cor de fundo",
      "type": "color",
      "group": "style",
      "defaultValue": "#0f766e"
    },
    {
      "name": "color",
      "label": "Cor do texto",
      "type": "color",
      "group": "style",
      "defaultValue": "#ffffff"
    },
    {
      "name": "hoverBackgroundColor",
      "label": "Fundo ao passar o mouse / focar",
      "type": "color",
      "group": "style",
      "defaultValue": "#115e59"
    },
    {
      "name": "hoverColor",
      "label": "Texto ao passar o mouse / focar",
      "type": "color",
      "group": "style",
      "defaultValue": "#ffffff"
    },
    {
      "name": "hoverBorderColor",
      "label": "Borda ao passar o mouse / focar",
      "type": "color",
      "group": "style",
      "defaultValue": "#115e59"
    },
    {
      "name": "fontSize",
      "label": "Fonte (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 16,
      "min": 8,
      "max": 120
    },
    {
      "name": "fontWeight",
      "label": "Peso da fonte",
      "type": "select",
      "group": "style",
      "defaultValue": "800",
      "options": [
        {
          "label": "400",
          "value": "400"
        },
        {
          "label": "500",
          "value": "500"
        },
        {
          "label": "600",
          "value": "600"
        },
        {
          "label": "700",
          "value": "700"
        },
        {
          "label": "800",
          "value": "800"
        },
        {
          "label": "900",
          "value": "900"
        }
      ]
    },
    {
      "name": "textTransform",
      "label": "Capitaliza??o",
      "type": "select",
      "group": "style",
      "defaultValue": "none",
      "options": [
        {
          "label": "none",
          "value": "none"
        },
        {
          "label": "uppercase",
          "value": "uppercase"
        },
        {
          "label": "lowercase",
          "value": "lowercase"
        },
        {
          "label": "capitalize",
          "value": "capitalize"
        }
      ]
    },
    {
      "name": "paddingX",
      "label": "Espa?amento interno horizontal (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 18,
      "min": 0,
      "max": 200
    },
    {
      "name": "paddingY",
      "label": "Espa?amento interno vertical (px)",
      "type": "number",
      "group": "style",
      "defaultValue": 13,
      "min": 0,
      "max": 200
    },
    {
      "name": "transitionDuration",
      "label": "Dura??o da transi??o (ms)",
      "type": "number",
      "group": "style",
      "defaultValue": 150,
      "min": 0,
      "max": 2000
    },
    {
      "name": "hoverEffect",
      "label": "Efeito ao passar o mouse / focar",
      "type": "select",
      "group": "style",
      "defaultValue": "none",
      "options": [
        {
          "label": "none",
          "value": "none"
        },
        {
          "label": "lift",
          "value": "lift"
        },
        {
          "label": "grow",
          "value": "grow"
        }
      ]
    }
  ]
};
