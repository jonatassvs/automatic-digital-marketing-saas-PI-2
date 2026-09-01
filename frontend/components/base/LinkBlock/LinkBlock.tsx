import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { isSafeUrl } from "@/renderer/validation";
import { stringProp } from "@/components/base/utils";

export function LinkBlock({ props }: RendererComponentProps) {
  const text = stringProp(props, "text", "Saiba mais");
  const href = stringProp(props, "href", "#");
  const safeHref = isSafeUrl(href) ? href : "#";

  return (
    <a className="base-link" href={safeHref}>
      {text}
    </a>
  );
}
