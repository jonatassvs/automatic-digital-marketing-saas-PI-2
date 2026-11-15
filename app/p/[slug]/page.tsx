import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApplication } from "@/server/application";
import { PageRenderer } from "@/renderer/ComponentRenderer";
import { PageTracker } from "@/components/analytics/PageTracker";
import type { LandingPageDocument } from "@/types/page";

type PublicPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPageBySlug(slug: string): Promise<LandingPageDocument | null> {
  try {
    const app = await getApplication();
    const res = await app.controllers.pages.published({
      params: { slug },
      request: new Request("http://localhost"),
      owner: "",
      token: ""
    });

    if (res.status === 200) {
      const payload = await res.json();
      return payload.data as LandingPageDocument;
    }
    return null;
  } catch {
    return null;
  }
}

async function getIntegrationsBySlug(slug: string) {
  try {
    const app = await getApplication();
    const res = await app.controllers.integrations.published({
      params: { slug },
      request: new Request("http://localhost"),
      owner: "",
      token: ""
    });

    if (res.status === 200) {
      const payload = await res.json();
      return payload.data as { gtm: { containerId: string } | null };
    }
    return { gtm: null };
  } catch {
    return { gtm: null };
  }
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Página não encontrada"
    };
  }

  const seo = page.seo;
  return {
    title: seo.title || page.name,
    description: seo.description,
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow
    },
    openGraph: {
      title: seo.ogTitle || seo.title || page.name,
      description: seo.ogDescription || seo.description,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {})
    },
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined
  };
}

export default async function PublicLandingPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const [page, integrations] = await Promise.all([
    getPageBySlug(slug),
    getIntegrationsBySlug(slug)
  ]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageTracker
        pageId={page.id}
        pageSlug={page.seo.slug}
        gtmContainerId={integrations?.gtm?.containerId}
      />
      <PageRenderer design={page.design} components={page.components} />
    </>
  );
}

