import type { ComponentName } from "@/types/page";

export type SchemaField = {
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  group?: "content" | "style";
  name: string;
  label: string;
  responsive?: boolean;
  type: "checkbox" | "color" | "number" | "richText" | "select" | "text" | "textarea" | "url" | "links";
  required?: boolean;
  defaultValue?: boolean | string | number | unknown[];
  options?: Array<{ label: string; value: string | number }>;
};

export type ComponentCategory = "atom" | "molecule" | "organism";

export type ComponentSchema = {
  component: ComponentName;
  label: string;
  category?: ComponentCategory;
  description?: string;
  acceptsChildren: boolean;
  fields: SchemaField[];
};
