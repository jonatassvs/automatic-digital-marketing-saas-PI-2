import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { isSafeUrl } from "@/renderer/validation";
import { editorPreviewAttributes, stringProp } from "@/components/base/utils";

export function LinkBlock({
  componentLabel,
  editorPreviewDepth,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const text = stringProp(props, "text", "Saiba mais");
  const href = stringProp(props, "href", "#");
  const safeHref = isSafeUrl(href) ? href : "#";

  return (
    <a
      {...editorPreviewAttributes({
        className: "base-link",
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
