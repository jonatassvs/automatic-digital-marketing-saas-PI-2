import type { PageDesign } from "@/types/page";
import { fontStack, normalizePageDesign, resolvePageFont } from "@/renderer/pageDesign";

export function FontFamilySelect({ design, value, onChange }: {
  design?: PageDesign;
  value: unknown;
  onChange: (font: string) => void;
}) {
  const normalized = normalizePageDesign(design);
  const selected = value === "system" || (typeof value === "string" && normalized.fonts.includes(value)) ? value : "inherit";
  const effective = resolvePageFont(selected, normalized);
  const label = effective === "system" ? "Fonte do sistema" : effective;
  return <label>
    Fonte do texto
    <select value={selected} onChange={event => onChange(event.target.value)} style={{ fontFamily: fontStack(effective) }}>
      <option value="inherit">Padrão da página ({normalized.defaultFont === "system" ? "sistema" : normalized.defaultFont})</option>
      <option value="system">Fonte do sistema</option>
      {normalized.fonts.map(font => <option value={font} key={font}>{font}</option>)}
    </select>
    <small>Fonte configurada: {label}{selected === "inherit" ? " (herdada da página)" : ""}</small>
  </label>;
}
