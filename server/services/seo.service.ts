import type { LandingPageDocument, PageComponent } from "@/types/page";
export class SeoService {
  analyze(page: LandingPageDocument) {
    const issues: { code: string; message: string; componentId?: string }[] = [], headings: number[] = [];
    const issue = (code: string, message: string, componentId?: string) => issues.push({ code, message, ...(componentId ? { componentId } : {}) });
    const seo = page.seo;
    if (seo.title.trim().length < 30 || seo.title.trim().length > 60) issue("title_length", "Prefira um titulo descritivo entre 30 e 60 caracteres.");
    if (seo.description.trim().length < 70 || seo.description.trim().length > 160) issue("description_length", "Descreva seu negocio em cerca de 70 a 160 caracteres para os buscadores.");
    if (!seo.canonicalUrl) issue("canonical_missing", "Informe o endereco principal desta pagina.");
    if (!seo.robotsIndex) issue("index_disabled", "A pagina esta configurada para nao aparecer nos buscadores.");
    const visit = (nodes: PageComponent[]) => {
      for (const node of nodes) {
        if (node.component === "Text" && node.props.type === "heading") {
          const level = Number(String(node.props.level ?? "h2")[1]);
          if (headings.length && level > headings[headings.length - 1] + 1) issue("heading_order", "Organize os titulos sem pular niveis.", node.id);
          headings.push(level);
        }
        if (node.component === "Image" && !String(node.props.alt ?? "").trim()) issue("image_alt", "Descreva a imagem para quem usa leitor de tela.", node.id);
        visit(node.children ?? []);
      }
    };
    visit(page.components);
    if (headings.filter(level => level === 1).length !== 1) issue("primary_heading", "Use um unico titulo principal (H1) para apresentar a pagina.");
    return { issues, issueCount: issues.length };
  }
}
