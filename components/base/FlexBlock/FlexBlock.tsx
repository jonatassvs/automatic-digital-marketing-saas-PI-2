import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { ReactNode } from "react";

type FlexBlockProps = ResponsiveProps & {
  align?: "flex-start" | "center" | "stretch";
  children?: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  id?: string;
};

// Arranges child components in a flexible row or column.
export function FlexBlock({
  align = "stretch",
  children,
  direction = "row",
  responsiveProps,
  gap = 16,
  id
}: FlexBlockProps) {
  return (
    <div className="base-flex responsive-component" id={id} style={responsiveStyle({ alignItems: align, flexDirection: direction, gap }, responsiveProps)}>
      {children}
    </div>
  );
}
