import type { ReactNode } from "react";

type ContainerBlockProps = {
  align?: "left" | "center";
  children?: ReactNode;
  id?: string;
  maxWidth?: number;
};

// Constrains page content to a readable width.
export function ContainerBlock({
  align = "left",
  children,
  id,
  maxWidth = 1120
}: ContainerBlockProps) {
  return (
    <div
      id={id}
      style={{
        maxWidth,
        marginInline: "auto",
        paddingInline: 24,
        textAlign: align
      }}
    >
      {children}
    </div>
  );
}
