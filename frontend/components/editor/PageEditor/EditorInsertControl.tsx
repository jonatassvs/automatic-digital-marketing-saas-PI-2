import type { CSSProperties } from "react";
import type { PageComponent } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";

type EditorInsertControlBounds = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type EditorInsertControlProps = {
  bounds?: EditorInsertControlBounds;
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  onAddComponent: (parentId: string, childIndex?: number) => void;
};

function getColumnCount(component: PageComponent) {
  const columns = component.props.columns;

  return typeof columns === "number" ? Math.min(Math.max(columns, 1), 4) : 1;
}

function getGridColumnInsertIndex(component: PageComponent, column: number) {
  const columns = getColumnCount(component);
  const childCount = component.children?.length ?? 0;
  const lastColumnChildIndex = Array.from({ length: childCount }, (_, index) => index)
    .filter((index) => index % columns === column)
    .at(-1);

  return lastColumnChildIndex === undefined ? childCount : lastColumnChildIndex + columns;
}

// Positions the global add control inside the selected component outline.
export function EditorInsertControl({
  bounds,
  selectedComponent,
  selectedSchema,
  onAddComponent
}: EditorInsertControlProps) {
  if (!bounds || !selectedComponent || !selectedSchema?.acceptsChildren) {
    return null;
  }

  const columns = selectedComponent.component === "Grid" ? getColumnCount(selectedComponent) : 1;
  const style = {
    "--editor-insert-left": `${bounds.left}px`,
    "--editor-insert-top": `${bounds.top + bounds.height}px`,
    "--editor-insert-width": `${bounds.width}px`,
    "--editor-insert-columns": columns
  } as CSSProperties;

  return (
    <div className="editor-insert-control" style={style}>
      {Array.from({ length: columns }, (_, column) => (
        <button
          className="editor-insert-button"
          key={column}
          onClick={(event) => {
            event.stopPropagation();
            onAddComponent(
              selectedComponent.id,
              selectedComponent.component === "Grid" ? getGridColumnInsertIndex(selectedComponent, column) : undefined
            );
          }}
          title={
            selectedComponent.component === "Grid"
              ? `Adicionar componente na coluna ${column + 1}`
              : "Adicionar componente"
          }
          type="button"
        >
          <span aria-hidden="true">+</span>
          <span>Adicionar componente</span>
        </button>
      ))}
    </div>
  );
}
