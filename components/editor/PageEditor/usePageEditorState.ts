import { useMemo, useState } from "react";
import type { ComponentName, LandingPageDocument } from "@/types/page";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";
import { validatePageDesign } from "@/renderer/pageDesign";
import { validateComponentTree } from "@/renderer/validation";
import { samplePage } from "@/components/editor/samplePage";
import {
  clonePage,
  createEditorComponent,
  duplicateComponent,
  findComponentSiblingPosition,
  flattenComponents,
  insertChildComponent,
  insertRootComponent,
  moveComponent,
  removeComponent,
  updateComponent
} from "./pageTree";

// Centralizes page editor state and tree mutations away from presentation components.
export function usePageEditorState(initialPage?: LandingPageDocument) {
  const [page, setPage] = useState<LandingPageDocument>(() => clonePage(initialPage ?? samplePage));
  const [selectedId, setSelectedId] = useState(() => {
    const list = flattenComponents((initialPage ?? samplePage).components);
    return list[0]?.id ?? "hero";
  });
  const flatComponents = useMemo(() => flattenComponents(page.components), [page.components]);
  const selectedComponent = flatComponents.find((component) => component.id === selectedId);
  const selectedSiblingPosition = useMemo(
    () => findComponentSiblingPosition(page.components, selectedId),
    [page.components, selectedId]
  );
  const validation = useMemo(() => {
    const tree = validateComponentTree(page.components);
    const errors = [...tree.errors, ...validatePageDesign(page.design)];
    return { valid: errors.length === 0, errors };
  }, [page.components, page.design]);
  const selectedSchema = selectedComponent ? componentSchemas[selectedComponent.component] : undefined;
  const canAddChild = Boolean(selectedSchema?.acceptsChildren);

  function updateComponentProp(componentId: string, fieldName: string, value: unknown) {
    setPage((current) => ({
      ...current,
      components: updateComponent(current.components, componentId, (component) => ({
        ...component,
        props: {
          ...component.props,
          [fieldName]: value
        }
      }))
    }));
  }

  function updateSelectedProp(fieldName: string, value: unknown) {
    if (!selectedComponent) {
      return;
    }

    updateComponentProp(selectedComponent.id, fieldName, value);
  }

  function addRootComponent(componentName: ComponentName, insertIndex?: number) {
    const component = createEditorComponent(componentName);

    setPage((current) => ({
      ...current,
      components: insertRootComponent(current.components, component, insertIndex)
    }));
    setSelectedId(component.id);
  }

  function addChildComponent(componentName: ComponentName, parentId = selectedId, childIndex?: number) {
    const parentComponent = flatComponents.find((component) => component.id === parentId);

    if (!parentComponent || !componentSchemas[parentComponent.component].acceptsChildren) {
      return;
    }

    const component = createEditorComponent(componentName);

    setPage((current) => ({
      ...current,
      components: insertChildComponent(current.components, parentId, component, childIndex)
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
    selectedSiblingPosition,
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
    updateComponentProp,
    updateSelectedProp
  };
}
