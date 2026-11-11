import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import type { CSSProperties, HTMLAttributes } from "react";

type TextTag =
  | "abbr"
  | "b"
  | "blockquote"
  | "cite"
  | "code"
  | "del"
  | "dfn"
  | "em"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "i"
  | "kbd"
  | "mark"
  | "ol"
  | "p"
  | "pre"
  | "q"
  | "s"
  | "samp"
  | "small"
  | "span"
  | "strong"
  | "sub"
  | "sup"
  | "time"
  | "u"
  | "ul"
  | "var";

type TextBlockProps = ResponsiveProps & {
  align?: "left" | "center" | "right";
  bold?: boolean;
  color?: string;
  editorTextProps?: HTMLAttributes<HTMLElement>;
  fontSizeDesktop?: number;
  fontSizeMobile?: number;
  fontFamily?: string;
  id?: string;
  italic?: boolean;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  listType?: "ol" | "ul";
  richText?: unknown;
  strike?: boolean;
  text?: string;
  type?: "code" | "heading" | "inline" | "list" | "paragraph" | "quote";
  underline?: boolean;
  useDesktopFontSize?: boolean;
};

type RichTextSegment = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  text: string;
  underline?: boolean;
};

const blockTags = new Set<TextTag>(["blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "p", "pre", "ul"]);

function isRichTextSegment(value: unknown): value is RichTextSegment {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as RichTextSegment).text === "string";
}

function getRichTextSegments(
  richText: unknown,
  text: string,
  fallbackMarks: Omit<RichTextSegment, "text">
): RichTextSegment[] {
  if (Array.isArray(richText) && richText.every(isRichTextSegment) && richText.length > 0) {
    return richText.filter((segment) => segment.text.length > 0);
  }

  return [{ ...fallbackMarks, text }];
}

function splitSegmentsByLine(segments: RichTextSegment[]) {
  return segments.reduce<RichTextSegment[][]>(
    (lines, segment) => {
      const parts = segment.text.split("\n");

      parts.forEach((part, index) => {
        if (index > 0) {
          lines.push([]);
        }

        if (part) {
          lines[lines.length - 1].push({ ...segment, text: part });
        }
      });

      return lines;
    },
    [[]]
  );
}

function renderSegments(segments: RichTextSegment[]) {
  return segments.map((segment, index) => (
    <span
      data-rich-bold={segment.bold ? "true" : undefined}
      data-rich-italic={segment.italic ? "true" : undefined}
      data-rich-strike={segment.strike ? "true" : undefined}
      data-rich-text-segment="true"
      data-rich-underline={segment.underline ? "true" : undefined}
      key={`${segment.text}-${index}`}
      style={{
        fontStyle: segment.italic ? "italic" : undefined,
        fontWeight: segment.bold ? 800 : undefined,
        textDecoration: [segment.underline ? "underline" : undefined, segment.strike ? "line-through" : undefined]
          .filter(Boolean)
          .join(" ")
      }}
    >
      {segment.text}
    </span>
  ));
}

// Renders all safe text-oriented HTML tags from a single editable text component.
export function TextBlock({
  fontFamily,
  responsiveProps,
  align = "left",
  bold = false,
  color = "#17202a",
  editorTextProps,
  fontSizeDesktop = 32,
  fontSizeMobile = 24,
  id,
  italic = false,
  level = "h2",
  listType = "ul",
  richText,
  strike = false,
  text = "Novo texto",
  type = "paragraph",
  underline = false,
  useDesktopFontSize = false
}: TextBlockProps) {
  const style = {
    "--text-font-size-desktop": `${(useDesktopFontSize ? fontSizeDesktop : fontSizeMobile) / 16}rem`,
    "--text-font-size-mobile": `${fontSizeMobile / 16}rem`,
    display: type === "inline" ? "inline-block" : undefined,
    fontFamily,
    color,
    textAlign: align
  } as CSSProperties;
  const segments = getRichTextSegments(richText, text, { bold, italic, strike, underline });

  if (type === "list") {
    const Tag = listType;
    const lines = splitSegmentsByLine(segments).filter((line) => line.length > 0);

    return (
      <Tag className="base-text responsive-component" id={id} style={responsiveStyle(style, responsiveProps)} {...editorTextProps}>
        {(lines.length ? lines : [[{ text: "Novo item" }]]).map((line, index) => (
          <li key={index}>{renderSegments(line)}</li>
        ))}
      </Tag>
    );
  }

  const Tag = (
    type === "heading" ? level : type === "quote" ? "blockquote" : type === "code" ? "pre" : type === "inline" ? "span" : "p"
  ) satisfies TextTag;

  return (
    <Tag
      className={blockTags.has(Tag) ? "base-text responsive-component" : "base-text base-text-inline responsive-component"}
      id={id}
      style={responsiveStyle(style, responsiveProps)}
      {...editorTextProps}
    >
      {renderSegments(segments)}
    </Tag>
  );
}
