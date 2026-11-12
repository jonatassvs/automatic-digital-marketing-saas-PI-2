import { useState } from "react";
import { basicStyleFields, responsiveFieldName } from "@/renderer/schemas/responsiveStyles";
import { PanelRight, Trash2 } from "lucide-react";
import { normalizePageDesign } from "@/renderer/pageDesign";
import { FontFamilySelect } from "./FontFamilySelect";
import type { PageDesign, PageComponent } from "@/types/page";
import type { ComponentSchema, SchemaField } from "@/renderer/schemas/schemaTypes";
import { AppButton } from "@/components/ui/AppButton";

type ComponentSettingsPanelProps = {
  design?: PageDesign;
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
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        type={field.type === "number" ? "number" : field.type}
        value={String(value)}
        onChange={(event) =>
          onUpdateProp(field.name, field.type === "number" ? Number(event.target.value) : event.target.value)
        }
      />
      {field.description ? <small>{field.description}</small> : null}
    </label>
  );
}

// Renders schema-driven controls for the currently selected page component.
export function ComponentSettingsPanel({
  design,
  selectedComponent,
  selectedSchema,
  onDelete,
  onUpdateProp
}: ComponentSettingsPanelProps) {
  const { mobileMaxWidth } = normalizePageDesign(design);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const shouldEditOnCanvas = selectedComponent?.component === "Text";
  const contentFields = shouldEditOnCanvas
    ? []
    : selectedSchema?.fields.filter((field) => (field.group ?? "content") === "content" && field.name !== "newTab") ?? [];
  const styleFields = shouldEditOnCanvas
    ? []
    : selectedSchema?.fields.filter((field) => field.group === "style" && field.name !== "fontFamily" && !/^(mobile|desktop)[A-Z]/.test(field.name)) ?? [];

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
                    value={field.name === "linkTarget" ? selectedComponent.props.linkTarget ?? (selectedComponent.props.newTab ? "_blank" : "_self") : getFieldValue(selectedComponent, field)}
                    onUpdateProp={onUpdateProp}
                  />
                ))}
              </div>
            </details>
          ) : null}

          <details className="settings-group" open>
            <summary>Estilos</summary>
            <div className="settings-group-fields">
              {["Text", "Button", "Link"].includes(selectedComponent.component) ? <FontFamilySelect design={design} value={selectedComponent.props.fontFamily} onChange={font => onUpdateProp("fontFamily", font)} /> : null}
              <label>
                Tela
                <select value={device} onChange={event => setDevice(event.target.value as "mobile" | "desktop")}>
                  <option value="mobile">Mobile (até {mobileMaxWidth} px)</option>
                  <option value="desktop">Desktop (acima de {mobileMaxWidth} px)</option>
                </select>
              </label>
              <p className="muted-text">{device === "desktop" ? "Campos desativados usam o estilo mobile ou o padrão do componente." : "Campos desativados mantêm o padrão do componente. O desktop também usa estes valores, salvo quando personalizado."}</p>
              {basicStyleFields.map(field => {
                const name = responsiveFieldName(device, field.name);
                const value = selectedComponent.props[name];
                const enabled = value !== undefined && value !== null;
                const mobileValue = selectedComponent.props[responsiveFieldName("mobile", field.name)];
                const initialValue = (device === "desktop" ? mobileValue : undefined)
                  ?? (field.type === "color" ? "#ffffff" : field.type === "select" ? field.options?.[0]?.value : field.name === "opacity" ? 100 : 0);
                return <div key={name}>
                  <label className="checkbox-field">
                    <input type="checkbox" checked={enabled} onChange={event => onUpdateProp(name, event.target.checked ? initialValue : undefined)} />
                    <span>Personalizar {field.label.toLowerCase()}</span>
                  </label>
                  {enabled ? <FieldControl field={{ ...field, name }} value={value} onUpdateProp={onUpdateProp} /> : null}
                </div>;
              })}
              {styleFields.length > 0 ? (
                <>
                  <h3 className="settings-subtitle">Opções do componente</h3>
                  <p className="muted-text">Definem o estilo padrão para as duas telas. As personalizações acima têm prioridade.</p>
                  {styleFields.map(field => (
                    <FieldControl
                      field={field}
                      key={field.name}
                      value={getFieldValue(selectedComponent, field)}
                      onUpdateProp={onUpdateProp}
                    />
                  ))}
                </>
              ) : null}
            </div>
          </details>

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
