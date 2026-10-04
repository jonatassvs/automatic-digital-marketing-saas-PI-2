import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { CSSProperties } from "react";
import { appearanceStyle, type AppearanceProps } from "@/components/base/appearance";
type ImageBlockProps = ResponsiveProps & AppearanceProps & {
  alt?: string; id?: string; src?: string; aspectRatio?: string;
  objectFit?: CSSProperties["objectFit"]; objectPositionX?: number; objectPositionY?: number;
  backgroundColor?: string; loading?: "lazy" | "eager";
};
export function ImageBlock({ alt = "", id, src = "", aspectRatio = "4 / 3",
  objectFit = "cover", objectPositionX = 50, objectPositionY = 50,
  backgroundColor = "#ffffff", loading = "lazy", responsiveProps, ...appearance }: ImageBlockProps) {
  if (!src) return null;
  // Native intrinsic sizing supports automatic height for arbitrary user image URLs.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="base-image responsive-component" id={id} src={src} alt={alt} loading={loading} decoding="async"
      style={responsiveStyle({ ...appearanceStyle(appearance), display: "block",
        width: appearance.width ? `${appearance.width}${appearance.widthUnit ?? "px"}` : "100%",
        height: appearance.height ? `${appearance.height}${appearance.heightUnit ?? "px"}` : "auto",
        aspectRatio: appearance.height ? undefined : aspectRatio, objectFit,
        objectPosition: `${objectPositionX}% ${objectPositionY}%`, backgroundColor }, responsiveProps)} />
  );
}
