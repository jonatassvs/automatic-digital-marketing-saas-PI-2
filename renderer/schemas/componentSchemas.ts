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
import { navbarSchema } from "@/components/base/NavbarBlock/schema";
import { formSchema } from "@/components/base/FormBlock/schema";
import type { ComponentSchema, SchemaField } from "@/renderer/schemas/schemaTypes";

import { GOOGLE_FONTS } from "@/renderer/pageDesign";
import { responsiveStyleFields } from "./responsiveStyles";

export type { ComponentSchema, SchemaField };

const baseSchemas: Record<ComponentName, ComponentSchema> = {
  Button: buttonSchema,
  Container: containerSchema,
  Flex: flexSchema,
  Form: formSchema,
  Grid: gridSchema,
  Image: imageSchema,
  Link: linkSchema,
  Navbar: navbarSchema,
  Section: sectionSchema,
  Spacer: spacerSchema,
  Text: textSchema
};

export const componentSchemas = Object.fromEntries(
  Object.entries(baseSchemas).map(([name, schema]) => [name, { ...schema, fields: [...schema.fields, ...responsiveStyleFields,
    ...(["Text", "Button", "Link", "Navbar", "Form"].includes(name) ? [{ name: "fontFamily", label: "Fonte", type: "select", group: "style", defaultValue: "inherit", options: [
      { label: "Fonte da página", value: "inherit" }, { label: "Fonte do sistema", value: "system" }, ...GOOGLE_FONTS.map(font => ({ label: font, value: font }))
    ] }] : [])] }])
) as Record<ComponentName, ComponentSchema>;

export const creatableComponents = Object.values(componentSchemas);
