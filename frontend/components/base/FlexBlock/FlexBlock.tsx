import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp, optionProp } from "@/components/base/utils";

export function FlexBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props,
  children
}: RendererComponentProps) {
  const direction = optionProp(props, "direction", ["row", "column"] as const, "row");
  const align = optionProp(
    props,
    "align",
    ["flex-start", "center", "stretch"] as const,
    "stretch"
  );
  const gap = numberProp(props, "gap", 16);

  return (
    <div
      {...editorPreviewAttributes({
        className: "base-flex",
        componentLabel,
        editorPreviewDepth,
        id,
        isEditorPreview,
        isSelected,
        onSelectClick
      })}
      style={{ alignItems: align, flexDirection: direction, gap }}
    >
      {children}
    </div>
  );
}
