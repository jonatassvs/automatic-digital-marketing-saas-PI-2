"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3, ExternalLink, Globe } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { PageRenderer } from "@/renderer/ComponentRenderer";
import { api } from "@/services/api";
import type { LandingPageDocument } from "@/types/page";

type PreviewPageProps = {
  params: Promise<{ pageId: string }>;
};

export default function PreviewPageRoute({ params }: PreviewPageProps) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.pageId;
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [page, setPage] = useState<LandingPageDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadPage() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await api.pages.get(pageId);
        if (isMounted) setPage(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erro ao carregar preview.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPage();
    return () => {
      isMounted = false;
    };
  }, [pageId, user]);

  if (isAuthLoading || isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#64748b" }}>
        Carregando visualização...
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <h2>Não foi possível carregar a visualização</h2>
        <p style={{ color: "#64748b" }}>{error || "Página não encontrada."}</p>
        <Link href="/dashboard" style={{ color: "#2563eb", fontWeight: 600 }}>
          Voltar ao painel
        </Link>
      </div>
    );
  }

  const isPublished = page.status === "published";

  return (
    <div>
      <aside
        style={{
          position: "sticky",
          top: 0,
          zIndex: 9999,
          background: "rgba(15, 23, 42, 0.95)",
          color: "#ffffff",
          backdropFilter: "blur(6px)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.82rem", background: "#3b82f6", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
            PREVIEW PRIVADO
          </span>
          <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{page.name}</span>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            ({isPublished ? "Página Publicada" : "Rascunho"})
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isPublished && (
            <Link
              href={`/p/${page.seo.slug}`}
              target="_blank"
              style={{
                color: "#60a5fa",
                textDecoration: "none",
                fontSize: "0.84rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Globe size={14} /> Abrir pública <ExternalLink size={12} />
            </Link>
          )}

          <Link
            href={`/editor/${pageId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.84rem",
              fontWeight: 600
            }}
          >
            <Edit3 size={14} /> Editar Página
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "0.84rem"
            }}
          >
            <ArrowLeft size={14} /> Painel
          </Link>
        </div>
      </aside>

      <PageRenderer design={page.design} components={page.components} />
    </div>
  );
}

