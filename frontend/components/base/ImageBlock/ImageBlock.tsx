import Image from "next/image";
import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { isSafeUrl } from "@/renderer/validation";
import { editorPreviewAttributes, stringProp } from "@/components/base/utils";

export function ImageBlock({
  componentLabel,
  editorPreviewDepth,
  isEditorPreview,
  isSelected,
  onSelectClick,
  props
}: RendererComponentProps) {
  const src = stringProp(props, "src", "");
  const alt = stringProp(props, "alt", "");

  if (!src || !isSafeUrl(src)) {
    return null;
  }

  return (
    <span
      {...editorPreviewAttributes({
        className: "base-image-wrap",
        componentLabel,
        editorPreviewDepth,
        isEditorPreview,
        isSelected,
        onSelectClick
      })}
    >
      <Image
        className="base-image"
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 720px) 100vw, 50vw"
        unoptimized
      />
    </span>
  );
}
