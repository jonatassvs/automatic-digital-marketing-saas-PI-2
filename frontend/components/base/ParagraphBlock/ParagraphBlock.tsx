import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, stringProp } from "@/components/base/utils";

export function ParagraphBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const text = stringProp(props, "text", "Escreva uma mensagem clara para seus clientes.");
  const color = stringProp(props, "color", "#475569");

  return (
    <p
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, id, isEditorPreview, isSelected, onSelectClick })}
      style={{ color }}
    >
      {text}
    </p>
  );
}
