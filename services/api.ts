import type { LandingPageDocument, PageComponent, PageDesign, SeoConfig, SeoGenerateInput, SeoSuggestions } from "@/types/page";
import { samplePage } from "@/components/editor/samplePage";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: AuthUser;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lb_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("lb_token", token);
  else localStorage.removeItem("lb_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || `Erro ${response.status}: falha na requisicao.`;
    const code = payload?.error?.code || "request_failed";
    const error = new Error(message) as Error & { code?: string; status?: number };
    error.code = code;
    error.status = response.status;
    throw error;
  }

  return payload.data as T;
}

export const api = {
  auth: {
    async register(name: string, email: string, password: string): Promise<AuthUser> {
      return request<AuthUser>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
    },

    async login(email: string, password: string): Promise<LoginResponse> {
      const data = await request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      return data;
    },

    async me(): Promise<AuthUser> {
      return request<AuthUser>("/api/auth/me", { method: "GET" });
    },

    async logout(): Promise<void> {
      try {
        await request<void>("/api/auth/logout", { method: "POST" });
      } finally {
        setToken(null);
      }
    },
  },

  pages: {
    async list(): Promise<LandingPageDocument[]> {
      return request<LandingPageDocument[]>("/api/pages", { method: "GET" });
    },

    async get(id: string): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/pages/${id}`, { method: "GET" });
    },

    async create(input: {
      name: string;
      slug: string;
      description?: string;
      template?: "sample" | "blank";
    }): Promise<LandingPageDocument> {
      const template = input.template ?? "sample";
      let components: PageComponent[] = [];
      let design: PageDesign = { mobileMaxWidth: 720, fonts: ["Inter"], defaultFont: "Inter" };

      if (template === "sample") {
        components = JSON.parse(JSON.stringify(samplePage.components));
        if (samplePage.design) {
          design = JSON.parse(JSON.stringify(samplePage.design));
        }
      } else {
        components = [
          {
            id: "section-main",
            component: "Section",
            props: {
              mobilePaddingTop: 48,
              mobilePaddingBottom: 48,
              desktopPaddingTop: 80,
              desktopPaddingBottom: 80,
              mobileBackgroundColor: "#ffffff",
            },
            children: [
              {
                id: "container-main",
                component: "Container",
                props: {
                  maxWidth: 1100,
                },
                children: [
                  {
                    id: "text-title",
                    component: "Text",
                    props: {
                      tag: "h1",
                      text: input.name,
                      fontSizeMobile: 32,
                      fontSizeDesktop: 48,
                      useDesktopFontSize: true,
                      align: "center",
                      mobileMarginBottom: 16,
                    },
                  },
                  {
                    id: "text-subtitle",
                    component: "Text",
                    props: {
                      tag: "p",
                      text: input.description || "Descricao da sua nova pagina.",
                      fontSizeMobile: 18,
                      fontSizeDesktop: 20,
                      align: "center",
                      color: "#4b5563",
                      mobileMarginBottom: 32,
                    },
                  },
                  {
                    id: "btn-cta",
                    component: "Button",
                    props: {
                      text: "Fale Conosco",
                      align: "center",
                      size: "large",
                      variant: "primary",
                      fullWidth: false,
                    },
                  },
                ],
              },
            ],
          },
        ];
      }

      const seo: SeoConfig = {
        title: input.name,
        description: input.description || `Landing page de ${input.name}`,
        slug: input.slug,
        canonicalUrl: "",
        ogTitle: input.name,
        ogDescription: input.description || "",
        ogImage: "",
        robotsIndex: true,
        robotsFollow: true,
      };

      return request<LandingPageDocument>("/api/pages", {
        method: "POST",
        body: JSON.stringify({
          name: input.name,
          status: "draft",
          seo,
          design,
          components,
        }),
      });
    },

    async update(id: string, page: Partial<LandingPageDocument>): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/pages/${id}`, {
        method: "PUT",
        body: JSON.stringify(page),
      });
    },

    async delete(id: string): Promise<void> {
      return request<void>(`/api/pages/${id}`, { method: "DELETE" });
    },

    async publish(id: string): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/pages/${id}/publish`, { method: "POST" });
    },

    async unpublish(id: string): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/pages/${id}/unpublish`, { method: "POST" });
    },

    async duplicate(id: string): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/pages/${id}/duplicate`, { method: "POST" });
    },

    async getPublic(slug: string): Promise<LandingPageDocument> {
      return request<LandingPageDocument>(`/api/public/pages/${slug}`, { method: "GET" });
    },

    async generateSeo(id: string, input?: SeoGenerateInput): Promise<SeoSuggestions> {
      return request<SeoSuggestions>(`/api/pages/${id}/seo/generate`, {
        method: "POST",
        body: JSON.stringify(input || {}),
      });
    },
  },

  seo: {
    async generate(input: SeoGenerateInput): Promise<SeoSuggestions> {
      return request<SeoSuggestions>("/api/seo/generate", {
        method: "POST",
        body: JSON.stringify(input || {}),
      });
    },
  },
};

