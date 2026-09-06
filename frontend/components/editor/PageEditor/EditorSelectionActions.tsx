import type { CSSProperties } from "react";
import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";

type EditorSelectionActionsBounds = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type EditorSelectionActionsProps = {
  bounds?: EditorSelectionActionsBounds;
  canMoveDown: boolean;
  canMoveUp: boolean;
  selectedId: string;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveDown: (id: string) => void;
  onMoveUp: (id: string) => void;
};

// Displays selected-component actions inside the editor canvas.
export function EditorSelectionActions({
  bounds,
  canMoveDown,
  canMoveUp,
  selectedId,
  onDelete,
  onDuplicate,
  onMoveDown,
  onMoveUp
}: EditorSelectionActionsProps) {
  if (!bounds || !selectedId) {
    return null;
  }

  const style = {
    "--editor-actions-left": `${bounds.left}px`,
    "--editor-actions-top": `${bounds.top}px`,
    "--editor-actions-width": `${bounds.width}px`
  } as CSSProperties;

  return (
    <div className="editor-selection-actions" style={style}>
      <button disabled={!canMoveUp} onClick={() => onMoveUp(selectedId)} title="Subir componente" type="button">
        <ArrowUp size={15} />
        <span className="sr-only">Subir componente</span>
      </button>
      <button disabled={!canMoveDown} onClick={() => onMoveDown(selectedId)} title="Descer componente" type="button">
        <ArrowDown size={15} />
        <span className="sr-only">Descer componente</span>
      </button>
      <button onClick={() => onDuplicate(selectedId)} title="Duplicar componente" type="button">
        <Copy size={15} />
        <span className="sr-only">Duplicar componente</span>
      </button>
      <button onClick={() => onDelete(selectedId)} title="Excluir componente" type="button">
        <Trash2 size={15} />
        <span className="sr-only">Excluir componente</span>
      </button>
    </div>
  );
}
