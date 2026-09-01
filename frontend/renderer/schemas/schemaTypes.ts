import type { ComponentName } from "@/types/page";

export type SchemaField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "color" | "url";
  required?: boolean;
  defaultValue?: string | number;
  options?: Array<{ label: string; value: string | number }>;
};

export type ComponentSchema = {
  component: ComponentName;
  label: string;
  acceptsChildren: boolean;
  fields: SchemaField[];
};
