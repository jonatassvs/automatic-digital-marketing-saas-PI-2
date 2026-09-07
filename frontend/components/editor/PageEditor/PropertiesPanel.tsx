import type { LandingPageDocument, PageComponent } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";
import type { ValidationResult } from "@/renderer/validation";
import { ComponentSettingsPanel } from "./ComponentSettingsPanel";
import { PageSettingsPanel } from "./PageSettingsPanel";
import { ValidationMessages } from "./ValidationMessages";

type PropertiesPanelProps = {
  page: LandingPageDocument;
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  validation: ValidationResult;
  onDeleteSelected: () => void;
  onPageChange: (page: LandingPageDocument) => void;
  onUpdateSelectedProp: (fieldName: string, value: unknown) => void;
};

// Groups page settings, selected component settings, and validation feedback.
export function PropertiesPanel({
  page,
  selectedComponent,
  selectedSchema,
  validation,
  onDeleteSelected,
  onPageChange,
  onUpdateSelectedProp
}: PropertiesPanelProps) {
  return (
    <aside className="properties-panel" aria-label="Painel de controle">
      <PageSettingsPanel page={page} onChange={onPageChange} />
      <ComponentSettingsPanel
        selectedComponent={selectedComponent}
        selectedSchema={selectedSchema}
        onDelete={onDeleteSelected}
        onUpdateProp={onUpdateSelectedProp}
      />
      <ValidationMessages validation={validation} />
    </aside>
  );
}
