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

// Finds the selected component position within its current sibling group.
export function findComponentSiblingPosition(
  components: PageComponent[],
  id: string
): { index: number; total: number } | undefined {
  const siblingIndex = components.findIndex((component) => component.id === id);

  if (siblingIndex >= 0) {
    return {
      index: siblingIndex,
      total: components.length
    };
  }

  for (const component of components) {
    const childPosition = component.children ? findComponentSiblingPosition(component.children, id) : undefined;

    if (childPosition) {
      return childPosition;
    }
  }

  return undefined;
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

// Inserts a new root component at the requested position, or at the end.
export function insertRootComponent(
  components: PageComponent[],
  component: PageComponent,
  insertIndex?: number
): PageComponent[] {
  const nextIndex =
    insertIndex === undefined ? components.length : Math.min(Math.max(insertIndex, 0), components.length);

  return [...components.slice(0, nextIndex), component, ...components.slice(nextIndex)];
}

// Inserts a new child inside the requested parent at the requested child index.
export function insertChildComponent(
  components: PageComponent[],
  parentId: string,
  component: PageComponent,
  childIndex?: number
): PageComponent[] {
  return updateComponent(components, parentId, (item) => {
    const children = item.children ?? [];
    const nextIndex = childIndex === undefined ? children.length : Math.min(Math.max(childIndex, 0), children.length);

    return {
      ...item,
      children: [...children.slice(0, nextIndex), component, ...children.slice(nextIndex)]
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

let editorNodeCounter = 0;

function buildSubNode(
  component: ComponentName,
  customProps: Record<string, unknown> = {},
  children?: PageComponent[],
  prefix?: string
): PageComponent {
  editorNodeCounter += 1;
  return {
    id: `${(prefix ?? component).toLowerCase()}-${Date.now()}-${editorNodeCounter}`,
    component,
    props: {
      ...createDefaultProps(component),
      ...customProps
    },
    children: componentSchemas[component].acceptsChildren ? (children ?? []) : undefined
  };
}

// Composes the default Footer organism out of existing Container, Grid, Flex, Text, Link and Spacer blocks.
export function createDefaultFooterChildren(): PageComponent[] {
  return [
    buildSubNode(
      "Container",
      { maxWidth: 1120, align: "left" },
      [
        buildSubNode(
          "Grid",
          { columns: 3, gap: 32 },
          [
            buildSubNode(
              "Flex",
              { direction: "column", gap: 10, align: "flex-start" },
              [
                buildSubNode(
                  "Text",
                  {
                    type: "heading",
                    level: "h3",
                    text: "Minha Marca",
                    color: "#ffffff",
                    fontSizeMobile: 22,
                    fontSizeDesktop: 24,
                    useDesktopFontSize: true
                  },
                  undefined,
                  "footer-brand-title"
                ),
                buildSubNode(
                  "Text",
                  {
                    type: "paragraph",
                    text: "Soluções pensadas para gerar resultados reais para o seu negócio.",
                    color: "#94a3b8",
                    fontSizeMobile: 15,
                    fontSizeDesktop: 15
                  },
                  undefined,
                  "footer-brand-desc"
                )
              ],
              "footer-brand-col"
            ),
            buildSubNode(
              "Flex",
              { direction: "column", gap: 8, align: "flex-start" },
              [
                buildSubNode(
                  "Text",
                  {
                    type: "heading",
                    level: "h4",
                    text: "Navegação",
                    color: "#ffffff",
                    fontSizeMobile: 17,
                    fontSizeDesktop: 18
                  },
                  undefined,
                  "footer-nav-title"
                ),
                buildSubNode("Link", { text: "Início", href: "#" }, undefined, "footer-link-1"),
                buildSubNode("Link", { text: "Serviços", href: "#servicos" }, undefined, "footer-link-2"),
                buildSubNode("Link", { text: "Sobre", href: "#sobre" }, undefined, "footer-link-3")
              ],
              "footer-nav-col"
            ),
            buildSubNode(
              "Flex",
              { direction: "column", gap: 8, align: "flex-start" },
              [
                buildSubNode(
                  "Text",
                  {
                    type: "heading",
                    level: "h4",
                    text: "Contato",
                    color: "#ffffff",
                    fontSizeMobile: 17,
                    fontSizeDesktop: 18
                  },
                  undefined,
                  "footer-contact-title"
                ),
                buildSubNode(
                  "Text",
                  {
                    type: "paragraph",
                    text: "WhatsApp: (11) 99999-9999",
                    color: "#cbd5e1",
                    fontSizeMobile: 15,
                    fontSizeDesktop: 15
                  },
                  undefined,
                  "footer-contact-1"
                ),
                buildSubNode(
                  "Text",
                  {
                    type: "paragraph",
                    text: "E-mail: contato@minhamarca.com.br",
                    color: "#cbd5e1",
                    fontSizeMobile: 15,
                    fontSizeDesktop: 15
                  },
                  undefined,
                  "footer-contact-2"
                ),
                buildSubNode(
                  "Text",
                  {
                    type: "paragraph",
                    text: "Atendimento: Seg a Sex, 09h às 18h",
                    color: "#cbd5e1",
                    fontSizeMobile: 15,
                    fontSizeDesktop: 15
                  },
                  undefined,
                  "footer-contact-3"
                )
              ],
              "footer-contact-col"
            )
          ],
          "footer-grid"
        ),
        buildSubNode("Spacer", { height: 28 }, undefined, "footer-spacer"),
        buildSubNode(
          "Text",
          {
            type: "paragraph",
            text: "© 2026 Minha Marca. Todos os direitos reservados.",
            color: "#64748b",
            align: "center",
            fontSizeMobile: 14,
            fontSizeDesktop: 14
          },
          undefined,
          "footer-copyright"
        )
      ],
      "footer-container"
    )
  ];
}

// Builds a new schema-compliant component for the local editor session.
export function createEditorComponent(component: ComponentName): PageComponent {
  editorNodeCounter += 1;
  return {
    id: `${component.toLowerCase()}-${Date.now()}-${editorNodeCounter}`,
    component,
    props: createDefaultProps(component),
    children: componentSchemas[component].acceptsChildren
      ? component === "Footer"
        ? createDefaultFooterChildren()
        : []
      : undefined
  };
}
