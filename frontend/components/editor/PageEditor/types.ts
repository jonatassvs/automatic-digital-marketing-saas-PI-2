import type { PageComponent } from "@/types/page";

export type AddMode = "root" | "child";

export type FlatPageComponent = PageComponent & {
  depth: number;
};
