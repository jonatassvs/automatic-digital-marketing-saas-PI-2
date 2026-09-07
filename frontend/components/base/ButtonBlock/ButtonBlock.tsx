type ButtonBlockProps = {
  href?: string;
  id?: string;
  text?: string;
  variant?: "primary" | "secondary";
};

// Renders a link styled as a call-to-action button.
export function ButtonBlock({
  href = "#",
  id,
  text = "Fale conosco",
  variant = "primary"
}: ButtonBlockProps) {
  return (
    <a className={`base-button base-button-${variant}`} href={href} id={id}>
      {text}
    </a>
  );
}
