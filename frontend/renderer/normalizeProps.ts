import type { ComponentProps } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";
import { isSafeUrl } from "@/renderer/validation";

// Applies schema defaults and keeps only fields allowed by the component schema.
export function normalizeProps(schema: ComponentSchema, props: ComponentProps): ComponentProps {
  return Object.fromEntries(
    schema.fields.map((field) => {
      const value = props[field.name];

      if (value === undefined || value === null) {
        return [field.name, field.defaultValue];
      }

      if (field.type === "number") {
        return [field.name, typeof value === "number" && Number.isFinite(value) ? value : field.defaultValue];
      }

      if (field.type === "checkbox") {
        return [field.name, typeof value === "boolean" ? value : field.defaultValue];
      }

      if (field.type === "select") {
        const optionValues = field.options?.map((option) => option.value) ?? [];
        return [field.name, optionValues.includes(value as string | number) ? value : field.defaultValue];
      }

      if (field.type === "url") {
        return [field.name, typeof value === "string" && isSafeUrl(value) ? value : field.defaultValue];
      }

      if (field.type === "richText") {
        return [field.name, Array.isArray(value) ? value : field.defaultValue];
      }

      return [field.name, typeof value === "string" ? value : field.defaultValue];
    })
  );
}
