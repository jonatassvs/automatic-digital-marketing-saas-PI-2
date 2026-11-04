import type { PageDesign } from "@/types/page";
import { basicStyleFields } from "./schemas/responsiveStyles";
import { googleFontUrl, normalizePageDesign } from "./pageDesign";

export function pageResponsiveCss(design?: PageDesign): string {
  const { mobileMaxWidth } = normalizePageDesign(design);
  const scope = `.page-renderer.page-breakpoint-${mobileMaxWidth}`;
  const variables = (device: string) => basicStyleFields.map(field => `--r-${field.name}:var(--r-${device}-${field.name});`).join("");
  return `${scope} .responsive-component{${variables("mobile")}}
${scope} .base-text{font-size:var(--text-font-size-mobile,inherit)}
${scope} .base-grid{grid-template-columns:1fr!important}
@media not all and (max-width: ${mobileMaxWidth}px){
${scope} .responsive-component{${variables("desktop")}}
${scope} .base-text{font-size:var(--text-font-size-desktop,inherit)}
${scope} .base-grid{grid-template-columns:var(--grid-columns)!important}
}`;
}

// CSS is generated only from validated numbers and fixed schema names; SSR needs no viewport JS.
export function PageDesignStyles({ design }: { design?: PageDesign }) {
  const normalized = normalizePageDesign(design);
  return <>
    {normalized.fonts.map(font => <link key={font} rel="stylesheet" href={googleFontUrl(font)} />)}
    <style>{pageResponsiveCss(normalized)}</style>
  </>;
}
