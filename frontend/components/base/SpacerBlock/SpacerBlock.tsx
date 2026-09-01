import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { numberProp } from "@/components/base/utils";

export function SpacerBlock({ props }: RendererComponentProps) {
  const height = numberProp(props, "height", 24);

  return <div aria-hidden="true" style={{ height }} />;
}
