import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { CSSProperties, ReactNode } from "react";

type GridBlockProps = ResponsiveProps & {
  children?: ReactNode;
  columns?: number;
  gap?: number;
  id?: string;
};

// Arranges child components in a responsive column grid.
export function GridBlock({ responsiveProps, children, columns = 3, gap = 20, id }: GridBlockProps) {
  const safeColumns = Math.min(Math.max(columns, 1), 4);

  return (
    <div
      className="base-grid responsive-component"
      id={id}
      style={responsiveStyle({
        gap,
        "--grid-columns": `repeat(${safeColumns}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`
      } as CSSProperties, responsiveProps)}
    >
      {children}
    </div>
  );
}
