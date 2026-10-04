import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { CSSProperties, HTMLAttributes } from "react";
import { appearanceStyle, type AppearanceProps } from "@/components/base/appearance";
type ButtonBlockProps = ResponsiveProps & AppearanceProps & {
  fontFamily?: string;
  editorTextProps?: HTMLAttributes<HTMLElement>;
  linkTarget?: "_self" | "_blank";
  href?: string; id?: string; text?: string; variant?: "primary" | "secondary";
  newTab?: boolean; customColors?: boolean; backgroundColor?: string; color?: string;
  hoverBackgroundColor?: string; hoverColor?: string; hoverBorderColor?: string;
  fontSize?: number; fontWeight?: string; textTransform?: CSSProperties["textTransform"];
  paddingX?: number; paddingY?: number; transitionDuration?: number;
  hoverEffect?: "none" | "lift" | "grow";
};
export function ButtonBlock({ href = "#", id, text = "Fale conosco", variant = "primary",
  fontFamily, editorTextProps, linkTarget, newTab = false, customColors = false, backgroundColor = "#0f766e", color = "#ffffff",
  hoverBackgroundColor = "#115e59", hoverColor = "#ffffff", hoverBorderColor = "#115e59",
  fontSize = 16, fontWeight = "800", textTransform = "none", paddingX = 18, paddingY = 13,
  transitionDuration = 150, hoverEffect = "none", responsiveProps, ...appearance }: ButtonBlockProps) {
  const secondary = variant === "secondary";
  const style = {
    fontFamily,
    ...appearanceStyle(appearance), borderColor: undefined,
    "--button-background": customColors ? backgroundColor : secondary ? "#e5e7eb" : "#0f766e",
    "--button-color": customColors ? color : secondary ? "#111827" : "#ffffff",
    "--button-hover-background": customColors ? hoverBackgroundColor : secondary ? "#d1d5db" : "#115e59",
    "--button-hover-color": customColors ? hoverColor : secondary ? "#111827" : "#ffffff",
    "--button-border": appearance.borderColor ?? "#d7dde5",
    "--button-hover-border": customColors ? hoverBorderColor : appearance.borderColor ?? "#d7dde5",
    "--button-hover-transform": hoverEffect === "lift" ? "translateY(-2px)" : hoverEffect === "grow" ? "scale(1.03)" : "none",
    "--button-transition": `${transitionDuration}ms`,
    width: appearance.width ? `${appearance.width}${appearance.widthUnit ?? "px"}` : "fit-content",
    fontSize: `${fontSize / 16}rem`, fontWeight: Number(fontWeight), textTransform,
    paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX
  } as CSSProperties;
  return <a className="base-button responsive-component" href={href} id={id} style={responsiveStyle(style, responsiveProps, true)}
    target={linkTarget ?? (newTab ? "_blank" : "_self")} rel={(linkTarget ?? (newTab ? "_blank" : "_self")) === "_blank" ? "noopener noreferrer" : undefined}
    onClick={editorTextProps ? event => event.preventDefault() : undefined}>
      <span {...editorTextProps}>{text}</span>
    </a>;
}
