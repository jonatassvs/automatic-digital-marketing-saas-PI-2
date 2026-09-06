import { Eye, Layers, Save } from "lucide-react";
import type { LandingPageDocument } from "@/types/page";
import { AppButton } from "@/components/ui/AppButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { StatusPill } from "@/components/ui/StatusPill";

type EditorTopbarProps = {
  page: LandingPageDocument;
  validationErrorCount: number;
  validationIsValid: boolean;
};

// Renders the editor header with page status, validation, and primary actions.
export function EditorTopbar({
  page,
  validationErrorCount,
  validationIsValid
}: EditorTopbarProps) {
  return (
    <header className="editor-topbar">
      <div className="topbar-title">
        <IconBadge>
          <Layers size={17} />
        </IconBadge>
        <div>
          <strong>Editor local</strong>
          <span>{page.status === "published" ? "Publicada" : "Rascunho sem API"}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <StatusPill errorCount={validationErrorCount} isValid={validationIsValid} />

        <AppButton variant="icon" title="Preview local">
          <Eye size={16} />
          <span className="sr-only">Preview local</span>
        </AppButton>

        <AppButton variant="primary">
          <Save size={16} />
          Salvo localmente
        </AppButton>
      </div>
    </header>
  );
}
