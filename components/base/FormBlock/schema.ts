import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

export type WhatsappFormField = {
  id?: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea" | "number";
  placeholder?: string;
  required: boolean;
};

export const defaultWhatsappFormFields: WhatsappFormField[] = [
  {
    id: "field-name",
    label: "Seu nome",
    type: "text",
    placeholder: "Digite seu nome completo",
    required: true
  },
  {
    id: "field-phone",
    label: "Seu WhatsApp / Telefone",
    type: "tel",
    placeholder: "(11) 99999-9999",
    required: true
  },
  {
    id: "field-message",
    label: "Como podemos ajudar?",
    type: "textarea",
    placeholder: "Conte brevemente o que você procura...",
    required: false
  }
];

export const formSchema: ComponentSchema = {
  component: "Form",
  label: "Formulário WhatsApp",
  category: "molecule",
  description: "Formulário compacto com campos personalizados que envia os dados direto para o WhatsApp.",
  acceptsChildren: false,
  fields: [
    {
      name: "phoneNumber",
      label: "Número do WhatsApp (com DDI + DDD)",
      description: "Apenas números, ex: 5511999999999",
      type: "text",
      group: "content",
      required: true,
      defaultValue: "5511999999999"
    },
    {
      name: "title",
      label: "Título do formulário (opcional)",
      type: "text",
      group: "content",
      defaultValue: "Fale conosco no WhatsApp"
    },
    {
      name: "subtitle",
      label: "Subtítulo (opcional)",
      type: "text",
      group: "content",
      defaultValue: "Preencha os campos abaixo para iniciar o atendimento."
    },
    {
      name: "introMessage",
      label: "Mensagem inicial no WhatsApp",
      type: "text",
      group: "content",
      defaultValue: "Olá! Preenchi o formulário na página:"
    },
    {
      name: "customFields",
      label: "Campos Personalizados",
      type: "formFields",
      group: "content",
      defaultValue: defaultWhatsappFormFields
    },
    {
      name: "buttonText",
      label: "Texto do botão de envio",
      type: "text",
      group: "content",
      required: true,
      defaultValue: "Enviar pelo WhatsApp"
    },
    {
      name: "backgroundColor",
      label: "Cor de fundo do formulário",
      type: "color",
      group: "style",
      defaultValue: "#ffffff"
    },
    {
      name: "borderColor",
      label: "Cor da borda",
      type: "color",
      group: "style",
      defaultValue: "#e5e7eb"
    },
    {
      name: "textColor",
      label: "Cor dos textos e rótulos",
      type: "color",
      group: "style",
      defaultValue: "#111827"
    },
    {
      name: "buttonColor",
      label: "Cor do botão do WhatsApp",
      type: "color",
      group: "style",
      defaultValue: "#16a34a"
    },
    {
      name: "buttonTextColor",
      label: "Cor do texto do botão",
      type: "color",
      group: "style",
      defaultValue: "#ffffff"
    },
    {
      name: "borderRadius",
      label: "Arredondamento da borda (px)",
      type: "number",
      group: "style",
      min: 0,
      max: 64,
      defaultValue: 12
    },
    {
      name: "padding",
      label: "Espaçamento interno (px)",
      type: "number",
      group: "style",
      min: 0,
      max: 80,
      defaultValue: 24
    }
  ]
};
