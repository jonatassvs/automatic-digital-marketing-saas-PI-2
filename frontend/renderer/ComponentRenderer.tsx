import type { PageComponent } from "@/types/page";
import { componentRegistry } from "@/renderer/componentRegistry";

type ComponentRendererProps = {
  component: PageComponent;
};

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const RegisteredComponent = componentRegistry[component.component];

  if (!RegisteredComponent) {
    return (
      <div role="alert" className="renderer-warning">
        Componente indisponivel.
      </div>
    );
  }

  return (
    <RegisteredComponent id={component.id} props={component.props}>
      {component.children?.map((child) => (
        <ComponentRenderer key={child.id} component={child} />
      ))}
    </RegisteredComponent>
  );
}

type PageRendererProps = {
  components: PageComponent[];
};

export function PageRenderer({ components }: PageRendererProps) {
  return (
    <main>
      {components.map((component) => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
    </main>
  );
}
