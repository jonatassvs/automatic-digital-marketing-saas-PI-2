import { Layers, X } from "lucide-react";
import type { ComponentName } from "@/types/page";
import { creatableComponents } from "@/renderer/schemas/componentSchemas";
import { AppButton } from "@/components/ui/AppButton";
import type { AddMode } from "./types";

type AddComponentModalProps = {
  canAddChild: boolean;
  isOpen: boolean;
  mode: AddMode;
  onClose: () => void;
  onSelect: (component: ComponentName) => void;
};

// Lets users choose which allowed page-builder component to add next.
export function AddComponentModal({
  canAddChild,
  isOpen,
  mode,
  onClose,
  onSelect
}: AddComponentModalProps) {
  if (!isOpen) {
    return null;
  }

  const targetLabel = mode === "child" && canAddChild ? "como filho do selecionado" : "na raiz da pagina";

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="add-component-title"
        aria-modal="true"
        className="add-component-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <span className="eyebrow">Componentes base</span>
            <h2 id="add-component-title">Adicionar bloco {targetLabel}</h2>
          </div>
          <AppButton variant="icon" onClick={onClose} title="Fechar">
            <X size={16} />
            <span className="sr-only">Fechar</span>
          </AppButton>
        </header>

        <div className="component-card-grid">
          {creatableComponents.map((schema) => (
            <button
              type="button"
              className="component-card"
              key={schema.component}
              onClick={() => onSelect(schema.component)}
            >
              <span className="component-card-icon" aria-hidden="true">
                <Layers size={18} />
              </span>
              <span>
                <strong>{schema.label}</strong>
                <small>{schema.acceptsChildren ? "Aceita filhos" : "Bloco simples"}</small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
