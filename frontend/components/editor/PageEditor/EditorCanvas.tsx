import { useLayoutEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { LandingPageDocument, PageComponent } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";
import { PageRenderer } from "@/renderer/ComponentRenderer";
import { EditorInsertControl } from "./EditorInsertControl";
import { EditorSelectionActions } from "./EditorSelectionActions";

type EditorCanvasProps = {
  page: LandingPageDocument;
  selectedId: string;
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  selectedSiblingPosition?: {
    index: number;
    total: number;
  };
  onAddChild: (parentId: string, childIndex?: number) => void;
  onAddRootAt: (index: number) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveComponentDown: (id: string) => void;
  onMoveComponentUp: (id: string) => void;
  onSelectComponent: (id: string) => void;
};

// Renders the live landing page preview and canvas-level editing controls.
export function EditorCanvas({
  page,
  selectedId,
  selectedComponent,
  selectedSchema,
  selectedSiblingPosition,
  onAddChild,
  onAddRootAt,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponentDown,
  onMoveComponentUp,
  onSelectComponent
}: EditorCanvasProps) {
  const previewRef = useRef<HTMLElement>(null);
  const [insertControlBounds, setInsertControlBounds] = useState<
    | {
        height: number;
        left: number;
        top: number;
        width: number;
      }
    | undefined
  >();

  useLayoutEffect(() => {
    function updateInsertControlBounds() {
      const previewElement = previewRef.current;

      if (!previewElement) {
        setInsertControlBounds(undefined);
        return;
      }

      const selectedElement = Array.from(
        previewElement.querySelectorAll<HTMLElement>("[data-editor-component-id]")
      ).find((element) => element.dataset.editorComponentId === selectedId);

      if (!selectedElement) {
        setInsertControlBounds(undefined);
        return;
      }

      const previewRect = previewElement.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      setInsertControlBounds({
        height: selectedRect.height,
        left: selectedRect.left - previewRect.left + previewElement.scrollLeft,
        top: selectedRect.top - previewRect.top + previewElement.scrollTop,
        width: selectedRect.width
      });
    }

    updateInsertControlBounds();
    window.addEventListener("resize", updateInsertControlBounds);
    window.addEventListener("scroll", updateInsertControlBounds, true);

    return () => {
      window.removeEventListener("resize", updateInsertControlBounds);
      window.removeEventListener("scroll", updateInsertControlBounds, true);
    };
  }, [page.components, selectedId]);

  return (
    <section className="canvas-column" aria-label="Canvas de montagem">
      <div className="canvas-header">
        <div>
          <span className="eyebrow">Preview sem API</span>
          <h1>{page.name}</h1>
        </div>
      </div>

      <div className="builder-surface">
        <section className="preview-frame" aria-label="Preview da landing page" ref={previewRef}>
          <PageRenderer
            components={page.components}
            onSelectComponent={onSelectComponent}
            renderRootInsertControl={(insertIndex) => (
              <div className="canvas-root-insert-row">
                <button
                  className="canvas-root-insert-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddRootAt(insertIndex);
                  }}
                  title="Adicionar componente"
                  type="button"
                >
                  <Plus size={15} />
                  <span>Adicionar componente</span>
                </button>
              </div>
            )}
            selectedId={selectedId}
          />
          <EditorInsertControl
            bounds={insertControlBounds}
            selectedComponent={selectedComponent}
            selectedSchema={selectedSchema}
            onAddComponent={onAddChild}
          />
          <EditorSelectionActions
            bounds={insertControlBounds}
            canMoveDown={Boolean(
              selectedSiblingPosition && selectedSiblingPosition.index < selectedSiblingPosition.total - 1
            )}
            canMoveUp={Boolean(selectedSiblingPosition && selectedSiblingPosition.index > 0)}
            selectedId={selectedId}
            onDelete={onDeleteComponent}
            onDuplicate={onDuplicateComponent}
            onMoveDown={onMoveComponentDown}
            onMoveUp={onMoveComponentUp}
          />
        </section>
      </div>
    </section>
  );
}
