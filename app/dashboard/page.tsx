"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Edit3,
  Eye,
  Globe,
  GlobeLock,
  Copy,
  Trash2,
  LogOut,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { api } from "@/services/api";
import type { LandingPageDocument } from "@/types/page";
import "@/components/dashboard/dashboard.scss";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [pages, setPages] = useState<LandingPageDocument[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal de Nova Página
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageDesc, setNewPageDesc] = useState("");
  const [newPageTemplate, setNewPageTemplate] = useState<"sample" | "blank">("sample");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    let ignore = false;

    async function fetchPages() {
      try {
        const data = await api.pages.list();
        if (!ignore) {
          setPages(data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Erro ao carregar páginas.";
          setErrorMessage(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoadingPages(false);
        }
      }
    }

    if (user) {
      fetchPages();
    }

    return () => {
      ignore = true;
    };
  }, [user]);

  function handleNameChange(name: string) {
    setNewPageName(name);
    setNewPageSlug(slugify(name));
  }

  async function handleCreatePage(e: FormEvent) {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const finalSlug = slugify(newPageSlug || newPageName);
    if (!finalSlug) {
      setErrorMessage("O slug (endereço) da página é obrigatório.");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const created = await api.pages.create({
        name: newPageName.trim(),
        slug: finalSlug,
        description: newPageDesc.trim(),
        template: newPageTemplate
      });

      setIsModalOpen(false);
      setNewPageName("");
      setNewPageSlug("");
      setNewPageDesc("");
      router.push(`/editor/${created.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar página.";
      setErrorMessage(msg);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleTogglePublish(page: LandingPageDocument) {
    try {
      let updated: LandingPageDocument;
      if (page.status === "published") {
        updated = await api.pages.unpublish(page.id);
        setSuccessMessage(`Página "${page.name}" despublicada.`);
      } else {
        updated = await api.pages.publish(page.id);
        setSuccessMessage(`Página "${page.name}" publicada com sucesso!`);
      }
      setPages((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar estado de publicação.";
      setErrorMessage(msg);
    }
  }

  async function handleDuplicate(page: LandingPageDocument) {
    try {
      const duplicated = await api.pages.duplicate(page.id);
      setSuccessMessage(`Cópia de "${page.name}" criada.`);
      setPages((current) => [duplicated, ...current]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao duplicar página.";
      setErrorMessage(msg);
    }
  }

  async function handleDelete(page: LandingPageDocument) {
    if (!window.confirm(`Tem certeza que deseja excluir a página "${page.name}"?`)) {
      return;
    }

    try {
      await api.pages.delete(page.id);
      setSuccessMessage(`Página "${page.name}" excluída.`);
      setPages((current) => current.filter((p) => p.id !== page.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir página.";
      setErrorMessage(msg);
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="auth-page">
        <p style={{ color: "#64748b" }}>Carregando sua sessão...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <nav className="dashboard-nav">
        <Link href="/dashboard" className="nav-brand">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <span className="brand-name">Landra</span>
        </Link>

        <div className="nav-user">
          <span className="user-greeting">
            Olá, <span className="user-name">{user.name}</span>
          </span>
          <button type="button" className="btn-logout" onClick={() => logout()}>
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-title-group">
            <h1>Minhas Landing Pages</h1>
            <p>Gerencie, edite e acompanhe o status das suas páginas</p>
          </div>

          <button
            type="button"
            className="btn-primary-action"
            onClick={() => {
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            <span>Nova Página</span>
          </button>
        </div>

        {errorMessage && (
          <div className="auth-error" style={{ marginBottom: "20px" }} role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: "10px 14px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              borderRadius: "8px",
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {isLoadingPages ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
            Carregando páginas...
          </p>
        ) : pages.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">
              <Layers size={32} />
            </div>
            <h2 className="empty-title">Você ainda não criou nenhuma página</h2>
            <p className="empty-desc">
              Comece agora mesmo criando sua primeira landing page com componentes fáceis de editar.
            </p>
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              <span>Criar Primeira Página</span>
            </button>
          </div>
        ) : (
          <div className="pages-grid">
            {pages.map((p) => {
              const isPublished = p.status === "published";
              return (
                <div key={p.id} className="page-card">
                  <div className="card-top">
                    <h3 className="card-title">{p.name}</h3>
                    <span
                      className={`status-badge ${
                        isPublished ? "status-published" : "status-draft"
                      }`}
                    >
                      {isPublished ? "Publicada" : "Rascunho"}
                    </span>
                  </div>

                  <div className="card-info">
                    <div className="info-row">
                      <strong>Slug:</strong>
                      {isPublished ? (
                        <Link
                          href={`/p/${p.seo.slug}`}
                          target="_blank"
                          className="info-link"
                          title="Abrir página pública"
                        >
                          /p/{p.seo.slug} <ExternalLink size={12} style={{ verticalAlign: "middle" }} />
                        </Link>
                      ) : (
                        <span>/p/{p.seo.slug}</span>
                      )}
                    </div>
                    <div className="info-row">
                      <span>{p.components.length} seções/blocos cadastrados</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <div className="actions-primary">
                      <Link href={`/editor/${p.id}`} className="btn-card btn-card-edit">
                        <Edit3 size={15} />
                        <span>Editar</span>
                      </Link>

                      <Link href={`/preview/${p.id}`} className="btn-card btn-card-preview" target="_blank">
                        <Eye size={15} />
                        <span>Preview</span>
                      </Link>
                    </div>

                    <div className="actions-secondary">
                      <button
                        type="button"
                        className="btn-icon-action"
                        title={isPublished ? "Despublicar página" : "Publicar página"}
                        onClick={() => handleTogglePublish(p)}
                      >
                        {isPublished ? <GlobeLock size={16} /> : <Globe size={16} />}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action"
                        title="Duplicar página"
                        onClick={() => handleDuplicate(p)}
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action btn-icon-danger"
                        title="Excluir página"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Nova Página */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !isCreating && setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Criar Nova Landing Page</h2>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
              >
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleCreatePage}>
              <div className="auth-field">
                <label htmlFor="page-name">Nome da Página</label>
                <input
                  id="page-name"
                  type="text"
                  value={newPageName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Consultoria Financeira"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="page-slug">Endereço da URL (Slug)</label>
                <input
                  id="page-slug"
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(slugify(e.target.value))}
                  placeholder="ex: consultoria-financeira"
                  required
                />
                <span className="auth-hint">Será acessível em: /p/{newPageSlug || "sua-pagina"}</span>
              </div>

              <div className="auth-field">
                <label htmlFor="page-desc">Descrição SEO (opcional)</label>
                <input
                  id="page-desc"
                  type="text"
                  value={newPageDesc}
                  onChange={(e) => setNewPageDesc(e.target.value)}
                  placeholder="Breve descrição que aparecerá nos resultados do Google"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="page-template">Modelo inicial</label>
                <select
                  id="page-template"
                  value={newPageTemplate}
                  onChange={(e) => setNewPageTemplate(e.target.value as "sample" | "blank")}
                >
                  <option value="sample">Modelo Completo (Navbar, Hero, Diferenciais, Contato e Footer)</option>
                  <option value="blank">Página Simples (Inicial em Branco)</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-action" disabled={isCreating}>
                  {isCreating ? "Criando..." : "Criar e Abrir no Editor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
