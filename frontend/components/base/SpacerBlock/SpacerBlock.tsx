import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp } from "@/components/base/utils";

export function SpacerBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const height = numberProp(props, "height", 24);

  return (
    <div
      aria-hidden="true"
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, id, isEditorPreview, isSelected, onSelectClick })}
      style={{ height }}
    />
  );
}
