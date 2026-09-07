import type { ComponentType, PropsWithChildren } from "react";
import type { PageComponent } from "@/types/page";
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

export type BaseComponentProps = PropsWithChildren<Record<string, unknown>>;
type BaseComponent = ComponentType<BaseComponentProps>;

export const componentRegistry: Record<PageComponent["component"], BaseComponent> = {
  // The renderer normalizes props from schemas before crossing this controlled registry boundary.
  Button: ButtonBlock as BaseComponent,
  Container: ContainerBlock as BaseComponent,
  Flex: FlexBlock as BaseComponent,
  Grid: GridBlock as BaseComponent,
  Heading: HeadingBlock as BaseComponent,
  Image: ImageBlock as BaseComponent,
  Link: LinkBlock as BaseComponent,
  Paragraph: ParagraphBlock as BaseComponent,
  Section: SectionBlock as BaseComponent,
  Spacer: SpacerBlock as BaseComponent
};
