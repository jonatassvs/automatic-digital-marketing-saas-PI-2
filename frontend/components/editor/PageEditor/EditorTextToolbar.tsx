import type { CSSProperties, MouseEvent } from "react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import type { PageComponent } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

type EditorTextToolbarBounds = {
  left: number;
  top: number;
  width: number;
};

type EditorTextToolbarProps = {
  bounds?: EditorTextToolbarBounds;
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  onUpdateComponentProp: (id: string, fieldName: string, value: unknown) => void;
};

type RichTextMark = "bold" | "italic" | "strike" | "underline";

type RichTextSegment = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  text: string;
  underline?: boolean;
};

function getValue(component: PageComponent, fieldName: string, fallback: boolean | string | number) {
  return component.props[fieldName] ?? fallback;
}

function getOptions(schema: ComponentSchema | undefined, fieldName: string) {
  return schema?.fields.find((field) => field.name === fieldName)?.options ?? [];
}

function stopToolbarClick(event: MouseEvent<HTMLDivElement>) {
  event.stopPropagation();
}

function isRichTextSegment(value: unknown): value is RichTextSegment {
  return Boolean(value && typeof value === "object" && typeof (value as RichTextSegment).text === "string");
}

function getTextSegments(component: PageComponent): RichTextSegment[] {
  const richText = component.props.richText;

  if (Array.isArray(richText) && richText.every(isRichTextSegment) && richText.length > 0) {
    return richText.filter((segment) => segment.text.length > 0);
  }

  return [
    {
      bold: Boolean(component.props.bold) || undefined,
      italic: Boolean(component.props.italic) || undefined,
      strike: Boolean(component.props.strike) || undefined,
      text: String(component.props.text ?? ""),
      underline: Boolean(component.props.underline) || undefined
    }
  ];
}

function mergeSegments(segments: RichTextSegment[]) {
  return segments.reduce<RichTextSegment[]>((merged, segment) => {
    if (!segment.text) {
      return merged;
    }

    const previous = merged.at(-1);

    if (
      previous &&
      Boolean(previous.bold) === Boolean(segment.bold) &&
      Boolean(previous.italic) === Boolean(segment.italic) &&
      Boolean(previous.strike) === Boolean(segment.strike) &&
      Boolean(previous.underline) === Boolean(segment.underline)
    ) {
      previous.text += segment.text;
      return merged;
    }

    return [...merged, segment];
  }, []);
}

function getEditableTextElement(componentId: string) {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-editor-component-id]"))
    .find((element) => element.dataset.editorComponentId === componentId)
    ?.querySelector<HTMLElement>("[data-editor-inline-text]");
}

function getTextOffset(root: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(root);
  range.setEnd(node, offset);

  return range.toString().length;
}

function getSelectedRange(componentId: string, textLength: number) {
  const selection = window.getSelection();
  const editableElement = getEditableTextElement(componentId);

  if (!selection || !editableElement || selection.rangeCount === 0) {
    return { end: textLength, start: 0 };
  }

  const range = selection.getRangeAt(0);

  if (!editableElement.contains(range.commonAncestorContainer)) {
    return { end: textLength, start: 0 };
  }

  const start = getTextOffset(editableElement, range.startContainer, range.startOffset);
  const end = getTextOffset(editableElement, range.endContainer, range.endOffset);

  if (start === end) {
    return { end: textLength, start: 0 };
  }

  return {
    end: Math.max(start, end),
    start: Math.min(start, end)
  };
}

function shouldEnableMark(segments: RichTextSegment[], start: number, end: number, mark: RichTextMark) {
  let cursor = 0;

  return segments.some((segment) => {
    const segmentStart = cursor;
    const segmentEnd = cursor + segment.text.length;
    cursor = segmentEnd;

    return segmentStart < end && segmentEnd > start && !segment[mark];
  });
}

function applyMarkToRange(segments: RichTextSegment[], start: number, end: number, mark: RichTextMark) {
  const enableMark = shouldEnableMark(segments, start, end, mark);
  let cursor = 0;

  return mergeSegments(
    segments.flatMap((segment) => {
      const segmentStart = cursor;
      const segmentEnd = cursor + segment.text.length;
      cursor = segmentEnd;

      if (segmentEnd <= start || segmentStart >= end) {
        return [segment];
      }

      const localStart = Math.max(0, start - segmentStart);
      const localEnd = Math.min(segment.text.length, end - segmentStart);
      const parts: RichTextSegment[] = [];

      if (localStart > 0) {
        parts.push({ ...segment, text: segment.text.slice(0, localStart) });
      }

      parts.push({
        ...segment,
        [mark]: enableMark || undefined,
        text: segment.text.slice(localStart, localEnd)
      });

      if (localEnd < segment.text.length) {
        parts.push({ ...segment, text: segment.text.slice(localEnd) });
      }

      return parts;
    })
  );
}

// Shows text formatting controls directly on the canvas for WYSIWYG editing.
export function EditorTextToolbar({
  bounds,
  selectedComponent,
  selectedSchema,
  onUpdateComponentProp
}: EditorTextToolbarProps) {
  if (!bounds || !selectedComponent || selectedComponent.component !== "Text") {
    return null;
  }

  const component = selectedComponent;
  const textType = String(getValue(component, "type", "paragraph"));
  const useDesktopFontSize = Boolean(getValue(component, "useDesktopFontSize", false));
  const style = {
    "--editor-text-toolbar-left": `${bounds.left}px`,
    "--editor-text-toolbar-top": `${bounds.top}px`,
    "--editor-text-toolbar-width": `${bounds.width}px`
  } as CSSProperties;
  const segments = getTextSegments(component);
  const plainText = segments.map((segment) => segment.text).join("");

  function formatSelection(mark: RichTextMark) {
    const range = getSelectedRange(component.id, plainText.length);
    const nextSegments = applyMarkToRange(segments, range.start, range.end, mark);

    onUpdateComponentProp(component.id, "text", nextSegments.map((segment) => segment.text).join(""));
    onUpdateComponentProp(component.id, "richText", nextSegments);
  }

  return (
    <div className="editor-text-toolbar" style={style} onClick={stopToolbarClick}>
      <label>
        Tipo
        <select
          value={textType}
          onChange={(event) => onUpdateComponentProp(component.id, "type", event.target.value)}
        >
          {getOptions(selectedSchema, "type").map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {textType === "heading" ? (
        <label>
          Level
          <select
            value={String(getValue(component, "level", "h2"))}
            onChange={(event) => onUpdateComponentProp(component.id, "level", event.target.value)}
          >
            {getOptions(selectedSchema, "level").map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {textType === "list" ? (
        <label>
          Lista
          <select
            value={String(getValue(component, "listType", "ul"))}
            onChange={(event) => onUpdateComponentProp(component.id, "listType", event.target.value)}
          >
            {getOptions(selectedSchema, "listType").map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="editor-text-format-group" aria-label="Formatacao do texto">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => formatSelection("bold")}
          title="Negrito"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => formatSelection("italic")}
          title="Italico"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => formatSelection("underline")}
          title="Sublinhado"
        >
          <Underline size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => formatSelection("strike")}
          title="Riscado"
        >
          <Strikethrough size={15} />
        </button>
      </div>

      <label>
        Alinhar
        <select
          value={String(getValue(component, "align", "left"))}
          onChange={(event) => onUpdateComponentProp(component.id, "align", event.target.value)}
        >
          {getOptions(selectedSchema, "align").map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cor
        <input
          type="color"
          value={String(getValue(component, "color", "#17202a"))}
          onChange={(event) => onUpdateComponentProp(component.id, "color", event.target.value)}
        />
      </label>

      <label>
        Fonte
        <input
          min={8}
          max={120}
          type="number"
          value={String(getValue(component, "fontSizeMobile", 24))}
          onChange={(event) => onUpdateComponentProp(component.id, "fontSizeMobile", Number(event.target.value))}
        />
      </label>

      <label className="text-toolbar-checkbox">
        <input
          checked={useDesktopFontSize}
          type="checkbox"
          onChange={(event) => onUpdateComponentProp(component.id, "useDesktopFontSize", event.target.checked)}
        />
        Desktop diferente
      </label>

      {useDesktopFontSize ? (
        <label>
          Desktop
          <input
            min={8}
            max={120}
            type="number"
            value={String(getValue(component, "fontSizeDesktop", 32))}
            onChange={(event) =>
              onUpdateComponentProp(component.id, "fontSizeDesktop", Number(event.target.value))
            }
          />
        </label>
      ) : null}
    </div>
  );
}
