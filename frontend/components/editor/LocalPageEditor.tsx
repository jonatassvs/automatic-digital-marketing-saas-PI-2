"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  PanelRight,
  Plus,
  Save,
  Trash2,
  X
} from "lucide-react";
import type { ComponentName, LandingPageDocument, PageComponent } from "@/types/page";
import { PageRenderer } from "@/renderer/ComponentRenderer";
import { componentSchemas, creatableComponents } from "@/renderer/schemas/componentSchemas";
import { createDefaultProps, validateComponentTree } from "@/renderer/validation";
import { samplePage } from "@/components/editor/samplePage";
import "./editor.css";

function clonePage(page: LandingPageDocument): LandingPageDocument {
  return JSON.parse(JSON.stringify(page)) as LandingPageDocument;
}

function flattenComponents(components: PageComponent[], depth = 0): Array<PageComponent & { depth: number }> {
  return components.flatMap((component) => [
    { ...component, depth },
    ...flattenComponents(component.children ?? [], depth + 1)
  ]);
}

function updateComponent(
  components: PageComponent[],
  id: string,
  updater: (component: PageComponent) => PageComponent
): PageComponent[] {
  return components.map((component) => {
    if (component.id === id) {
      return updater(component);
    }

    return {
      ...component,
      children: component.children ? updateComponent(component.children, id, updater) : undefined
    };
  });
}

function removeComponent(components: PageComponent[], id: string): PageComponent[] {
  return components
    .filter((component) => component.id !== id)
    .map((component) => ({
      ...component,
      children: component.children ? removeComponent(component.children, id) : undefined
    }));
}

function createComponent(component: ComponentName): PageComponent {
  return {
    id: `${component.toLowerCase()}-${Date.now()}`,
    component,
    props: createDefaultProps(component),
    children: componentSchemas[component].acceptsChildren ? [] : undefined
  };
}

export function LocalPageEditor() {
  const [page, setPage] = useState<LandingPageDocument>(() => clonePage(samplePage));
  const [selectedId, setSelectedId] = useState("hero-title");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<"root" | "child">("root");
  const flatComponents = useMemo(() => flattenComponents(page.components), [page.components]);
  const selectedComponent = flatComponents.find((component) => component.id === selectedId);
  const validation = useMemo(() => validateComponentTree(page.components), [page.components]);

  function updateSelectedProp(fieldName: string, value: string | number) {
    if (!selectedComponent) {
      return;
    }

    setPage((current) => ({
      ...current,
      components: updateComponent(current.components, selectedComponent.id, (component) => ({
        ...component,
        props: {
          ...component.props,
          [fieldName]: value
        }
      }))
    }));
  }

  function openAddModal(mode: "root" | "child") {
    setAddMode(mode);
    setAddModalOpen(true);
  }

  function addRootComponent(componentName: ComponentName) {
    const component = createComponent(componentName);
    setPage((current) => ({
      ...current,
      components: [...current.components, component]
    }));
    setSelectedId(component.id);
  }

  function addChildComponent(componentName: ComponentName) {
    if (!selectedComponent || !componentSchemas[selectedComponent.component].acceptsChildren) {
      return;
    }

    const component = createComponent(componentName);
    setPage((current) => ({
      ...current,
      components: updateComponent(current.components, selectedComponent.id, (item) => ({
        ...item,
        children: [...(item.children ?? []), component]
      }))
    }));
    setSelectedId(component.id);
  }

  function addComponentFromModal(componentName: ComponentName) {
    if (addMode === "child") {
      addChildComponent(componentName);
    } else {
      addRootComponent(componentName);
    }

    setAddModalOpen(false);
  }

  function deleteSelectedComponent() {
    if (!selectedComponent) {
      return;
    }

    setPage((current) => ({
      ...current,
      components: removeComponent(current.components, selectedComponent.id)
    }));
    setSelectedId(page.components[0]?.id ?? "");
  }

  const selectedSchema = selectedComponent ? componentSchemas[selectedComponent.component] : undefined;
  const canAddChild = Boolean(selectedSchema?.acceptsChildren);

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <div className="topbar-title">
          <span className="icon-box" aria-hidden="true">
            <Layers size={17} />
          </span>
          <div>
            <strong>Editor local</strong>
            <span>{page.status === "published" ? "Publicada" : "Rascunho sem API"}</span>
          </div>
        </div>

        <div className="topbar-actions">
          <span className={validation.valid ? "status-pill ok" : "status-pill warning"}>
            {validation.valid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {validation.valid ? "JSON valido" : `${validation.errors.length} alerta(s)`}
          </span>

          <button type="button" className="icon-action" title="Preview local">
            <Eye size={16} />
            <span className="sr-only">Preview local</span>
          </button>

          <button type="button" className="secondary-action" onClick={() => openAddModal("root")}>
            <Plus size={16} />
            Bloco
          </button>

          <button type="button" className="primary-action">
            <Save size={16} />
            Salvo localmente
          </button>
        </div>
      </header>

      <main className="editor-workspace">
        <section className="canvas-column" aria-label="Canvas de montagem">
          <div className="canvas-header">
            <div>
              <span className="eyebrow">Preview sem API</span>
              <h1>{page.name}</h1>
            </div>
            <div className="component-picker">
              <button type="button" className="secondary-action" onClick={() => openAddModal("root")}>
                <Plus size={16} />
                Adicionar na raiz
              </button>
              <button
                type="button"
                className="secondary-action"
                disabled={!canAddChild}
                onClick={() => openAddModal("child")}
              >
                <Plus size={16} />
                Adicionar filho
              </button>
            </div>
          </div>

          <div className="builder-surface">
            <div className="component-outline" aria-label="Arvore de componentes">
              {flatComponents.map((component) => (
                <button
                  key={component.id}
                  className={component.id === selectedId ? "component-item selected" : "component-item"}
                  style={{ paddingLeft: 12 + component.depth * 18 }}
                  onClick={() => setSelectedId(component.id)}
                >
                  <span>{componentSchemas[component.component].label}</span>
                  <small>{component.id}</small>
                </button>
              ))}
            </div>

            <section className="preview-frame" aria-label="Preview da landing page">
              <PageRenderer components={page.components} />
            </section>
          </div>
        </section>

        <aside className="properties-panel" aria-label="Painel de controle">
          <section className="editor-panel">
            <div className="panel-title">
              <FileText size={17} />
              <h2>Pagina</h2>
            </div>
            <label>
              Nome
              <input
                value={page.name}
                onChange={(event) => setPage({ ...page, name: event.target.value })}
              />
            </label>
            <label>
              Slug
              <input
                value={page.seo.slug}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, slug: event.target.value } })
                }
              />
            </label>
            <label>
              Titulo para busca
              <input
                value={page.seo.title}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, title: event.target.value } })
                }
              />
            </label>
            <label>
              Descricao que pode aparecer no Google
              <textarea
                value={page.seo.description}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, description: event.target.value } })
                }
              />
            </label>
          </section>

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
                            updateSelectedProp(field.name, selectedOption?.value ?? event.target.value);
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
                        <textarea
                          value={String(value)}
                          onChange={(event) => updateSelectedProp(field.name, event.target.value)}
                        />
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
                          updateSelectedProp(
                            field.name,
                            field.type === "number" ? Number(event.target.value) : event.target.value
                          )
                        }
                      />
                    </label>
                  );
                })}

                <button type="button" className="danger-action" onClick={deleteSelectedComponent}>
                  <Trash2 size={16} />
                  Remover componente
                </button>
              </>
            ) : (
              <p className="muted-text">Selecione um bloco no canvas para editar seus campos.</p>
            )}
          </section>

          {!validation.valid && (
            <section className="validation-box" role="alert">
              {validation.errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </section>
          )}
        </aside>
      </main>

      <AddComponentModal
        canAddChild={canAddChild}
        mode={addMode}
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSelect={addComponentFromModal}
      />
    </div>
  );
}

type AddComponentModalProps = {
  canAddChild: boolean;
  isOpen: boolean;
  mode: "root" | "child";
  onClose: () => void;
  onSelect: (component: ComponentName) => void;
};

function AddComponentModal({
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
          <button type="button" className="icon-action" onClick={onClose} title="Fechar">
            <X size={16} />
            <span className="sr-only">Fechar</span>
          </button>
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
