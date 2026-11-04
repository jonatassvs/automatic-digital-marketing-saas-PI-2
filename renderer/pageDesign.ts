import type { LandingPageDocument, PageComponent, PageDesign } from "@/types/page";

export const DEFAULT_MOBILE_MAX_WIDTH = 720;
export const MIN_MOBILE_MAX_WIDTH = 320;
export const MAX_MOBILE_MAX_WIDTH = 1600;
export const MAX_PAGE_FONTS = 6;
export const GOOGLE_FONTS = [
  "Inter", "Lato", "Lora", "Merriweather", "Montserrat", "Noto Sans",
  "Nunito", "Open Sans", "Playfair Display", "Poppins", "Roboto", "Source Sans 3"
] as const;
export const SYSTEM_FONT_STACK = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export function isGoogleFont(value: unknown): value is typeof GOOGLE_FONTS[number] {
  return typeof value === "string" && GOOGLE_FONTS.some(font => font === value);
}

export function normalizePageDesign(value?: unknown): Required<PageDesign> {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value as PageDesign : {};
  const fonts = Array.isArray(input.fonts) ? [...new Set(input.fonts.filter(isGoogleFont))].slice(0, MAX_PAGE_FONTS) : [];
  return {
    mobileMaxWidth: Number.isInteger(input.mobileMaxWidth) && input.mobileMaxWidth! >= MIN_MOBILE_MAX_WIDTH && input.mobileMaxWidth! <= MAX_MOBILE_MAX_WIDTH
      ? input.mobileMaxWidth! : DEFAULT_MOBILE_MAX_WIDTH,
    fonts,
    defaultFont: input.defaultFont && fonts.includes(input.defaultFont as typeof GOOGLE_FONTS[number]) ? input.defaultFont : "system"
  };
}

export function validatePageDesign(value: unknown): string[] {
  if (value === undefined) return [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Configurações visuais da página inválidas."];
  const input = value as Record<string, unknown>;
  const errors: string[] = [];
  if (Object.keys(input).some(key => !["mobileMaxWidth", "fonts", "defaultFont"].includes(key))) errors.push("Configuração visual não permitida.");
  if (input.mobileMaxWidth !== undefined && (typeof input.mobileMaxWidth !== "number" || !Number.isInteger(input.mobileMaxWidth) || input.mobileMaxWidth < MIN_MOBILE_MAX_WIDTH || input.mobileMaxWidth > MAX_MOBILE_MAX_WIDTH)) errors.push(`O limite mobile deve estar entre ${MIN_MOBILE_MAX_WIDTH} e ${MAX_MOBILE_MAX_WIDTH} px.`);
  if (input.fonts !== undefined && (!Array.isArray(input.fonts) || input.fonts.length > MAX_PAGE_FONTS || !input.fonts.every(isGoogleFont) || new Set(input.fonts).size !== input.fonts.length)) errors.push(`Escolha até ${MAX_PAGE_FONTS} fontes diferentes do catálogo.`);
  if (input.defaultFont !== undefined && input.defaultFont !== "system" && (!isGoogleFont(input.defaultFont) || !Array.isArray(input.fonts) || !input.fonts.includes(input.defaultFont))) errors.push("A fonte padrão deve estar na biblioteca da página.");
  return errors;
}

export function resolvePageFont(value: unknown, design?: PageDesign): string {
  const normalized = normalizePageDesign(design);
  if (value === "system") return "system";
  return typeof value === "string" && normalized.fonts.includes(value) ? value : normalized.defaultFont;
}

export function fontStack(font: string): string {
  return isGoogleFont(font) ? `'${font}', ${SYSTEM_FONT_STACK}` : SYSTEM_FONT_STACK;
}

export function googleFontUrl(font: unknown): string | undefined {
  // Only catalog families can influence this fixed provider URL, never user CSS/HTML.
  return isGoogleFont(font) ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:ital,wght@0,400;0,700;1,400;1,700&display=swap` : undefined;
}

export function removePageFont(page: LandingPageDocument, font: string): LandingPageDocument {
  const design = normalizePageDesign(page.design);
  function clearReferences(components: PageComponent[]): PageComponent[] {
    return components.map(component => ({ ...component,
      props: component.props.fontFamily === font ? { ...component.props, fontFamily: "inherit" } : component.props,
      children: component.children ? clearReferences(component.children) : undefined
    }));
  }
  return { ...page, design: { ...design, fonts: design.fonts.filter(item => item !== font), defaultFont: design.defaultFont === font ? "system" : design.defaultFont }, components: clearReferences(page.components) };
}
