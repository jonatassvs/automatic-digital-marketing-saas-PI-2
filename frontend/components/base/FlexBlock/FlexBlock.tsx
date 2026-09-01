import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { numberProp, optionProp } from "@/components/base/utils";

export function FlexBlock({ props, children }: RendererComponentProps) {
  const direction = optionProp(props, "direction", ["row", "column"] as const, "row");
  const align = optionProp(
    props,
    "align",
    ["flex-start", "center", "stretch"] as const,
    "stretch"
  );
  const gap = numberProp(props, "gap", 16);

  return (
    <div className="base-flex" style={{ alignItems: align, flexDirection: direction, gap }}>
      {children}
    </div>
  );
}
