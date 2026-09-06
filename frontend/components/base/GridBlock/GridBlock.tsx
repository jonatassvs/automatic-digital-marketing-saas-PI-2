import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp } from "@/components/base/utils";

export function GridBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props,
  children
}: RendererComponentProps) {
  const columns = Math.min(Math.max(numberProp(props, "columns", 3), 1), 4);
  const gap = numberProp(props, "gap", 20);

  return (
    <div
      {...editorPreviewAttributes({
        className: "base-grid",
        componentLabel,
        editorPreviewDepth,
        id,
        isEditorPreview,
        isSelected,
        onSelectClick
      })}
      style={{
        gap,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
}
