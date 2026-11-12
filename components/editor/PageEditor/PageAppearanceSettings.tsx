import { useState } from "react";
import type { LandingPageDocument } from "@/types/page";
import { GOOGLE_FONTS, MAX_MOBILE_MAX_WIDTH, MIN_MOBILE_MAX_WIDTH, MAX_PAGE_FONTS, normalizePageDesign, removePageFont, fontStack } from "@/renderer/pageDesign";
import { AppButton } from "@/components/ui/AppButton";

export function PageAppearanceSettings({ page, onChange }: {
  page: LandingPageDocument;
  onChange: (page: LandingPageDocument) => void;
}) {
  const design = normalizePageDesign(page.design);
  const [query, setQuery] = useState("");
  const available = GOOGLE_FONTS.filter(font => !design.fonts.includes(font) && font.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <details className="settings-group" open>
      <summary>Mobile e desktop</summary>
      <div className="settings-group-fields">
        <label>
          Largura máxima do mobile (px)
          <input type="number" min={MIN_MOBILE_MAX_WIDTH} max={MAX_MOBILE_MAX_WIDTH} step={1}
            value={page.design?.mobileMaxWidth ?? design.mobileMaxWidth}
            onChange={event => onChange({ ...page, design: { ...design, mobileMaxWidth: Number(event.target.value) } })} />
        </label>
        <p className="muted-text">Mobile até {design.mobileMaxWidth} px. Desktop acima de {design.mobileMaxWidth} px. Este limite controla os estilos, os tamanhos de texto e as colunas da página.</p>
      </div>
    </details>
    <details className="settings-group">
      <summary>Fontes da página</summary>
      <div className="settings-group-fields">
        <label>
          Fonte padrão
          <select value={design.defaultFont} onChange={event => onChange({ ...page, design: { ...design, defaultFont: event.target.value } })}>
            <option value="system">Fonte do sistema</option>
            {design.fonts.map(font => <option value={font} key={font}>{font}</option>)}
          </select>
        </label>
        <p className="muted-text">Adicione até {MAX_PAGE_FONTS} fontes do Google Fonts. Textos, botões e links podem usar uma fonte diferente da padrão. Se a fonte não carregar, será usada a fonte do sistema.</p>
        <ul className="page-font-list" aria-label="Fontes adicionadas">
          {design.fonts.map(font => <li key={font}>
            <span style={{ fontFamily: fontStack(font) }}>{font}</span>
            <AppButton title={`Remover ${font}`} onClick={() => onChange(removePageFont(page, font))}>Remover</AppButton>
          </li>)}
        </ul>
        {design.fonts.length > 0 ? <p className="muted-text">Ao remover uma fonte, os textos que a utilizam voltam ao padrão da página.</p> : null}
        <label>
          Buscar no catálogo do Google Fonts
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: Roboto, Lora" />
        </label>
        <ul className="page-font-list page-font-catalog" aria-label="Catálogo de fontes">
          {available.map(font => <li key={font}>
            <span>{font}</span>
            <AppButton disabled={design.fonts.length >= MAX_PAGE_FONTS} title={`Adicionar ${font}`} onClick={() => onChange({ ...page, design: { ...design, fonts: [...design.fonts, font] } })}>Adicionar</AppButton>
          </li>)}
        </ul>
        {!available.length ? <p className="muted-text">Nenhuma fonte disponível para esta busca.</p> : null}
      </div>
    </details>
  </>;
}
