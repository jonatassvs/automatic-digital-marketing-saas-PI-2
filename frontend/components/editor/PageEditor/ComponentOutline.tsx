import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import type { PageComponent } from "@/types/page";
import { AppButton } from "@/components/ui/AppButton";

type ComponentOutlineProps = {
  components: PageComponent[];
  selectedId: string;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveDown: (id: string) => void;
  onMoveUp: (id: string) => void;
  onSelect: (id: string) => void;
};

// Lists only top-level page sections and exposes quick actions for the selected section.
export function ComponentOutline({
  components,
  selectedId,
  onDelete,
  onDuplicate,
  onMoveDown,
  onMoveUp,
  onSelect
}: ComponentOutlineProps) {
  return (
    <div className="component-outline" aria-label="Arvore de componentes">
      <div className="component-tree">
        {components.map((component, index) => {
          const isSelected = component.id === selectedId;

          return (
            <div className={isSelected ? "component-node selected" : "component-node"} key={component.id}>
              <div className="component-node-row">
                <button className="component-item" onClick={() => onSelect(component.id)} type="button">
                  <span>{component.id}</span>
                  <small>{component.component}</small>
                </button>

                {isSelected && (
                  <div className="component-node-actions" aria-label="Acoes da secao selecionada">
                    <AppButton
                      variant="icon"
                      disabled={index === 0}
                      onClick={() => onMoveUp(component.id)}
                      title="Subir secao"
                    >
                      <ArrowUp size={15} />
                      <span className="sr-only">Subir secao</span>
                    </AppButton>
                    <AppButton
                      variant="icon"
                      disabled={index === components.length - 1}
                      onClick={() => onMoveDown(component.id)}
                      title="Descer secao"
                    >
                      <ArrowDown size={15} />
                      <span className="sr-only">Descer secao</span>
                    </AppButton>
                    <AppButton variant="icon" onClick={() => onDuplicate(component.id)} title="Duplicar secao">
                      <Copy size={15} />
                      <span className="sr-only">Duplicar secao</span>
                    </AppButton>
                    <AppButton variant="icon" onClick={() => onDelete(component.id)} title="Excluir secao">
                      <Trash2 size={15} />
                      <span className="sr-only">Excluir secao</span>
                    </AppButton>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
