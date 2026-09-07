import type { ReactNode } from "react";

type SectionBlockProps = {
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
  paddingY = 72
}: SectionBlockProps) {
  return (
    <section id={id} style={{ background, paddingBlock: paddingY }}>
      {children}
    </section>
  );
}
