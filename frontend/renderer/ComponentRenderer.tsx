import type { MouseEvent } from "react";
import type { PageComponent } from "@/types/page";
import { componentRegistry } from "@/renderer/componentRegistry";

type ComponentRendererProps = {
  component: PageComponent;
  depth?: number;
  onSelectComponent?: (id: string) => void;
  selectedId?: string;
};

export function ComponentRenderer({
  component,
  depth = 0,
  onSelectComponent,
  selectedId
}: ComponentRendererProps) {
  const RegisteredComponent = componentRegistry[component.component];

  if (!RegisteredComponent) {
    return (
      <div role="alert" className="renderer-warning">
        Componente indisponivel.
      </div>
    );
  }

  function handleSelectClick(event: MouseEvent<HTMLElement>) {
    if (!onSelectComponent) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onSelectComponent(component.id);
  }

  return (
    <RegisteredComponent
      componentLabel={component.component}
      editorPreviewDepth={depth}
      id={component.id}
      isEditorPreview={Boolean(onSelectComponent)}
      isSelected={component.id === selectedId}
      onSelect={onSelectComponent}
      onSelectClick={handleSelectClick}
      props={component.props}
    >
      {component.children?.map((child) => (
        <ComponentRenderer
          key={child.id}
          component={child}
          depth={depth + 1}
          onSelectComponent={onSelectComponent}
          selectedId={selectedId}
        />
      ))}
    </RegisteredComponent>
  );
}

type PageRendererProps = {
  components: PageComponent[];
  onSelectComponent?: (id: string) => void;
  selectedId?: string;
};

export function PageRenderer({ components, onSelectComponent, selectedId }: PageRendererProps) {
  return (
    <main>
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          depth={0}
          onSelectComponent={onSelectComponent}
          selectedId={selectedId}
        />
      ))}
    </main>
  );
}
