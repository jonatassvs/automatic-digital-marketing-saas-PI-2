import { useState } from "react";
import { basicStyleFields, responsiveFieldName } from "@/renderer/schemas/responsiveStyles";
import { PanelRight, Trash2, Plus } from "lucide-react";
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

  if (field.type === "color") {
    const hex = typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
    return (
      <label>
        {field.label}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="color"
            value={hex}
            onChange={(event) => onUpdateProp(field.name, event.target.value)}
            style={{ width: 44, height: 38, padding: 2, cursor: "pointer", borderRadius: 6, border: "1px solid #d1d5db" }}
          />
          <input
            type="text"
            value={String(value ?? hex)}
            onChange={(event) => onUpdateProp(field.name, event.target.value)}
            placeholder="#ffffff"
            style={{ flex: 1, fontFamily: "monospace" }}
          />
        </div>
        {field.description ? <small>{field.description}</small> : null}
      </label>
    );
  }

  if (field.type === "links") {
    const linkList: Array<{ text: string; url: string }> = Array.isArray(value) ? value : [];

    const handleUpdateLinks = (updated: Array<{ text: string; url: string }>) => {
      onUpdateProp(field.name, updated);
      for (let i = 1; i <= 6; i++) {
        const item = updated[i - 1];
        onUpdateProp(`link${i}Text`, item?.text ?? "");
        onUpdateProp(`link${i}Url`, item?.url ?? "");
      }
    };

    const handleAddLink = () => {
      handleUpdateLinks([...linkList, { text: `Link ${linkList.length + 1}`, url: "#" }]);
    };

    const handleUpdateItem = (index: number, propName: "text" | "url", val: string) => {
      const updated = linkList.map((item, i) => (i === index ? { ...item, [propName]: val } : item));
      handleUpdateLinks(updated);
    };

    const handleRemoveLink = (index: number) => {
      const updated = linkList.filter((_, i) => i !== index);
      handleUpdateLinks(updated);
    };

    return (
      <div className="links-manager-field" style={{ display: "grid", gap: 10, margin: "6px 0 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
            {field.label} ({linkList.length})
          </span>
          <button
            type="button"
            onClick={handleAddLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1d4ed8",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <Plus size={13} />
            <span>Adicionar Link</span>
          </button>
        </div>

        {linkList.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic" }}>
            Nenhum link adicionado. Clique no botão acima para adicionar links.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {linkList.map((linkItem, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px 10px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  display: "grid",
                  gap: 6
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4b5563" }}>Link #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    title="Remover link"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: 2,
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Texto (ex: Início)"
                    value={linkItem.text || ""}
                    onChange={(e) => handleUpdateItem(idx, "text", e.target.value)}
                    style={{ fontSize: "0.82rem", minHeight: 32, padding: "4px 8px" }}
                  />
                  <input
                    type="text"
                    placeholder="URL (ex: #sobre ou /)"
                    value={linkItem.url || ""}
                    onChange={(e) => handleUpdateItem(idx, "url", e.target.value)}
                    style={{ fontSize: "0.82rem", minHeight: 32, padding: "4px 8px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (field.type === "formFields") {
    type FormFieldItem = {
      id?: string;
      label: string;
      type: "text" | "tel" | "email" | "textarea" | "number";
      placeholder?: string;
      required: boolean;
    };

    const fieldList: FormFieldItem[] = Array.isArray(value) ? (value as FormFieldItem[]) : [];

    const handleUpdateFields = (updated: FormFieldItem[]) => {
      onUpdateProp(field.name, updated);
    };

    const handleAddField = () => {
      handleUpdateFields([
        ...fieldList,
        {
          id: `field-${Date.now()}-${fieldList.length + 1}`,
          label: `Campo ${fieldList.length + 1}`,
          type: "text",
          placeholder: "Digite aqui...",
          required: false
        }
      ]);
    };

    const handleUpdateFieldItem = (index: number, patch: Partial<FormFieldItem>) => {
      const updated = fieldList.map((item, i) => (i === index ? { ...item, ...patch } : item));
      handleUpdateFields(updated);
    };

    const handleRemoveField = (index: number) => {
      if (fieldList.length <= 1) {
        return;
      }
      handleUpdateFields(fieldList.filter((_, i) => i !== index));
    };

    return (
      <div className="form-fields-manager" style={{ display: "grid", gap: 10, margin: "6px 0 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
            {field.label} ({fieldList.length})
          </span>
          <button
            type="button"
            onClick={handleAddField}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <Plus size={13} />
            <span>Adicionar Campo</span>
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {fieldList.map((item, idx) => {
            const isRequired = Boolean(item.required);
            return (
              <div
                key={item.id ?? idx}
                style={{
                  padding: "10px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  display: "grid",
                  gap: 8
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4b5563" }}>
                    Campo #{idx + 1}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateFieldItem(idx, { required: !isRequired })}
                      aria-pressed={isRequired}
                      title={
                        isRequired
                          ? "Clique para tornar este campo opcional"
                          : "Clique para tornar este campo obrigatório"
                      }
                      style={{
                        padding: "3px 9px",
                        minHeight: 26,
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        borderRadius: 999,
                        cursor: "pointer",
                        border: isRequired ? "1px solid #16a34a" : "1px solid #d1d5db",
                        background: isRequired ? "#dcfce7" : "#ffffff",
                        color: isRequired ? "#166534" : "#4b5563"
                      }}
                    >
                      {isRequired ? "Obrigatório ✓" : "Opcional"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      disabled={fieldList.length <= 1}
                      title={fieldList.length <= 1 ? "O formulário precisa de pelo menos 1 campo" : "Remover campo"}
                      style={{
                        background: "none",
                        border: "none",
                        color: fieldList.length <= 1 ? "#9ca3af" : "#ef4444",
                        cursor: fieldList.length <= 1 ? "not-allowed" : "pointer",
                        padding: 2,
                        minHeight: 24,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Nome do campo (ex: Seu nome)"
                    value={item.label || ""}
                    onChange={(e) => {
                      const nextLabel = e.target.value;
                      handleUpdateFieldItem(idx, { label: nextLabel || `Campo ${idx + 1}` });
                    }}
                    style={{ fontSize: "0.82rem", minHeight: 32, padding: "4px 8px" }}
                  />
                  <select
                    value={item.type || "text"}
                    onChange={(e) =>
                      handleUpdateFieldItem(idx, {
                        type: e.target.value as FormFieldItem["type"]
                      })
                    }
                    style={{ fontSize: "0.8rem", minHeight: 32, padding: "4px 6px" }}
                  >
                    <option value="text">Texto curto</option>
                    <option value="tel">Telefone</option>
                    <option value="email">E-mail</option>
                    <option value="textarea">Mensagem</option>
                    <option value="number">Número</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Texto de exemplo / placeholder (opcional)"
                  value={item.placeholder ?? ""}
                  onChange={(e) => handleUpdateFieldItem(idx, { placeholder: e.target.value })}
                  style={{ fontSize: "0.8rem", minHeight: 30, padding: "4px 8px" }}
                />
              </div>
            );
          })}
        </div>
      </div>
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
    : selectedSchema?.fields.filter(
        (field) =>
          (field.group ?? "content") === "content" &&
          field.name !== "newTab" &&
          !/^link[1-6](Text|Url)$/.test(field.name)
      ) ?? [];
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
              {["Text", "Button", "Link", "Navbar", "Form"].includes(selectedComponent.component) ? <FontFamilySelect design={design} value={selectedComponent.props.fontFamily} onChange={font => onUpdateProp("fontFamily", font)} /> : null}
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
