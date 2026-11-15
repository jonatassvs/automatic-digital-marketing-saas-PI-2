import type { ComponentType, PropsWithChildren } from "react";
import type { PageComponent } from "@/types/page";
import { ButtonBlock } from "@/components/base/ButtonBlock";
import { ContainerBlock } from "@/components/base/ContainerBlock";
import { FlexBlock } from "@/components/base/FlexBlock";
import { GridBlock } from "@/components/base/GridBlock";
import { ImageBlock } from "@/components/base/ImageBlock";
import { LinkBlock } from "@/components/base/LinkBlock";
import { SectionBlock } from "@/components/base/SectionBlock";
import { SpacerBlock } from "@/components/base/SpacerBlock";
import { TextBlock } from "@/components/base/TextBlock";
import { NavbarBlock } from "@/components/base/NavbarBlock";

export type BaseComponentProps = PropsWithChildren<Record<string, unknown>>;
type BaseComponent = ComponentType<BaseComponentProps>;

export const componentRegistry: Record<PageComponent["component"], BaseComponent> = {
  // The renderer normalizes props from schemas before crossing this controlled registry boundary.
  Button: ButtonBlock as BaseComponent,
  Container: ContainerBlock as BaseComponent,
  Flex: FlexBlock as BaseComponent,
  Grid: GridBlock as BaseComponent,
  Image: ImageBlock as BaseComponent,
  Link: LinkBlock as BaseComponent,
  Navbar: NavbarBlock as BaseComponent,
  Section: SectionBlock as BaseComponent,
  Spacer: SpacerBlock as BaseComponent,
  Text: TextBlock as BaseComponent
};
