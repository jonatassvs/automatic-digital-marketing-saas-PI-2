import Link from "next/link";
import { ArrowLeft, Check, Eye, Globe, GlobeLock, Layers, Save } from "lucide-react";
import type { LandingPageDocument } from "@/types/page";
import { AppButton } from "@/components/ui/AppButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { StatusPill } from "@/components/ui/StatusPill";

type EditorTopbarProps = {
  page: LandingPageDocument;
  validationErrorCount: number;
  validationIsValid: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveMessage?: string | null;
  onTogglePublish?: () => void;
  isPublishing?: boolean;
  backHref?: string;
  previewHref?: string;
};

// Renders the editor header with page status, validation, and primary actions.
export function EditorTopbar({
  page,
  validationErrorCount,
  validationIsValid,
  onSave,
  isSaving = false,
  saveMessage,
  onTogglePublish,
  isPublishing = false,
  backHref,
  previewHref
}: EditorTopbarProps) {
  const isPublished = page.status === "published";

  return (
    <header className="editor-topbar">
      <div className="topbar-title">
        {backHref ? (
          <Link href={backHref} title="Voltar ao painel" style={{ textDecoration: "none" }}>
            <IconBadge>
              <ArrowLeft size={17} />
            </IconBadge>
          </Link>
        ) : (
          <IconBadge>
            <Layers size={17} />
          </IconBadge>
        )}
        <div>
          <strong>{page.name || "Editor de Página"}</strong>
          <span>
            {isPublished ? "Página Publicada" : "Rascunho (Privado)"}
            {saveMessage && ` • ${saveMessage}`}
          </span>
        </div>
      </div>

      <div className="topbar-actions">
        <StatusPill errorCount={validationErrorCount} isValid={validationIsValid} />

        {previewHref && (
          <Link href={previewHref} target="_blank" style={{ textDecoration: "none" }}>
            <AppButton variant="secondary" title="Abrir visualização da página">
              <Eye size={16} />
              <span>Preview</span>
            </AppButton>
          </Link>
        )}

        {onTogglePublish && (
          <AppButton
            variant="secondary"
            onClick={onTogglePublish}
            disabled={isPublishing}
            title={isPublished ? "Despublicar página" : "Tornar pública"}
          >
            {isPublished ? <GlobeLock size={16} /> : <Globe size={16} />}
            <span>{isPublishing ? "Processando..." : isPublished ? "Despublicar" : "Publicar"}</span>
          </AppButton>
        )}

        <AppButton
          variant="primary"
          onClick={onSave}
          disabled={isSaving || !validationIsValid}
          title={!validationIsValid ? "Corrija os erros de validação antes de salvar" : "Salvar alterações no banco"}
        >
          {isSaving ? (
            <>
              <Save size={16} />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Salvar Página</span>
            </>
          )}
        </AppButton>
      </div>
    </header>
  );
}
