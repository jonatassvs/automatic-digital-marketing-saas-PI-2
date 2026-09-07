type LinkBlockProps = {
  href?: string;
  id?: string;
  text?: string;
};

// Renders a simple text link for navigation or supporting actions.
export function LinkBlock({ href = "#", id, text = "Saiba mais" }: LinkBlockProps) {
  return (
    <a className="base-link" href={href} id={id}>
      {text}
    </a>
  );
}
