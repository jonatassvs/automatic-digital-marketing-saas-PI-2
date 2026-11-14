"use client";

import { useState } from "react";
import { Sparkles, Check, Loader2, AlertCircle, X, Lightbulb, Tag } from "lucide-react";
import { api } from "@/services/api";
import type { LandingPageDocument, SeoSuggestions } from "@/types/page";

type AiSeoModalProps = {
  isOpen: boolean;
  page: LandingPageDocument;
  onClose: () => void;
  onApply: (suggestions: SeoSuggestions) => void;
};

export function AiSeoModal({ isOpen, page, onClose, onApply }: AiSeoModalProps) {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SeoSuggestions | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const suggestions = await api.pages.generateSeo(page.id, {
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        extraNotes: extraNotes.trim() || undefined,
      });
      setResult(suggestions);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha ao gerar dados de SEO com o Gemini. Verifique a chave de API.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply(result);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="ai-seo-title"
        aria-modal="true"
        className="add-component-modal ai-seo-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <header className="modal-header">
          <div>
            <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} color="#2563eb" />
              Inteligência Artificial Google Gemini
            </span>
            <h2 id="ai-seo-title">Otimizador Automático de SEO</h2>
          </div>
          <button
            type="button"
            className="icon-action"
            onClick={onClose}
            title="Fechar"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={18} />
            <span className="sr-only">Fechar</span>
          </button>
        </header>

        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#4b5563" }}>
            O Gemini analisa o conteúdo atual da sua página e gera títulos, meta descrições e palavras-chave
            otimizadas para posicionar seu negócio no Google.
          </p>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                color: "#991b1b",
                fontSize: "0.88rem",
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Erro na geração:</strong>
                <div style={{ marginTop: 2 }}>{error}</div>
              </div>
            </div>
          )}

          {!result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>
                Contexto Adicional do Negócio (opcional):
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.82rem", color: "#4b5563" }}>
                  Categoria / Nicho
                  <input
                    type="text"
                    placeholder="Ex: Consultoria, Barbearia..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.82rem", color: "#4b5563" }}>
                  Cidade / Região
                  <input
                    type="text"
                    placeholder="Ex: Curitiba - PR"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLoading}
                    style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                  />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.82rem", color: "#4b5563" }}>
                Público-Alvo
                <input
                  type="text"
                  placeholder="Ex: Pequenos empresários locais, jovens profissionais..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={isLoading}
                  style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    background: "#2563eb",
                    color: "#ffffff",
                    borderRadius: 6,
                    border: "none",
                    fontWeight: 600,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      Gerando sugestões com Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Gerar Sugestões de SEO
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#166534",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Check size={16} />
                Sugestões geradas com sucesso! Revise os dados abaixo antes de aplicar.
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Título da Página ({result.title.length}/60 caracteres)
                </label>
                <input
                  type="text"
                  value={result.title}
                  onChange={(e) => setResult({ ...result, title: e.target.value, ogTitle: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Descrição para o Google ({result.description.length}/160 caracteres)
                </label>
                <textarea
                  rows={3}
                  value={result.description}
                  onChange={(e) => setResult({ ...result, description: e.target.value, ogDescription: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Slug Amigável
                </label>
                <input
                  type="text"
                  value={result.slug}
                  onChange={(e) => setResult({ ...result, slug: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
                />
              </div>

              {result.keywords.length > 0 && (
                <div>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    <Tag size={14} /> Palavras-chave Recomendadas:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {result.keywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          padding: "3px 8px",
                          borderRadius: 12,
                          fontSize: "0.78rem",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
                    <Lightbulb size={14} color="#eab308" /> Dicas de Melhoria:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.82rem", color: "#475569" }}>
                    {result.suggestions.map((sug, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  style={{ background: "none", border: "none", color: "#4b5563", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  Gerar novamente
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #d1d5db", background: "#ffffff", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      background: "#16a34a",
                      color: "#ffffff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Check size={16} />
                    Aplicar à Página
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

