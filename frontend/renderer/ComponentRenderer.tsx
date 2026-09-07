import type { FocusEvent, MouseEvent, PropsWithChildren, ReactNode } from "react";
import type { PageComponent } from "@/types/page";
import { componentRegistry } from "@/renderer/componentRegistry";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";
import { normalizeProps } from "@/renderer/normalizeProps";

type ComponentRendererProps = {
  component: PageComponent;
  depth?: number;
  onSelectComponent?: (id: string) => void;
  onUpdateComponentProp?: (id: string, fieldName: string, value: unknown) => void;
  selectedId?: string;
};

type EditorComponentFrameProps = PropsWithChildren<{
  component: PageComponent;
  depth: number;
  isSelected: boolean;
  onSelectComponent?: (id: string) => void;
}>;

function EditorComponentFrame({
  children,
  component,
  depth,
  isSelected,
  onSelectComponent
}: EditorComponentFrameProps) {
  function handleSelectClick(event: MouseEvent<HTMLElement>) {
    if (!onSelectComponent) {
      return;
    }

    if (!(event.target as HTMLElement).closest("[data-editor-inline-text]")) {
      event.preventDefault();
    }

    event.stopPropagation();
    onSelectComponent(component.id);
  }

  return (
    <div
      className={isSelected ? "editor-preview-component editor-selected-component" : "editor-preview-component"}
      data-editor-component-id={component.id}
      data-editor-component-label={component.component}
      data-editor-depth={depth}
      onClick={handleSelectClick}
    >
      {children}
    </div>
  );
}

type RichTextSegment = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  text: string;
  underline?: boolean;
};

function mergeSegments(segments: RichTextSegment[]) {
  return segments.reduce<RichTextSegment[]>((merged, segment) => {
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

function readRichTextSegments(element: HTMLElement) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const segments: RichTextSegment[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue ?? "";

    if (!text) {
      continue;
    }

    const parentElement = node.parentElement;
    const segmentElement = parentElement?.closest<HTMLElement>("[data-rich-text-segment]");

    segments.push({
      bold: segmentElement?.dataset.richBold === "true" || undefined,
      italic: segmentElement?.dataset.richItalic === "true" || undefined,
      strike: segmentElement?.dataset.richStrike === "true" || undefined,
      text,
      underline: segmentElement?.dataset.richUnderline === "true" || undefined
    });
  }

  return mergeSegments(segments);
}

export function ComponentRenderer({
  component,
  depth = 0,
  onSelectComponent,
  onUpdateComponentProp,
  selectedId
}: ComponentRendererProps) {
  const RegisteredComponent = componentRegistry[component.component];
  const schema = componentSchemas[component.component];

  if (!RegisteredComponent || !schema) {
    return (
      <div role="alert" className="renderer-warning">
        Componente indisponivel.
      </div>
    );
  }

  const renderedChildren = component.children?.map((child) => (
    <ComponentRenderer
      key={child.id}
      component={child}
      depth={depth + 1}
      onSelectComponent={onSelectComponent}
      onUpdateComponentProp={onUpdateComponentProp}
      selectedId={selectedId}
    />
  ));
  const isEditableTextComponent = component.component === "Text";
  const editorTextProps =
    onUpdateComponentProp && isEditableTextComponent
      ? {
          contentEditable: true,
          "data-editor-inline-text": true,
          suppressContentEditableWarning: true,
          onBlur: (event: FocusEvent<HTMLElement>) => {
            const nextText = event.currentTarget.innerText.trimEnd();
            const nextRichText = readRichTextSegments(event.currentTarget);

            if (nextText && nextText !== component.props.text) {
              onUpdateComponentProp(component.id, "text", nextText);
            }

            onUpdateComponentProp(component.id, "richText", nextRichText);
          }
        }
      : undefined;
  const renderedComponent = (
    <RegisteredComponent id={component.id} {...normalizeProps(schema, component.props)} editorTextProps={editorTextProps}>
      {renderedChildren}
    </RegisteredComponent>
  );

  if (!onSelectComponent) {
    return renderedComponent;
  }

  return (
    <EditorComponentFrame
      component={component}
      depth={depth}
      isSelected={component.id === selectedId}
      onSelectComponent={onSelectComponent}
    >
      {renderedComponent}
    </EditorComponentFrame>
  );
}

type PageRendererProps = {
  components: PageComponent[];
  onSelectComponent?: (id: string) => void;
  onUpdateComponentProp?: (id: string, fieldName: string, value: unknown) => void;
  renderRootInsertControl?: (insertIndex: number) => ReactNode;
  selectedId?: string;
};

export function PageRenderer({
  components,
  onSelectComponent,
  onUpdateComponentProp,
  renderRootInsertControl,
  selectedId
}: PageRendererProps) {
  return (
    <main>
      {renderRootInsertControl?.(0)}
      {components.map((component, index) => (
        <div className="editor-root-component-slot" key={component.id}>
          <ComponentRenderer
            component={component}
            depth={0}
            onSelectComponent={onSelectComponent}
            onUpdateComponentProp={onUpdateComponentProp}
            selectedId={selectedId}
          />
          {renderRootInsertControl?.(index + 1)}
        </div>
      ))}
    </main>
  );
}
