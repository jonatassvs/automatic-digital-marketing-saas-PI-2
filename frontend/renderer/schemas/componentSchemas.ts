import type { ComponentName } from "@/types/page";
import { buttonSchema } from "@/components/base/ButtonBlock/schema";
import { containerSchema } from "@/components/base/ContainerBlock/schema";
import { flexSchema } from "@/components/base/FlexBlock/schema";
import { gridSchema } from "@/components/base/GridBlock/schema";
import { imageSchema } from "@/components/base/ImageBlock/schema";
import { linkSchema } from "@/components/base/LinkBlock/schema";
import { sectionSchema } from "@/components/base/SectionBlock/schema";
import { spacerSchema } from "@/components/base/SpacerBlock/schema";
import { textSchema } from "@/components/base/TextBlock/schema";
import type { ComponentSchema, SchemaField } from "@/renderer/schemas/schemaTypes";

export type { ComponentSchema, SchemaField };

export const componentSchemas: Record<ComponentName, ComponentSchema> = {
  Button: buttonSchema,
  Container: containerSchema,
  Flex: flexSchema,
  Grid: gridSchema,
  Image: imageSchema,
  Link: linkSchema,
  Section: sectionSchema,
  Spacer: spacerSchema,
  Text: textSchema
};

export const creatableComponents = Object.values(componentSchemas);
