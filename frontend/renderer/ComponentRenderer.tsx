import type { MouseEvent, PropsWithChildren, ReactNode } from "react";
import type { PageComponent } from "@/types/page";
import { componentRegistry } from "@/renderer/componentRegistry";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";
import { normalizeProps } from "@/renderer/normalizeProps";

type ComponentRendererProps = {
  component: PageComponent;
  depth?: number;
  onSelectComponent?: (id: string) => void;
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

    event.preventDefault();
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

export function ComponentRenderer({
  component,
  depth = 0,
  onSelectComponent,
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
      selectedId={selectedId}
    />
  ));
  const renderedComponent = (
    <RegisteredComponent id={component.id} {...normalizeProps(schema, component.props)}>
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
  renderRootInsertControl?: (insertIndex: number) => ReactNode;
  selectedId?: string;
};

export function PageRenderer({
  components,
  onSelectComponent,
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
            selectedId={selectedId}
          />
          {renderRootInsertControl?.(index + 1)}
        </div>
      ))}
    </main>
  );
}
