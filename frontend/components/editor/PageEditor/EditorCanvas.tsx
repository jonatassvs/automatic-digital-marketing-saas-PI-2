import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { LandingPageDocument } from "@/types/page";
import { PageRenderer } from "@/renderer/ComponentRenderer";
import { AppButton } from "@/components/ui/AppButton";
import { ComponentOutline } from "./ComponentOutline";

type EditorCanvasProps = {
  canAddChild: boolean;
  isSectionPanelOpen: boolean;
  page: LandingPageDocument;
  selectedId: string;
  onAddChild: () => void;
  onAddRoot: () => void;
  onCloseSectionPanel: () => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveComponentDown: (id: string) => void;
  onMoveComponentUp: (id: string) => void;
  onSelectComponent: (id: string) => void;
  onToggleSectionPanel: () => void;
};

// Combines the component outline with the live landing page preview.
export function EditorCanvas({
  canAddChild,
  isSectionPanelOpen,
  page,
  selectedId,
  onAddChild,
  onAddRoot,
  onCloseSectionPanel,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponentDown,
  onMoveComponentUp,
  onSelectComponent,
  onToggleSectionPanel
}: EditorCanvasProps) {
  return (
    <section className="canvas-column" aria-label="Canvas de montagem">
      <AppButton
        className={isSectionPanelOpen ? "sections-panel-toggle open" : "sections-panel-toggle"}
        variant="secondary"
        onClick={onToggleSectionPanel}
        title="Estrutura"
      >
        {isSectionPanelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        <span className="sr-only">{isSectionPanelOpen ? "Fechar estrutura" : "Abrir estrutura"}</span>
      </AppButton>

      <aside
        className={isSectionPanelOpen ? "sections-panel open" : "sections-panel"}
        aria-label="Menu de secoes"
        aria-hidden={!isSectionPanelOpen}
      >
        <header className="sections-panel-header">
          <div>
            <span className="eyebrow">Estrutura</span>
            <h2>Secoes</h2>
          </div>
          <AppButton variant="icon" onClick={onCloseSectionPanel} title="Fechar secoes">
            <X size={16} />
            <span className="sr-only">Fechar secoes</span>
          </AppButton>
        </header>

        <ComponentOutline
          components={page.components}
          selectedId={selectedId}
          onDelete={onDeleteComponent}
          onDuplicate={onDuplicateComponent}
          onMoveDown={onMoveComponentDown}
          onMoveUp={onMoveComponentUp}
          onSelect={onSelectComponent}
        />
      </aside>

      <div className="canvas-header">
        <div>
          <span className="eyebrow">Preview sem API</span>
          <h1>{page.name}</h1>
        </div>
        <div className="component-picker">
          <AppButton variant="secondary" onClick={onAddRoot}>
            <Plus size={16} />
            Adicionar na raiz
          </AppButton>
          <AppButton variant="secondary" disabled={!canAddChild} onClick={onAddChild}>
            <Plus size={16} />
            Adicionar filho
          </AppButton>
        </div>
      </div>

      <div className="builder-surface">
        <section className="preview-frame" aria-label="Preview da landing page">
          <PageRenderer
            components={page.components}
            onSelectComponent={onSelectComponent}
            selectedId={selectedId}
          />
        </section>
      </div>
    </section>
  );
}
