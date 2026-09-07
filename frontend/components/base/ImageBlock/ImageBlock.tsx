import Image from "next/image";

type ImageBlockProps = {
  alt?: string;
  id?: string;
  src?: string;
};

// Renders an optimized image inside a stable aspect-ratio wrapper.
export function ImageBlock({ alt = "", id, src = "" }: ImageBlockProps) {
  if (!src) {
    return null;
  }

  return (
    <span className="base-image-wrap" id={id}>
      <Image
        className="base-image"
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 720px) 100vw, 50vw"
        unoptimized
      />
    </span>
  );
}
