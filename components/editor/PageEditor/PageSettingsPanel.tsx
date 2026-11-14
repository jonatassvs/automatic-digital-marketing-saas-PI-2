"use client";

import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { PageAppearanceSettings } from "./PageAppearanceSettings";
import { AiSeoModal } from "./AiSeoModal";
import type { LandingPageDocument, SeoSuggestions } from "@/types/page";

type PageSettingsPanelProps = {
  page: LandingPageDocument;
  onChange: (page: LandingPageDocument) => void;
};

// Provides page-level editing controls such as name, slug, and SEO text.
export function PageSettingsPanel({ page, onChange }: PageSettingsPanelProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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
