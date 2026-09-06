import type { ComponentType, MouseEventHandler, PropsWithChildren } from "react";
import type { ComponentProps, PageComponent } from "@/types/page";
import { ButtonBlock } from "@/components/base/ButtonBlock";
import { ContainerBlock } from "@/components/base/ContainerBlock";
import { FlexBlock } from "@/components/base/FlexBlock";
import { GridBlock } from "@/components/base/GridBlock";
import { HeadingBlock } from "@/components/base/HeadingBlock";
import { ImageBlock } from "@/components/base/ImageBlock";
import { LinkBlock } from "@/components/base/LinkBlock";
import { ParagraphBlock } from "@/components/base/ParagraphBlock";
import { SectionBlock } from "@/components/base/SectionBlock";
import { SpacerBlock } from "@/components/base/SpacerBlock";

export type RendererComponentProps = PropsWithChildren<{
  componentLabel?: string;
  editorPreviewDepth?: number;
  id: string;
  isEditorPreview?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onSelectClick?: MouseEventHandler<HTMLElement>;
  props: ComponentProps;
}>;

export const componentRegistry: Record<
  PageComponent["component"],
  ComponentType<RendererComponentProps>
> = {
  Button: ButtonBlock,
  Container: ContainerBlock,
  Flex: FlexBlock,
  Grid: GridBlock,
  Heading: HeadingBlock,
  Image: ImageBlock,
  Link: LinkBlock,
  Paragraph: ParagraphBlock,
  Section: SectionBlock,
  Spacer: SpacerBlock
};
