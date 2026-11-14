export type ComponentName =
  | "Section"
  | "Container"
  | "Flex"
  | "Grid"
  | "Text"
  | "Image"
  | "Button"
  | "Link"
  | "Spacer";

export type ComponentProps = Record<string, unknown>;

export type PageComponent = {
  id: string;
  component: ComponentName;
  props: ComponentProps;
  children?: PageComponent[];
};

export type SeoConfig = {
  title: string;
  description: string;
  slug: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

export type SeoSuggestions = {
  title: string;
  description: string;
  slug: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  suggestions: string[];
};

export type SeoGenerateInput = {
  businessName?: string;
  category?: string;
  location?: string;
  targetAudience?: string;
  pageContent?: string;
  extraNotes?: string;
};

export type PageDesign = {
  mobileMaxWidth?: number;
  fonts?: string[];
  defaultFont?: string;
};

export type LandingPageDocument = {
  design?: PageDesign;
  id: string;
  name: string;
  status: "draft" | "private" | "published";
  seo: SeoConfig;
  components: PageComponent[];
};
