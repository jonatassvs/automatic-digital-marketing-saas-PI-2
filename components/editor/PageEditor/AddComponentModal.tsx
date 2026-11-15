import { useMemo, useState } from "react";
import {
  Atom,
  Boxes,
  Columns3,
  Compass,
  Grid3x3,
  Image as ImageIcon,
  Layers,
  LayoutPanelTop,
  LayoutTemplate,
  Link2,
  MessageSquare,
  MousePointerClick,
  MoveVertical,
  Search,
  Sparkles,
  Square,
  Type,
  X
} from "lucide-react";
import type { ComponentName, PageComponent } from "@/types/page";
import type { ComponentCategory } from "@/renderer/schemas/schemaTypes";
import { AppButton } from "@/components/ui/AppButton";
import { ATOMIC_CATEGORIES, componentCatalog, type CatalogItem } from "./componentCatalog";
import type { AddTarget } from "./types";

type AddComponentModalProps = {
  canAddChild: boolean;
  isOpen: boolean;
  target: AddTarget;
  onClose: () => void;
  onSelect: (componentOrNode: ComponentName | PageComponent) => void;
};

type FilterTab = "all" | ComponentCategory;

function getComponentIcon(item: CatalogItem) {
  if (item.isPreset) {
    return item.category === "organism" ? <LayoutTemplate size={18} /> : <Sparkles size={18} />;
  }

  switch (item.componentName) {
    case "Text":
      return <Type size={18} />;
    case "Button":
      return <MousePointerClick size={18} />;
    case "Image":
      return <ImageIcon size={18} />;
    case "Link":
      return <Link2 size={18} />;
    case "Spacer":
      return <MoveVertical size={18} />;
    case "Container":
      return <Square size={18} />;
    case "Flex":
      return <Columns3 size={18} />;
    case "Grid":
      return <Grid3x3 size={18} />;
    case "Form":
      return <MessageSquare size={18} />;
    case "Navbar":
      return <Compass size={18} />;
    case "Section":
      return <LayoutPanelTop size={18} />;
    default:
      return <Layers size={18} />;
  }
}

function getCategoryIcon(category: ComponentCategory) {
  switch (category) {
    case "atom":
      return <Atom size={16} />;
    case "molecule":
      return <Boxes size={16} />;
    case "organism":
      return <LayoutTemplate size={16} />;
  }
}

// Lets users choose which page-builder component (Atom, Molecule, or Organism) to add next.
export function AddComponentModal({
  canAddChild,
  isOpen,
  target,
  onClose,
  onSelect
}: AddComponentModalProps) {
  const [activeCategory, setActiveCategory] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return componentCatalog.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.componentName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeCategory, normalizedQuery]);

  const countsByCategory = useMemo(() => {
    return {
      all: componentCatalog.length,
      atom: componentCatalog.filter((item) => item.category === "atom").length,
      molecule: componentCatalog.filter((item) => item.category === "molecule").length,
      organism: componentCatalog.filter((item) => item.category === "organism").length
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const isChildTarget = target.kind === "child" && canAddChild;

  const visibleCategories =
    activeCategory === "all"
      ? ATOMIC_CATEGORIES
      : ATOMIC_CATEGORIES.filter((cat) => cat.id === activeCategory);

  function handleSelectItem(item: CatalogItem) {
    if (item.isPreset) {
      onSelect(item.createNode());
    } else {
      onSelect(item.componentName);
    }
  }

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
            <span className="eyebrow">Biblioteca Atomic Design</span>
            <h2 id="add-component-title">Adicionar componente</h2>
            <p className="modal-subtitle">
              {isChildTarget
                ? "Inserindo dentro do componente selecionado"
                : "Inserindo na estrutura principal da página"}
            </p>
          </div>
          <AppButton variant="icon" onClick={onClose} title="Fechar">
            <X size={16} />
            <span className="sr-only">Fechar</span>
          </AppButton>
        </header>

        <div className="add-component-modal-controls">
          <div className="add-component-search">
            <Search size={16} aria-hidden="true" className="add-component-search-icon" />
            <input
              type="search"
              placeholder="Buscar por nome ou função (ex: botão, card, hero, grade)..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Buscar componente"
            />
          </div>

          <div className="atomic-category-tabs" role="tablist" aria-label="Categorias de componentes">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              className={`atomic-tab ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              <Layers size={15} aria-hidden="true" />
              <span>Todos</span>
              <span className="atomic-tab-count">{countsByCategory.all}</span>
            </button>

            {ATOMIC_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                className={`atomic-tab atomic-tab-${category.id} ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {getCategoryIcon(category.id)}
                <span>{category.label}</span>
                <span className="atomic-tab-count">{countsByCategory[category.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="add-component-modal-body" role="region" aria-label="Lista de componentes disponíveis">
          {filteredItems.length === 0 ? (
            <div className="add-component-empty">
              <p>Nenhum componente encontrado para &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            visibleCategories.map((category) => {
              const categoryItems = filteredItems.filter((item) => item.category === category.id);
              if (categoryItems.length === 0) {
                return null;
              }

              return (
                <section
                  key={category.id}
                  className={`atomic-category-section atomic-section-${category.id}`}
                  aria-labelledby={`atomic-heading-${category.id}`}
                >
                  <div className="atomic-category-header">
                    <div className="atomic-category-title">
                      <span className={`atomic-category-badge atomic-badge-${category.id}`}>
                        {getCategoryIcon(category.id)}
                        <strong id={`atomic-heading-${category.id}`}>{category.label}</strong>
                      </span>
                      <span className="atomic-category-count">
                        {categoryItems.length} {categoryItems.length === 1 ? "item" : "itens"}
                      </span>
                    </div>
                    <p className="atomic-category-description">{category.description}</p>
                  </div>

                  <div className="component-card-grid">
                    {categoryItems.map((item) => (
                      <button
                        type="button"
                        className={`component-card component-card-${item.category} ${
                          item.isPreset ? "component-card-preset" : ""
                        }`}
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                      >
                        <span
                          className={`component-card-icon component-icon-${item.category}`}
                          aria-hidden="true"
                        >
                          {getComponentIcon(item)}
                        </span>
                        <span className="component-card-content">
                          <span className="component-card-title-row">
                            <strong>{item.label}</strong>
                            {item.badge ? (
                              <span
                                className={`component-card-pill ${
                                  item.isPreset ? "preset-pill" : "base-pill"
                                }`}
                              >
                                {item.badge}
                              </span>
                            ) : null}
                          </span>
                          <small>{item.description}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
