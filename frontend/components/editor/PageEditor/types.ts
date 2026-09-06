import type { PageComponent } from "@/types/page";

export type AddTarget =
  | {
      insertIndex?: number;
      kind: "root";
    }
  | {
      childIndex?: number;
      kind: "child";
      parentId: string;
    };

export type FlatPageComponent = PageComponent & {
  depth: number;
};
