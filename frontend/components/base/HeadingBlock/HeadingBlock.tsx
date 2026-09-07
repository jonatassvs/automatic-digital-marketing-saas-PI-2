type HeadingBlockProps = {
  color?: string;
  id?: string;
  level?: number;
  text?: string;
};

// Renders semantic page headings from level 1 to level 3.
export function HeadingBlock({
  color = "#17202a",
  id,
  level = 2,
  text = "Novo titulo"
}: HeadingBlockProps) {
  const safeLevel = Math.min(Math.max(level, 1), 3);
  const Tag = `h${safeLevel}` as "h1" | "h2" | "h3";

  return (
    <Tag id={id} style={{ color }}>
      {text}
    </Tag>
  );
}
