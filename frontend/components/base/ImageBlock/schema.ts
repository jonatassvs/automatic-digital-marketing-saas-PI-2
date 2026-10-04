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
      "name": "aspectRatio",
      "label": "Propor??o (altura autom?tica)",
      "type": "select",
      "group": "style",
      "defaultValue": "4 / 3",
      "options": [
        {
          "label": "auto",
          "value": "auto"
        },
        {
          "label": "1 / 1",
          "value": "1 / 1"
        },
        {
          "label": "4 / 3",
          "value": "4 / 3"
        },
        {
          "label": "3 / 2",
          "value": "3 / 2"
        },
        {
          "label": "16 / 9",
          "value": "16 / 9"
        },
        {
          "label": "9 / 16",
          "value": "9 / 16"
        }
      ]
    },
    {
      "name": "objectFit",
      "label": "Encaixe (object-fit)",
      "type": "select",
      "group": "style",
      "defaultValue": "cover",
      "options": [
        {
          "label": "cover",
          "value": "cover"
        },
        {
          "label": "contain",
          "value": "contain"
        },
        {
          "label": "fill",
          "value": "fill"
        },
        {
          "label": "none",
          "value": "none"
        },
        {
          "label": "scale-down",
          "value": "scale-down"
        }
      ]
    },
    {
      "name": "objectPositionX",
      "label": "Posi??o horizontal do recorte (%)",
      "type": "number",
      "group": "style",
      "defaultValue": 50,
      "min": 0,
      "max": 100
    },
    {
      "name": "objectPositionY",
      "label": "Posi??o vertical do recorte (%)",
      "type": "number",
      "group": "style",
      "defaultValue": 50,
      "min": 0,
      "max": 100
    },
    {
      "name": "backgroundColor",
      "label": "Fundo da imagem",
      "type": "color",
      "group": "style",
      "defaultValue": "#ffffff"
    },
    {
      "name": "loading",
      "label": "Carregamento",
      "type": "select",
      "group": "style",
      "defaultValue": "lazy",
      "options": [
        {
          "label": "lazy",
          "value": "lazy"
        },
        {
          "label": "eager",
          "value": "eager"
        }
      ]
    }
  ]
};
