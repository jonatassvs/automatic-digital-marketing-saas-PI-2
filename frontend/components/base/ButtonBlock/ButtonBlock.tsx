import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { isSafeUrl } from "@/renderer/validation";
import { editorPreviewAttributes, optionProp, stringProp } from "@/components/base/utils";

export function ButtonBlock({
  componentLabel,
  editorPreviewDepth,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const text = stringProp(props, "text", "Fale conosco");
  const href = stringProp(props, "href", "#");
  const safeHref = isSafeUrl(href) ? href : "#";
  const variant = optionProp(props, "variant", ["primary", "secondary"] as const, "primary");

  return (
    <a
      {...editorPreviewAttributes({
        className: `base-button base-button-${variant}`,
        componentLabel,
        editorPreviewDepth,
        isEditorPreview,
        isSelected,
        onSelectClick
      })}
      href={safeHref}
    >
      {text}
    </a>
  );
}
