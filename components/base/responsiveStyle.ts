import type { CSSProperties } from "react";
import { basicStyleFields, responsiveFieldName } from "@/renderer/schemas/responsiveStyles";
import { isValidFieldValue } from "@/renderer/validation";
export type ResponsiveProps = { responsiveProps?: Record<string, unknown> };

// Preserve existing component defaults. Desktop overrides mobile; mobile overrides defaults.
export function responsiveStyle(base: CSSProperties, props: Record<string, unknown> = {}, button = false): CSSProperties {
  const result: Record<string, unknown> = { ...base };
  for (const field of basicStyleFields) {
    const mobile = props[responsiveFieldName("mobile", field.name)];
    const desktop = props[responsiveFieldName("desktop", field.name)];
    const valid = (value: unknown) => value !== undefined && value !== null && isValidFieldValue(field, value);
    if (!valid(mobile) && !valid(desktop)) continue;
    const key = field.name;
    const target = button ? ({ backgroundColor: "--button-background", color: "--button-color", borderColor: "--button-border" }[key] ?? key) : key;
    const vertical = key.endsWith("Top") || key.endsWith("Bottom");
    const spacing = key.startsWith("padding") ? "padding" : key.startsWith("margin") ? "margin" : undefined;
    const fallback = result[target] ?? (spacing ? result[`${spacing}${vertical ? "Block" : "Inline"}`] ?? result[spacing] : undefined)
      ?? (key === "backgroundColor" ? result.background : undefined) ?? "revert";
    const cssValue = (value: unknown) => typeof value === "number" ? key === "opacity" ? value / 100 : `${value}px` : value;
    // Existing opacity is already a 0?1 CSS value, unlike the panel's percentage.
    const fallbackValue = typeof fallback === "number" && key !== "opacity" ? `${fallback}px` : fallback;
    result[`--r-mobile-${key}`] = valid(mobile) ? cssValue(mobile) : fallbackValue;
    result[`--r-desktop-${key}`] = valid(desktop) ? cssValue(desktop) : `var(--r-mobile-${key})`;
    result[target] = `var(--r-${key})`;
  }
  return result as CSSProperties;
}
