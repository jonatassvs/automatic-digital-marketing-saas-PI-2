import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { editorPreviewAttributes, numberProp, stringProp } from "@/components/base/utils";

export function SectionBlock({
  componentLabel,
  editorPreviewDepth,
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
      {...editorPreviewAttributes({ componentLabel, editorPreviewDepth, isEditorPreview, isSelected, onSelectClick })}
      style={{ background, paddingBlock: paddingY }}
    >
      {children}
    </section>
  );
}
