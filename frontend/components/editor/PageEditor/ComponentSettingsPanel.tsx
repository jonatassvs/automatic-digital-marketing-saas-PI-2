import { PanelRight, Trash2 } from "lucide-react";
import type { PageComponent } from "@/types/page";
import type { ComponentSchema } from "@/renderer/schemas/schemaTypes";
import { AppButton } from "@/components/ui/AppButton";

type ComponentSettingsPanelProps = {
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  onDelete: () => void;
  onUpdateProp: (fieldName: string, value: string | number) => void;
};

// Renders schema-driven controls for the currently selected page component.
export function ComponentSettingsPanel({
  selectedComponent,
  selectedSchema,
  onDelete,
  onUpdateProp
}: ComponentSettingsPanelProps) {
  return (
    <section className="editor-panel">
      <div className="panel-title">
        <PanelRight size={17} />
        <h2>{selectedSchema ? selectedSchema.label : "Componente"}</h2>
      </div>
      {selectedComponent && selectedSchema ? (
        <>
          <div className="selected-meta">
            <span>ID do componente</span>
            <strong>{selectedComponent.id}</strong>
          </div>

          {selectedSchema.fields.map((field) => {
            const value = selectedComponent.props[field.name] ?? field.defaultValue ?? "";

            if (field.type === "select") {
              return (
                <label key={field.name}>
                  {field.label}
                  <select
                    value={String(value)}
                    onChange={(event) => {
                      const selectedOption = field.options?.find(
                        (option) => String(option.value) === event.target.value
                      );
                      onUpdateProp(field.name, selectedOption?.value ?? event.target.value);
                    }}
                  >
                    {field.options?.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (field.type === "textarea") {
              return (
                <label key={field.name}>
                  {field.label}
                  <textarea value={String(value)} onChange={(event) => onUpdateProp(field.name, event.target.value)} />
                </label>
              );
            }

            return (
              <label key={field.name}>
                {field.label}
                <input
                  type={field.type === "number" ? "number" : field.type}
                  value={String(value)}
                  onChange={(event) =>
                    onUpdateProp(field.name, field.type === "number" ? Number(event.target.value) : event.target.value)
                  }
                />
              </label>
            );
          })}

          <AppButton variant="danger" onClick={onDelete}>
            <Trash2 size={16} />
            Remover componente
          </AppButton>
        </>
      ) : (
        <p className="muted-text">Selecione um bloco no canvas para editar seus campos.</p>
      )}
    </section>
  );
}
