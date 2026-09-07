import { PanelRight, Trash2 } from "lucide-react";
import type { PageComponent } from "@/types/page";
import type { ComponentSchema, SchemaField } from "@/renderer/schemas/schemaTypes";
import { AppButton } from "@/components/ui/AppButton";

type ComponentSettingsPanelProps = {
  selectedComponent?: PageComponent;
  selectedSchema?: ComponentSchema;
  onDelete: () => void;
  onUpdateProp: (fieldName: string, value: unknown) => void;
};

type FieldControlProps = {
  field: SchemaField;
  value: unknown;
  onUpdateProp: (fieldName: string, value: unknown) => void;
};

function getFieldValue(selectedComponent: PageComponent, field: SchemaField) {
  return selectedComponent.props[field.name] ?? field.defaultValue ?? "";
}

function FieldControl({ field, value, onUpdateProp }: FieldControlProps) {
  if (field.type === "richText") {
    return null;
  }

  if (field.type === "checkbox") {
    return (
      <label className="checkbox-field">
        <input
          checked={Boolean(value)}
          type="checkbox"
          onChange={(event) => onUpdateProp(field.name, event.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label>
        {field.label}
        <select
          value={String(value)}
          onChange={(event) => {
            const selectedOption = field.options?.find((option) => String(option.value) === event.target.value);
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
      <label>
        {field.label}
        <textarea value={String(value)} onChange={(event) => onUpdateProp(field.name, event.target.value)} />
      </label>
    );
  }

  return (
    <label>
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
}

// Renders schema-driven controls for the currently selected page component.
export function ComponentSettingsPanel({
  selectedComponent,
  selectedSchema,
  onDelete,
  onUpdateProp
}: ComponentSettingsPanelProps) {
  const shouldEditOnCanvas = selectedComponent?.component === "Text";
  const contentFields = shouldEditOnCanvas
    ? []
    : selectedSchema?.fields.filter((field) => (field.group ?? "content") === "content") ?? [];
  const styleFields = shouldEditOnCanvas
    ? []
    : selectedSchema?.fields.filter((field) => field.group === "style") ?? [];

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

          {shouldEditOnCanvas ? (
            <p className="muted-text">Edite o texto e seus estilos diretamente no canvas.</p>
          ) : null}

          {contentFields.length > 0 ? (
            <details className="settings-group" open>
              <summary>Conteudo</summary>
              <div className="settings-group-fields">
                {contentFields.map((field) => (
                  <FieldControl
                    field={field}
                    key={field.name}
                    value={getFieldValue(selectedComponent, field)}
                    onUpdateProp={onUpdateProp}
                  />
                ))}
              </div>
            </details>
          ) : null}

          {styleFields.length > 0 ? (
            <details className="settings-group">
              <summary>Style</summary>
              <div className="settings-group-fields">
                {styleFields.map((field) => (
                  <FieldControl
                    field={field}
                    key={field.name}
                    value={getFieldValue(selectedComponent, field)}
                    onUpdateProp={onUpdateProp}
                  />
                ))}
              </div>
            </details>
          ) : null}

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
