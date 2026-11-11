import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
type LinkBlockProps = ResponsiveProps & {
  href?: string;
  fontFamily?: string;
  id?: string;
  text?: string;
};

// Renders a simple text link for navigation or supporting actions.
export function LinkBlock({ fontFamily, responsiveProps, href = "#", id, text = "Saiba mais" }: LinkBlockProps) {
  return (
    <a className="base-link responsive-component" style={responsiveStyle({ fontFamily, display: "inline-block" }, responsiveProps)} href={href} id={id}>
      {text}
    </a>
  );
}
