import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { ReactNode } from "react";

type ContainerBlockProps = ResponsiveProps & {
  align?: "left" | "center";
  children?: ReactNode;
  id?: string;
  maxWidth?: number;
};

// Constrains page content to a readable width.
export function ContainerBlock({
  align = "left",
  children,
  id,
  responsiveProps,
  maxWidth = 1120
}: ContainerBlockProps) {
  return (
    <div
      className="responsive-component"
      id={id}
      style={responsiveStyle({
        maxWidth,
        marginInline: "auto",
        paddingInline: 24,
        textAlign: align
      }, responsiveProps)}
    >
      {children}
    </div>
  );
}
