import type { ReactNode } from "react";

type FlexBlockProps = {
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
  gap = 16,
  id
}: FlexBlockProps) {
  return (
    <div className="base-flex" id={id} style={{ alignItems: align, flexDirection: direction, gap }}>
      {children}
    </div>
  );
}
