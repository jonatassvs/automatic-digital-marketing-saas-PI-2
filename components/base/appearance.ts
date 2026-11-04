import type { CSSProperties } from "react";
export type AppearanceProps = {
  width?: number; widthUnit?: "px" | "%" | "vw" | "rem";
  height?: number; heightUnit?: "px" | "vh" | "rem";
  borderRadius?: number; borderWidth?: number; borderStyle?: "solid" | "dashed" | "dotted" | "double";
  borderColor?: string; opacity?: number; shadow?: "none" | "soft" | "medium" | "strong";
  marginTop?: number; marginBottom?: number; alignment?: "left" | "center" | "right";
};
const shadows = { none: "none", soft: "0 2px 8px rgb(0 0 0 / 12%)", medium: "0 6px 20px rgb(0 0 0 / 18%)", strong: "0 12px 32px rgb(0 0 0 / 25%)" };
export function appearanceStyle(p: AppearanceProps): CSSProperties {
  return {
    width: p.width ? `${p.width}${p.widthUnit ?? "px"}` : undefined,
    height: p.height ? `${p.height}${p.heightUnit ?? "px"}` : undefined,
    maxWidth: "100%", borderRadius: p.borderRadius ?? 8, borderWidth: p.borderWidth ?? 0,
    borderStyle: p.borderStyle ?? "solid", borderColor: p.borderColor ?? "#d7dde5",
    opacity: (p.opacity ?? 100) / 100, boxShadow: shadows[p.shadow ?? "none"],
    marginTop: p.marginTop ?? 0, marginBottom: p.marginBottom ?? 0,
    marginLeft: p.alignment === "center" || p.alignment === "right" ? "auto" : 0,
    marginRight: p.alignment === "center" ? "auto" : 0
  };
}
