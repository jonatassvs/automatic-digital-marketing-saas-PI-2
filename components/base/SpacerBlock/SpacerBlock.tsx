import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
type SpacerBlockProps = ResponsiveProps & {
  height?: number;
  id?: string;
};

// Adds vertical spacing without visible content.
export function SpacerBlock({ responsiveProps, height = 24, id }: SpacerBlockProps) {
  return <div className="responsive-component" aria-hidden="true" id={id} style={responsiveStyle({ height }, responsiveProps)} />;
}
