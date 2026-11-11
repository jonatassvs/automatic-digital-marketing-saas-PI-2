import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { ReactNode } from "react";

type SectionBlockProps = ResponsiveProps & {
  background?: string;
  children?: ReactNode;
  id?: string;
  paddingY?: number;
};

// Creates a full-width section band that can contain nested components.
export function SectionBlock({
  background = "#ffffff",
  children,
  id,
  responsiveProps,
  paddingY = 72
}: SectionBlockProps) {
  return (
    <section className="responsive-component" id={id} style={responsiveStyle({ background, paddingBlock: paddingY }, responsiveProps)}>
      {children}
    </section>
  );
}
