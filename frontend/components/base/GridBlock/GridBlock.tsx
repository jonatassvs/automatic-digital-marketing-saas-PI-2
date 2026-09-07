import type { ReactNode } from "react";

type GridBlockProps = {
  children?: ReactNode;
  columns?: number;
  gap?: number;
  id?: string;
};

// Arranges child components in a responsive column grid.
export function GridBlock({ children, columns = 3, gap = 20, id }: GridBlockProps) {
  const safeColumns = Math.min(Math.max(columns, 1), 4);

  return (
    <div
      className="base-grid"
      id={id}
      style={{
        gap,
        gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
}
