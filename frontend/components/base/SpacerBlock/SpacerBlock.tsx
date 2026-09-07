type SpacerBlockProps = {
  height?: number;
  id?: string;
};

// Adds vertical spacing without visible content.
export function SpacerBlock({ height = 24, id }: SpacerBlockProps) {
  return <div aria-hidden="true" id={id} style={{ height }} />;
}
