import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp, optionProp } from "@/components/base/utils";

export function ContainerBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props,
  children
}: RendererComponentProps) {
  const maxWidth = numberProp(props, "maxWidth", 1120);
  const align = optionProp(props, "align", ["left", "center"] as const, "left");

  return (
    <div
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, id, isEditorPreview, isSelected, onSelectClick })}
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
