import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { isSafeUrl } from "@/renderer/validation";
import { optionProp, stringProp } from "@/components/base/utils";

export function ButtonBlock({ props }: RendererComponentProps) {
  const text = stringProp(props, "text", "Fale conosco");
  const href = stringProp(props, "href", "#");
  const safeHref = isSafeUrl(href) ? href : "#";
  const variant = optionProp(props, "variant", ["primary", "secondary"] as const, "primary");

  return (
    <a className={`base-button base-button-${variant}`} href={safeHref}>
      {text}
    </a>
  );
}
