import { useMemo, useState } from "react";
import type { ComponentName, LandingPageDocument } from "@/types/page";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";
import { validateComponentTree } from "@/renderer/validation";
import { samplePage } from "@/components/editor/samplePage";
import {
  clonePage,
  createEditorComponent,
  duplicateComponent,
  flattenComponents,
  moveComponent,
  removeComponent,
  updateComponent
} from "./pageTree";

// Centralizes page editor state and tree mutations away from presentation components.
export function usePageEditorState() {
  const [page, setPage] = useState<LandingPageDocument>(() => clonePage(samplePage));
  const [selectedId, setSelectedId] = useState("hero");
  const flatComponents = useMemo(() => flattenComponents(page.components), [page.components]);
  const selectedComponent = flatComponents.find((component) => component.id === selectedId);
  const validation = useMemo(() => validateComponentTree(page.components), [page.components]);
  const selectedSchema = selectedComponent ? componentSchemas[selectedComponent.component] : undefined;
  const canAddChild = Boolean(selectedSchema?.acceptsChildren);

  function updateSelectedProp(fieldName: string, value: string | number) {
    if (!selectedComponent) {
      return;
    }

    setPage((current) => ({
      ...current,
      components: updateComponent(current.components, selectedComponent.id, (component) => ({
        ...component,
        props: {
          ...component.props,
          [fieldName]: value
        }
      }))
    }));
  }

  function addRootComponent(componentName: ComponentName) {
    const component = createEditorComponent(componentName);

    setPage((current) => ({
      ...current,
      components: [...current.components, component]
    }));
    setSelectedId(component.id);
  }

  function addChildComponent(componentName: ComponentName) {
    if (!selectedComponent || !componentSchemas[selectedComponent.component].acceptsChildren) {
      return;
    }

    const component = createEditorComponent(componentName);

    setPage((current) => ({
      ...current,
      components: updateComponent(current.components, selectedComponent.id, (item) => ({
        ...item,
        children: [...(item.children ?? []), component]
      }))
    }));
    setSelectedId(component.id);
  }

  function deleteSelectedComponent() {
    if (!selectedComponent) {
      return;
    }

    deleteComponent(selectedComponent.id);
  }

  function deleteComponent(componentId: string) {
    const components = removeComponent(page.components, componentId);
    const firstComponentId = flattenComponents(components)[0]?.id ?? "";

    setPage({ ...page, components });
    if (selectedId === componentId) {
      setSelectedId(firstComponentId);
    }
  }

  function duplicateSelectedComponent(componentId: string) {
    const suffix = Date.now();
    const duplicatedId = `${componentId}-copy-${suffix}`;

    setPage({
      ...page,
      components: duplicateComponent(page.components, componentId, duplicatedId, suffix)
    });
    setSelectedId(duplicatedId);
  }

  function moveSelectedComponent(componentId: string, direction: "up" | "down") {
    setPage({
      ...page,
      components: moveComponent(page.components, componentId, direction)
    });
    setSelectedId(componentId);
  }

  return {
    canAddChild,
    page,
    selectedComponent,
    selectedId,
    selectedSchema,
    validation,
    addChildComponent,
    addRootComponent,
    deleteComponent,
    deleteSelectedComponent,
    duplicateSelectedComponent,
    moveSelectedComponent,
    setPage,
    setSelectedId,
    updateSelectedProp
  };
}
