import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { numberProp, stringProp } from "@/components/base/utils";

export function SectionBlock({ props, children }: RendererComponentProps) {
  const background = stringProp(props, "background", "#ffffff");
  const paddingY = numberProp(props, "paddingY", 72);

  return (
    <section style={{ background, paddingBlock: paddingY }}>
      {children}
    </section>
  );
}
