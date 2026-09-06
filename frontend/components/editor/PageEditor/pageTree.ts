import type { ComponentName, LandingPageDocument, PageComponent } from "@/types/page";
import { componentSchemas } from "@/renderer/schemas/componentSchemas";
import { createDefaultProps } from "@/renderer/validation";
import type { FlatPageComponent } from "./types";

// Creates a deep copy so the sample page can be edited without mutation.
export function clonePage(page: LandingPageDocument): LandingPageDocument {
  return JSON.parse(JSON.stringify(page)) as LandingPageDocument;
}

// Converts nested page components into a flat list while keeping depth metadata.
export function flattenComponents(components: PageComponent[], depth = 0): FlatPageComponent[] {
  return components.flatMap((component) => [
    { ...component, depth },
    ...flattenComponents(component.children ?? [], depth + 1)
  ]);
}

// Updates a component anywhere in the tree while preserving the rest of the tree.
export function updateComponent(
  components: PageComponent[],
  id: string,
  updater: (component: PageComponent) => PageComponent
): PageComponent[] {
  return components.map((component) => {
    if (component.id === id) {
      return updater(component);
    }

    return {
      ...component,
      children: component.children ? updateComponent(component.children, id, updater) : undefined
    };
  });
}

// Removes a component and any nested children from the page tree.
export function removeComponent(components: PageComponent[], id: string): PageComponent[] {
  return components
    .filter((component) => component.id !== id)
    .map((component) => ({
      ...component,
      children: component.children ? removeComponent(component.children, id) : undefined
    }));
}

// Moves a component up or down inside its current parent group.
export function moveComponent(
  components: PageComponent[],
  id: string,
  direction: "up" | "down"
): PageComponent[] {
  const siblingIndex = components.findIndex((component) => component.id === id);

  if (siblingIndex >= 0) {
    const targetIndex = direction === "up" ? siblingIndex - 1 : siblingIndex + 1;

    if (targetIndex < 0 || targetIndex >= components.length) {
      return components;
    }

    const reorderedComponents = [...components];
    [reorderedComponents[siblingIndex], reorderedComponents[targetIndex]] = [
      reorderedComponents[targetIndex],
      reorderedComponents[siblingIndex]
    ];

    return reorderedComponents;
  }

  return components.map((component) => ({
    ...component,
    children: component.children ? moveComponent(component.children, id, direction) : undefined
  }));
}

function duplicateComponentBranch(
  component: PageComponent,
  duplicateId: string,
  suffix: number,
  counter: { value: number }
): PageComponent {
  counter.value += 1;

  return {
    ...component,
    id: counter.value === 1 ? duplicateId : `${component.id}-copy-${suffix}`,
    children: component.children?.map((child) => duplicateComponentBranch(child, duplicateId, suffix, counter))
  };
}

// Duplicates a component branch and inserts the copy next to the original.
export function duplicateComponent(
  components: PageComponent[],
  id: string,
  duplicateId: string,
  suffix: number
): PageComponent[] {
  const siblingIndex = components.findIndex((component) => component.id === id);

  if (siblingIndex >= 0) {
    const counter = { value: 0 };
    const duplicatedComponent = duplicateComponentBranch(components[siblingIndex], duplicateId, suffix, counter);

    return [
      ...components.slice(0, siblingIndex + 1),
      duplicatedComponent,
      ...components.slice(siblingIndex + 1)
    ];
  }

  return components.map((component) => ({
    ...component,
    children: component.children ? duplicateComponent(component.children, id, duplicateId, suffix) : undefined
  }));
}

// Builds a new schema-compliant component for the local editor session.
export function createEditorComponent(component: ComponentName): PageComponent {
  return {
    id: `${component.toLowerCase()}-${Date.now()}`,
    component,
    props: createDefaultProps(component),
    children: componentSchemas[component].acceptsChildren ? [] : undefined
  };
}
