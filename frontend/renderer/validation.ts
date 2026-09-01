import type { ComponentName, PageComponent } from "@/types/page";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";

const MAX_DEPTH = 8;
const MAX_COMPONENTS = 80;
const BLOCKED_URL_SCHEMES = ["javascript:", "file:", "data:"];

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function isSafeUrl(value: unknown): boolean {
  if (typeof value !== "string" || value.trim() === "") {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return !BLOCKED_URL_SCHEMES.some((scheme) => normalized.startsWith(scheme));
}

export function validateComponentTree(components: PageComponent[]): ValidationResult {
  const errors: string[] = [];
  let count = 0;

  function visit(component: PageComponent, depth: number) {
    count += 1;

    if (depth > MAX_DEPTH) {
      errors.push(`O componente ${component.id} ultrapassa a profundidade maxima.`);
    }

    if (!componentSchemas[component.component]) {
      errors.push(`Componente desconhecido: ${component.component}`);
      return;
    }

    const schema = componentSchemas[component.component];
    const allowedFields = new Set(schema.fields.map((field) => field.name));

    for (const field of schema.fields) {
      if (field.required && !component.props[field.name]) {
        errors.push(`${component.id}: campo obrigatorio ausente (${field.label}).`);
      }

      if (field.type === "url" && !isSafeUrl(component.props[field.name])) {
        errors.push(`${component.id}: URL bloqueada por seguranca.`);
      }
    }

    for (const key of Object.keys(component.props)) {
      if (!allowedFields.has(key)) {
        errors.push(`${component.id}: propriedade nao permitida (${key}).`);
      }
    }

    if (!schema.acceptsChildren && component.children?.length) {
      errors.push(`${component.id}: este componente nao aceita filhos.`);
    }

    component.children?.forEach((child) => visit(child, depth + 1));
  }

  components.forEach((component) => visit(component, 1));

  if (count > MAX_COMPONENTS) {
    errors.push("A pagina tem componentes demais para o preview local.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function createDefaultProps(component: ComponentName) {
  return Object.fromEntries(
    componentSchemas[component].fields
      .filter((field) => field.defaultValue !== undefined)
      .map((field) => [field.name, field.defaultValue])
  );
}
