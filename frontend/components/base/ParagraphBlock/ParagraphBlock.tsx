import type { RendererComponentProps } from "@/renderer/componentRegistry";
import { stringProp } from "@/components/base/utils";

export function ParagraphBlock({ props }: RendererComponentProps) {
  const text = stringProp(props, "text", "Escreva uma mensagem clara para seus clientes.");
  const color = stringProp(props, "color", "#475569");

  return <p style={{ color }}>{text}</p>;
}
