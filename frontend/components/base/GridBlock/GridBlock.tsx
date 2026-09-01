import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { numberProp } from "@/components/base/utils";

export function GridBlock({ props, children }: RendererComponentProps) {
  const columns = Math.min(Math.max(numberProp(props, "columns", 3), 1), 4);
  const gap = numberProp(props, "gap", 20);

  return (
    <div
      className="base-grid"
      style={{
        gap,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
}
