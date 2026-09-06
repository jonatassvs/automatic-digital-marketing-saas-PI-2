import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp, stringProp } from "@/components/base/utils";

export function HeadingBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const level = Math.min(Math.max(numberProp(props, "level", 2), 1), 3);
  const text = stringProp(props, "text", "Novo titulo");
  const color = stringProp(props, "color", "#17202a");
  const Tag = `h${level}` as "h1" | "h2" | "h3";

  return (
    <Tag
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, isEditorPreview, isSelected, onSelectClick })}
      id={id}
      style={{ color }}
    >
      {text}
    </Tag>
  );
}
