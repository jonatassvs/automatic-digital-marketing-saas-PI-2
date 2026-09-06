import { FileText } from "lucide-react";
import type { LandingPageDocument } from "@/types/page";

type PageSettingsPanelProps = {
  page: LandingPageDocument;
  onChange: (page: LandingPageDocument) => void;
};

// Provides page-level editing controls such as name, slug, and SEO text.
export function PageSettingsPanel({ page, onChange }: PageSettingsPanelProps) {
  return (
    <section className="editor-panel">
      <div className="panel-title">
        <FileText size={17} />
        <h2>Pagina</h2>
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
    </section>
  );
}
