import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { ReactNode } from "react";

export type FooterBlockProps = ResponsiveProps & {
  background?: string;
  children?: ReactNode;
  id?: string;
  paddingY?: number;
};

// Semantic footer organism that composes existing layout and content components as children.
export function FooterBlock({
  background = "#0f172a",
  children,
  id,
  responsiveProps,
  paddingY = 56
}: FooterBlockProps) {
  return (
    <footer
      className="base-footer responsive-component"
      id={id}
      style={responsiveStyle({ background, paddingBlock: paddingY, paddingInline: 20 }, responsiveProps)}
    >
      {children}
    </footer>
  );
}
