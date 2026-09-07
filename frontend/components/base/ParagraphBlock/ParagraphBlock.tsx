type ParagraphBlockProps = {
  color?: string;
  id?: string;
  text?: string;
};

// Renders editable body copy for landing page sections.
export function ParagraphBlock({
  color = "#475569",
  id,
  text = "Escreva uma mensagem clara para seus clientes."
}: ParagraphBlockProps) {
  return (
    <p id={id} style={{ color }}>
      {text}
    </p>
  );
}
