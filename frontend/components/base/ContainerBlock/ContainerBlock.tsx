import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { numberProp, optionProp } from "@/components/base/utils";

export function ContainerBlock({ props, children }: RendererComponentProps) {
  const maxWidth = numberProp(props, "maxWidth", 1120);
  const align = optionProp(props, "align", ["left", "center"] as const, "left");

  return (
    <div
      style={{
        maxWidth,
        marginInline: "auto",
        paddingInline: 24,
        textAlign: align
      }}
    >
      {children}
    </div>
  );
}
