"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Layers } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { PageEditor } from "@/components/editor/PageEditor";
import { api } from "@/services/api";
import type { LandingPageDocument } from "@/types/page";

type EditorPageProps = {
  params: Promise<{ pageId: string }>;
};

export default function EditorPageRoute({ params }: EditorPageProps) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.pageId;
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [page, setPage] = useState<LandingPageDocument | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      if (!user) return;
      setIsLoadingPage(true);
      setLoadError(null);

      try {
        const data = await api.pages.get(pageId);
        if (isMounted) {
          setPage(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Não foi possível carregar a página.";
          setLoadError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPage(false);
        }
      }
    }

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [pageId, user]);

  async function handleSave(updatedPage: LandingPageDocument) {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const saved = await api.pages.update(pageId, {
        name: updatedPage.name,
        status: updatedPage.status,
        seo: updatedPage.seo,
        design: updatedPage.design,
        components: updatedPage.components
      });
      setPage(saved);
      setSaveMessage("Salvo no banco com sucesso!");
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar alterações.";
      alert(`Erro ao salvar: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTogglePublish() {
    if (!page) return;
    setIsPublishing(true);

    try {
      let result: LandingPageDocument;
      if (page.status === "published") {
        result = await api.pages.unpublish(pageId);
        setSaveMessage("Página despublicada.");
      } else {
        result = await api.pages.publish(pageId);
        setSaveMessage("Página publicada com sucesso!");
      }
      setPage(result);
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar estado de publicação.";
      alert(msg);
    } finally {
      setIsPublishing(false);
    }
  }

  if (isAuthLoading || isLoadingPage) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "16px",
          color: "#64748b"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Layers size={22} />
        </div>
        <span>Carregando página do MongoDB...</span>
      </div>
    );
  }

  if (loadError || !page) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
          textAlign: "center"
        }}
      >
        <AlertCircle size={48} color="#dc2626" style={{ marginBottom: "16px" }} />
        <h1 style={{ fontSize: "1.4rem", color: "#0f172a", margin: "0 0 8px" }}>
          Página não encontrada
        </h1>
        <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 0 24px" }}>
          {loadError || "Essa página não existe ou você não tem permissão para editá-la."}
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>
      </div>
    );
  }

  return (
    <PageEditor
      key={page.id}
      initialPage={page}
      onSave={handleSave}
      onTogglePublish={handleTogglePublish}
      isSaving={isSaving}
      saveMessage={saveMessage}
      isPublishing={isPublishing}
      backHref="/dashboard"
      previewHref={`/preview/${pageId}`}
    />
  );
}
