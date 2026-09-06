import type { ComponentProps } from "@/types/page";
import type { MouseEventHandler } from "react";

export function stringProp(props: ComponentProps, key: string, fallback = "") {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

export function numberProp(props: ComponentProps, key: string, fallback: number) {
  const value = props[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function optionProp<T extends string>(
  props: ComponentProps,
  key: string,
  allowed: readonly T[],
  fallback: T
) {
  const value = props[key];
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

type EditorPreviewAttributesParams = {
  className?: string;
  componentLabel?: string;
  editorPreviewDepth?: number;
  isEditorPreview?: boolean;
  isSelected?: boolean;
  onSelectClick?: MouseEventHandler<HTMLElement>;
};

export function editorPreviewAttributes({
  className,
  componentLabel,
  editorPreviewDepth,
  isEditorPreview,
  isSelected,
  onSelectClick
}: EditorPreviewAttributesParams) {
  const classNames = [
    className,
    isEditorPreview ? "editor-preview-component" : undefined,
    isSelected ? "editor-selected-component" : undefined
  ]
    .filter(Boolean)
    .join(" ");

  return {
    className: classNames || undefined,
    "data-editor-depth": isEditorPreview ? editorPreviewDepth : undefined,
    "data-editor-component-label": isEditorPreview ? componentLabel : undefined,
    onClick: isEditorPreview ? onSelectClick : undefined
  };
}
