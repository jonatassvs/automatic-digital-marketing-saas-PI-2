"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type PageTrackerProps = {
  pageId: string;
  pageSlug: string;
  gtmContainerId?: string | null;
};

export function PageTracker({ pageId, pageSlug, gtmContainerId }: PageTrackerProps) {
  const isValidGtm = Boolean(gtmContainerId && /^GTM-[A-Z0-9]{4,20}$/.test(gtmContainerId));

  useEffect(() => {
    // Inicializa dataLayer
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        pageId,
        pageSlug,
        timestamp: new Date().toISOString()
      });
    }

    // Registra visualização interna de analytics
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", pageId })
    }).catch(() => {
      // Falha silenciosa para não interromper a navegação
    });

    // Captura cliques em botões e chamadas para ação
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest(".base-button, a[id], button[id]");
      if (target) {
        const componentId = target.id || "button";
        const text = target.textContent?.trim() || "";

        // Envia para o dataLayer do Google Tag Manager
        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({
            event: "button_click",
            pageId,
            pageSlug,
            componentId,
            buttonText: text,
            timestamp: new Date().toISOString()
          });
        }

        // Se o componente tiver um ID estável na página, envia para analytics interna
        if (target.id) {
          fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "button_click",
              pageId,
              componentId: target.id
            })
          }).catch(() => {
            // Falha silenciosa
          });
        }
      }
    }

    document.addEventListener("click", handleClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pageId, pageSlug]);

  if (!isValidGtm || !gtmContainerId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${encodeURIComponent(gtmContainerId)}');`
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmContainerId)}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
