# Component appearance

Image and Button accept optional appearance fields through their schemas. Existing JSON remains valid; no migration is required. Width and height use a numeric value and a separate unit. Zero selects automatic sizing. Width is capped at the parent width. Image defaults to 100% width and a 4:3 ratio; select auto ratio for intrinsic proportions. Explicit height takes precedence over ratio.

Image supports object-fit, horizontal/vertical crop position, background, loading strategy, borders, opacity, shadows and margins. Keep meaningful alternative text for content images.

Button preserves primary/secondary colors unless customColors is enabled. Custom background, text and border hover colors also apply to keyboard focus. Motion respects prefers-reduced-motion. It remains a navigation link; newTab uses noopener noreferrer.

Text fontSizeMobile/fontSizeDesktop and button fontSize remain numeric pixels in JSON and editor controls. Rendering divides by 16 and emits rem, respecting the browser root font size.

Schema numbers have bounds checked by validation and normalization. Invalid values fall back to defaults for rendering. Colors accept six-digit hex. The repository has no backend yet: equivalent independent validation is required when persistence is introduced.

Run npm test, npm run typecheck and npm run lint in frontend.

## Shared responsive styles

All nine component schemas inherit the allowlist in `renderer/schemas/responsiveStyles.ts`. `components/base/responsiveStyle.ts` applies it to each component's semantic root, without introducing layout wrappers. `components/base/responsive.scss` resolves the CSS variables with a shared 720px breakpoint; layout.tsx loads it for both editor and page rendering. Keep the variable list in sync when adding a new basic field.

Optional JSON fields use mobile/desktop prefixes, for example `mobilePaddingTop: 16`, `desktopPaddingTop: 48`, `mobileBackgroundColor: "#ffffff"`. These are additive: existing properties remain supported. Missing mobile values preserve component defaults; missing desktop values use mobile. Disable a field in the panel to remove its override. Zero is an explicit value, including zero width/height (unlike legacy Image/Button automatic dimensions).

The shared fields cover each padding/margin side, background and text colors, borders, radius, opacity, dimensions, maximum width and child gap. Margins may be negative; padding cannot. Gap applies to flex/grid layouts. Responsive button colors update its base colors while retaining the configured hover/focus treatment.

Button `linkTarget` selects `_self` or `_blank`; legacy `newTab` remains a fallback when linkTarget is absent. In the canvas its label is edited as plain text, saved on blur or Enter, and clicks cannot navigate. Empty edits restore the previous label to keep the link accessible. Published buttons remain normal links with no editing handlers.

## Per-page breakpoint and Google Fonts

The optional `design` object adds `mobileMaxWidth` (integer, 320 through 1600; default 720), `fonts` (up to six unique catalog family names), and `defaultFont` (`system` or an added family). Old documents need no migration. PageRenderer accepts design and emits scoped, server-rendered CSS for that breakpoint, font stylesheet links, and the page font stack. Mobile includes the boundary; desktop is its exact complement, including fractional widths. The editor application's own navigation layout keeps its independent breakpoints.

`renderer/pageDesign.ts` validates and normalizes this configuration and constructs allowlisted provider URLs. `PageDesignStyles.tsx` derives the responsive variable rules from the shared schema, so new common fields automatically use each page's breakpoint. Text sizes and grid columns follow the same boundary. Scope classes isolate pages with different breakpoints.

The initial searchable catalog contains 12 Google Fonts. The page panel adds/removes families and selects a default. Text, Button, and Link accept `fontFamily` (`inherit`, `system`, or a catalog family). Only fonts added to that page can be selected for rendering. The text toolbar and component panel show the configured family and whether it is inherited. Removing a family resets references recursively to inherit. This displays the configured font, not a claim that the provider download succeeded; system fonts remain the fallback if external loading fails.

Font requests use the official CSS2 API with normal/italic 400 and 700 and display=swap. Other numeric weights use browser font matching. Only added fonts load; no API key, arbitrary CSS, URLs, or script snippets are accepted. Source: https://developers.google.com/fonts/docs/css2 . The repository remains a local frontend without backend persistence; independent backend validation must be added with the API.

`npm test` covers config validation, safe defaults, font removal and SSR. `node tests/page-design-browser.cjs` additionally checks actual computed padding, text sizes and grid columns at four viewport widths using headless Microsoft Edge on Windows. Browser profiles and generated fixtures use a dedicated temporary directory.
