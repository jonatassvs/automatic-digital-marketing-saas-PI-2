import type { ComponentName } from "@/types/page";
import { buttonSchema } from "@/components/base/ButtonBlock/schema";
import { containerSchema } from "@/components/base/ContainerBlock/schema";
import { flexSchema } from "@/components/base/FlexBlock/schema";
import { gridSchema } from "@/components/base/GridBlock/schema";
import { headingSchema } from "@/components/base/HeadingBlock/schema";
import { imageSchema } from "@/components/base/ImageBlock/schema";
import { linkSchema } from "@/components/base/LinkBlock/schema";
import { paragraphSchema } from "@/components/base/ParagraphBlock/schema";
import { sectionSchema } from "@/components/base/SectionBlock/schema";
import { spacerSchema } from "@/components/base/SpacerBlock/schema";
import type { ComponentSchema, SchemaField } from "@/renderer/schemas/schemaTypes";

export type { ComponentSchema, SchemaField };

export const componentSchemas: Record<ComponentName, ComponentSchema> = {
  Button: buttonSchema,
  Container: containerSchema,
  Flex: flexSchema,
  Grid: gridSchema,
  Heading: headingSchema,
  Image: imageSchema,
  Link: linkSchema,
  Paragraph: paragraphSchema,
  Section: sectionSchema,
  Spacer: spacerSchema
};

export const creatableComponents = Object.values(componentSchemas);
