import { SectionBlock } from "@/components/base/SectionBlock";
import type { ResponsiveProps } from "@/components/base/responsiveStyle";
import type { ReactNode } from "react";

export type ContactBlockProps = ResponsiveProps & {
  background?: string;
  children?: ReactNode;
  id?: string;
  paddingY?: number;
};

// Reuses SectionBlock as the outer wrapper while its children compose Container, centered Title/Description and Grid (Image + WhatsApp Form).
export function ContactBlock({ background = "#f8fafc", paddingY = 72, ...props }: ContactBlockProps) {
  return <SectionBlock background={background} paddingY={paddingY} {...props} />;
}
