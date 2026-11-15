"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Sparkles, Tag, HelpCircle, ExternalLink, Check, AlertCircle } from "lucide-react";
import { PageAppearanceSettings } from "./PageAppearanceSettings";
import { AiSeoModal } from "./AiSeoModal";
import type { LandingPageDocument, SeoSuggestions } from "@/types/page";

type PageSettingsPanelProps = {
  page: LandingPageDocument;
  onChange: (page: LandingPageDocument) => void;
};

// Provides page-level editing controls such as name, slug, SEO text, and integrations.
export function PageSettingsPanel({ page, onChange }: PageSettingsPanelProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const gtmId = page.integrations?.gtm?.containerId ?? "";
  const isGtmValid = !gtmId || /^GTM-[A-Z0-9]{4,20}$/.test(gtmId);

  const handleGtmChange = (value: string) => {
    const clean = value.trim().toUpperCase();
    onChange({
      ...page,
      integrations: {
        gtm: clean ? { containerId: clean } : null
      }
    });
  };

  const handleApplyAiSeo = (suggestions: SeoSuggestions) => {
    onChange({
      ...page,
      seo: {
        ...page.seo,
        title: suggestions.title,
        description: suggestions.description,
        slug: suggestions.slug,
        ogTitle: suggestions.ogTitle,
        ogDescription: suggestions.ogDescription,
      },
    });
  };

  return (
    <section className="editor-panel">
      <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={17} />
          <h2>Pagina</h2>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 6,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          title="Otimizar títulos e descrições com inteligência artificial"
        >
          <Sparkles size={16} />
          Otimizar SEO com Gemini
        </button>
      </div>

      <label>
        Nome
        <input value={page.name} onChange={(event) => onChange({ ...page, name: event.target.value })} />
      </label>
      <label>
        Slug
        <input
          value={page.seo.slug}
          onChange={(event) => onChange({ ...page, seo: { ...page.seo, slug: event.target.value } })}
        />
      </label>
      <label>
        Titulo para busca
        <input
          value={page.seo.title}
          onChange={(event) => onChange({ ...page, seo: { ...page.seo, title: event.target.value } })}
        />
      </label>
      <label>
        Descricao que pode aparecer no Google
        <textarea
          value={page.seo.description}
          onChange={(event) => onChange({ ...page, seo: { ...page.seo, description: event.target.value } })}
        />
      </label>

      {/* Seção do Google Tag Manager */}
      <div
        style={{
          marginTop: 8,
          padding: "12px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          display: "grid",
          gap: 8
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#1e293b" }}>
          <Tag size={16} color="#2563eb" />
          <strong style={{ fontSize: "0.88rem" }}>Google Tag Manager</strong>
        </div>

        <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4 }}>
          Insira o Container ID para capturar automaticamente eventos da página (page_view, cliques em botões e conversões).
        </p>

        <label style={{ display: "grid", gap: 5, margin: 0 }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155" }}>ID do Contêiner</span>
          <input
            type="text"
            placeholder="Ex: GTM-XXXXXXX"
            value={gtmId}
            onChange={(e) => handleGtmChange(e.target.value)}
            style={{
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontSize: "0.88rem",
              borderColor: !isGtmValid ? "#ef4444" : undefined,
              background: "#ffffff"
            }}
          />
        </label>

        {/* Link para o tutorial abaixo do campo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href="/tutoriais/google-tag-manager"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              color: "#2563eb",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 600,
              padding: "2px 0"
            }}
          >
            <HelpCircle size={14} />
            <span>Como obter esse ID? Ver tutorial passo a passo</span>
            <ExternalLink size={12} />
          </Link>

          {!isGtmValid && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#dc2626" }}>
              <AlertCircle size={13} />
              <span>Formato inválido. Use <code>GTM-XXXXXXX</code> com letras maiúsculas e números.</span>
            </div>
          )}

          {isGtmValid && gtmId && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#16a34a" }}>
              <Check size={13} />
              <span>ID válido! Salve a página para ativar o rastreamento.</span>
            </div>
          )}
        </div>
      </div>

      <PageAppearanceSettings page={page} onChange={onChange} />

      <AiSeoModal
        isOpen={isAiModalOpen}
        page={page}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleApplyAiSeo}
      />
    </section>
  );
}
