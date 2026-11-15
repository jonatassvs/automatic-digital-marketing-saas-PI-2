import contract from "./component-contract.json";
import type { LandingPageDocument, PageComponent, PageDesign, SeoConfig } from "@/types/page";
import { requireValid } from "../errors";
import { boolean, number, object, text, url } from "./common";

type Field = { name: string; type: string; required?: boolean; min?: number; max?: number; options?: (string | number)[] };
const schemas: Record<string, { acceptsChildren: boolean; fields: Field[] }> = contract.schemas;

export class ComponentValidator {
  validate(value: unknown): PageComponent[] {
    const ids = new Set<string>();
    const visit = (nodes: unknown, depth: number) => {
      requireValid(Array.isArray(nodes) && nodes.length <= 80, "Maximo de 80 componentes.");
      requireValid(!nodes.length || depth <= 8, "Profundidade maxima de 8 niveis.");
      for (const raw of nodes) {
        const node = object(raw, ["id", "component", "props", "children"], ["id", "component", "props"]);
        const id = text(node.id, 100, 1);
        requireValid(/^[A-Za-z0-9_-]+$/.test(id) && !ids.has(id), "ID invalido ou repetido.");
        ids.add(id); requireValid(ids.size <= 80, "Maximo de 80 componentes.");
        const name = text(node.component, 40, 1);
        requireValid(Object.hasOwn(schemas, name), "Componente desconhecido.");
        const schema = schemas[name];
        const props = object(node.props, schema.fields.map(field => field.name));
        for (const field of schema.fields) {
          if (field.required) requireValid(Object.hasOwn(props, field.name) && Boolean(props[field.name]), "Propriedade obrigatoria ausente.");
          if (Object.hasOwn(props, field.name)) this.field(field, props[field.name], name);
        }
        const children = node.children === undefined ? [] : node.children;
        requireValid(Array.isArray(children) && (schema.acceptsChildren || !children.length), "Filhos nao permitidos.");
        visit(children, depth + 1);
      }
    };
    visit(value, 1);
    return structuredClone(value) as PageComponent[];
  }
  private field(field: Field, value: unknown, component: string) {
    switch (field.type) {
      case "number": number(value, field.min ?? 0, field.max ?? 3840); if (field.name === "columns") number(value, 1, 12, true); break;
      case "checkbox": boolean(value); break;
      case "select": requireValid((typeof value === "string" || typeof value === "number") && field.options?.includes(value), "Opcao invalida."); break;
      case "url": url(value, false, component === "Image"); break;
      case "color": requireValid(/^#[0-9a-f]{6}$/i.test(text(value, 7)), "Cor invalida."); break;
      case "richText": {
        requireValid(Array.isArray(value) && value.length <= 200, "Texto formatado invalido.");
        let length = 0;
        for (const raw of value) {
          const segment = object(raw, ["text", "bold", "italic", "underline", "strike"], ["text"]);
          length += text(segment.text).length;
          for (const key of Object.keys(segment)) if (key !== "text") boolean(segment[key]);
        }
        requireValid(length <= 10000, "Texto muito longo."); break;
      }
      case "links": {
        requireValid(Array.isArray(value) && value.length <= 50, "Lista de links invalida.");
        for (const raw of value) {
          const item = object(raw, ["text", "url", "newTab"], ["text"]);
          text(item.text, 100);
          if (Object.hasOwn(item, "url")) url(item.url, false, false);
          if (Object.hasOwn(item, "newTab")) boolean(item.newTab);
        }
        break;
      }
      default: text(value);
    }
  }
}
export class PageValidator {
  validate(value: unknown, pageId?: string): Omit<LandingPageDocument, "id"> {
    const data = object(value, ["id", "name", "status", "seo", "components", "design"], ["name", "seo", "components"]);
    if (Object.hasOwn(data, "id")) requireValid(text(data.id, 100, 1) && (!pageId || data.id === pageId), "ID nao pode mudar.");
    const name = text(data.name, 150, 1).trim(); requireValid(name, "Informe o nome.");
    const status = data.status === undefined ? "draft" : data.status;
    requireValid(status === "draft" || status === "private" || status === "published", "Estado invalido.");
    return { name, status, seo: this.seo(data.seo), components: new ComponentValidator().validate(data.components), design: data.design === undefined ? { mobileMaxWidth: 720, fonts: [], defaultFont: "system" } : this.design(data.design) };
  }
  seo(value: unknown): SeoConfig {
    const data = object(value, ["title", "description", "slug", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "robotsIndex", "robotsFollow"], ["title", "description", "slug", "robotsIndex", "robotsFollow"]);
    for (const [key, max] of Object.entries({ title: 200, description: 500, slug: 100, ogTitle: 200, ogDescription: 500 })) if (Object.hasOwn(data, key)) text(data[key], max);
    requireValid(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug as string), "Slug invalido.");
    boolean(data.robotsIndex); boolean(data.robotsFollow);
    for (const key of ["canonicalUrl", "ogImage"]) if (Object.hasOwn(data, key)) url(data[key], true, true);
    return structuredClone(data) as SeoConfig;
  }
  design(value: unknown): PageDesign {
    const data = object(value, ["mobileMaxWidth", "fonts", "defaultFont"]);
    if (Object.hasOwn(data, "mobileMaxWidth")) number(data.mobileMaxWidth, 320, 1600, true);
    const fonts = data.fonts === undefined ? [] : data.fonts;
    requireValid(Array.isArray(fonts) && fonts.length <= 6 && fonts.every(font => typeof font === "string" && contract.fonts.includes(font)) && new Set(fonts).size === fonts.length, "Fontes invalidas.");
    const defaultFont = data.defaultFont === undefined ? "system" : data.defaultFont;
    requireValid(typeof defaultFont === "string" && (defaultFont === "system" || fonts.includes(defaultFont)), "Fonte padrao invalida.");
    return structuredClone(data) as PageDesign;
  }
}
