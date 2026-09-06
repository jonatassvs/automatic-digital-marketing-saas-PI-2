import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp, stringProp } from "@/components/base/utils";

export function SectionBlock({
  componentLabel,
  editorPreviewDepth,
  id,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props,
  children
}: RendererComponentProps) {
  const background = stringProp(props, "background", "#ffffff");
  const paddingY = numberProp(props, "paddingY", 72);

  return (
    <section
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, id, isEditorPreview, isSelected, onSelectClick })}
      style={{ background, paddingBlock: paddingY }}
    >
      {children}
    </section>
  );
}
