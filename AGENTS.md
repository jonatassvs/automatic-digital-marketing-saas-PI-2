# AGENTS.md

## Project Overview

This project is a **landing page builder focused on small businesses and
non-technical users**.

The platform allows users to create, edit, preview, publish, optimize,
and monitor landing pages without needing to write HTML, CSS, or
JavaScript.

The main architecture is:

-   **Frontend:** Next.js + TypeScript
-   **Backend:** Next.js Route Handlers + TypeScript (Node.js runtime)
-   **Database:** MongoDB
-   **Backend architecture:** MVC, complemented by Services,
    Repositories, Validators, and Middleware
-   **Page format:** declarative JSON component trees
-   **SEO:** built-in SEO configuration and optional AI-assisted
    generation
-   **Analytics:** page views, unique visitors, button clicks, form
    submissions, and conversions
-   **Integrations:** Google Tag Manager and future marketing/analytics
    integrations

The product should always prioritize:

1.  simplicity for non-technical users;
2.  SEO;
3.  security;
4.  accessibility;
5.  performance;
6.  extensibility;
7.  maintainable code.

------------------------------------------------------------------------

# Core Architecture

The fundamental page flow is:

``` text
Editor
  ↓
Page JSON
  ↓
Next.js API
  ↓
Validation
  ↓
MongoDB
  ↓
Next.js API
  ↓
Next.js
  ↓
Recursive Renderer
  ↓
Component Registry
  ↓
React Components
  ↓
Published Landing Page
```

Pages are **not stored as arbitrary HTML or JavaScript**.

They are represented as declarative JSON structures containing known
components, properties, and children.

Example:

``` json
{
  "id": "hero-container",
  "component": "Container",
  "props": {
    "display": "flex"
  },
  "children": [
    {
      "id": "hero-title",
      "component": "Heading",
      "props": {
        "level": 1,
        "text": "My Business"
      },
      "children": []
    }
  ]
}
```

------------------------------------------------------------------------

# Frontend

The frontend uses **Next.js and TypeScript**.

Suggested structure:

``` text
./
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── analytics/
│   │   └── integrations/
│   ├── editor/
│   │   └── [pageId]/
│   ├── preview/
│   │   └── [pageId]/
│   └── p/
│       └── [slug]/
├── components/
│   ├── base/
│   ├── editor/
│   ├── seo/
│   ├── analytics/
│   └── ui/
├── renderer/
│   ├── ComponentRenderer.tsx
│   ├── componentRegistry.ts
│   └── schemas/
├── services/
├── types/
└── utils/
```

Keep responsibilities separated.

Do not place API access, renderer logic, editor state, and visual
component code in the same module unless there is a strong reason.

------------------------------------------------------------------------

# Component System

Pages are constructed from a controlled set of base components.

Initial examples:

-   Container
-   Section
-   Heading
-   Paragraph
-   Image
-   Button
-   Link
-   Flex
-   Grid
-   Form
-   Input
-   Video
-   Spacer

Components that support nesting receive `children`.

Each component must have a schema defining its accepted properties.

Example concept:

``` ts
type PageComponent = {
  id: string;
  component: string;
  props: Record<string, unknown>;
  children?: PageComponent[];
};
```

Prefer stricter discriminated types as the component system matures.

------------------------------------------------------------------------

# Component Registry

Never dynamically import a component based directly on arbitrary user
input.

Use a controlled registry:

``` ts
const componentRegistry = {
  Heading,
  Paragraph,
  Image,
  Button,
  Container,
};
```

The renderer must resolve component names through this registry.

Unknown component types must fail safely.

Never use:

``` ts
require(userInput)
```

or equivalent dynamic code/module execution.

------------------------------------------------------------------------

# Recursive Renderer

The recursive renderer is one of the core pieces of the project.

Its responsibility is:

``` text
Receive component JSON
        ↓
Find component in registry
        ↓
Validate/normalize props
        ↓
Render component
        ↓
Render children recursively
```

The same rendering system should be reused whenever practical for:

-   editor preview;
-   private preview;
-   published pages.

Avoid creating separate rendering implementations that can diverge.

------------------------------------------------------------------------

# Component Schemas

Each component must define the fields users are allowed to configure.

Schemas should describe information such as:

-   field name;
-   field type;
-   required/optional;
-   default value;
-   accepted values;
-   minimum/maximum values;
-   whether children are accepted;
-   accepted child types when applicable.

The editor should use these schemas to generate property controls.

The backend must independently validate incoming component data.

Frontend validation is for UX.

Backend validation is for security and data integrity.

------------------------------------------------------------------------

# Custom Components

Users may create reusable custom components by combining existing
components.

For example:

``` text
Custom Hero
└── Container
    ├── Heading
    ├── Paragraph
    └── Button
```

Custom components are declarative structures.

They must **not contain arbitrary executable JavaScript or React code**.

Users may eventually make custom components public for reuse by other
users.

Public components must pass the same validation rules as normal page
components.

------------------------------------------------------------------------

# Backend

The backend uses **Next.js Route Handlers and MongoDB**.

Use MVC as the base architecture, complemented with service and
repository layers.

Suggested structure:

``` text
app/api/**/route.ts       # HTTP entry points
server/
  controllers/
  services/
  repositories/
  validators/
  models/
  auth/
  middleware/
  application.ts         # dependency composition
tests/server.test.ts
```

Expected request flow:

``` text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MongoDB
```

------------------------------------------------------------------------

# Backend Responsibilities

## Routes

Routes define HTTP endpoints and connect requests to controllers.

Keep business logic out of route definitions.

## Controllers

Controllers coordinate HTTP requests and responses.

Controllers should remain relatively thin.

They should:

-   obtain validated request information;
-   identify the authenticated user;
-   call the appropriate service;
-   return the appropriate HTTP response.

## Services

Services contain business rules.

Examples:

-   create a page;
-   update a page;
-   publish a page;
-   duplicate a page;
-   generate SEO suggestions;
-   calculate analytics;
-   validate ownership rules.

## Repositories

Repositories contain MongoDB access.

Controllers should not perform MongoDB queries directly.

## Models

Models represent application entities such as:

-   User
-   Page
-   Component
-   AnalyticsEvent
-   Integration

## Validators

Validators verify incoming data before it reaches persistence.

Validation is particularly important for component trees.

------------------------------------------------------------------------

# Authentication and Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> Is this user allowed to perform this action?

Never confuse the two.

Every private resource operation must verify ownership or permission on
the backend.

Example rule:

``` text
page.owner_id == authenticated_user.id
```

Never rely on the frontend hiding an Edit/Delete button.

Never trust a client-provided field such as:

``` json
{
  "isOwner": true
}
```

or:

``` json
{
  "userId": "123"
}
```

to establish authorization.

The authenticated identity must come from the trusted server-side
authentication mechanism.

------------------------------------------------------------------------

# Page States

Pages should support states such as:

``` text
draft
private
published
```

Only authorized users may:

-   edit;
-   delete;
-   preview private content;
-   publish;
-   unpublish;
-   modify SEO;
-   inspect private analytics.

Published pages may be publicly accessible by slug.

------------------------------------------------------------------------

# SEO

SEO is a **core product feature**, not an afterthought.

Each page should support fields such as:

-   SEO title;
-   meta description;
-   slug;
-   canonical URL;
-   Open Graph title;
-   Open Graph description;
-   Open Graph image;
-   robots index/follow;
-   structured data where appropriate.

The interface must be understandable by non-technical users.

Prefer labels such as:

> Description that may appear on Google

instead of exposing raw HTML terminology whenever possible.

------------------------------------------------------------------------

# SEO Rendering

Published pages must expose SEO information in server-rendered metadata
whenever possible.

SEO configuration must not depend solely on client-side JavaScript after
page load.

Pay attention to:

-   semantic HTML;
-   heading hierarchy;
-   one clear primary H1 when appropriate;
-   image alt text;
-   canonical URLs;
-   metadata;
-   Open Graph;
-   sitemap generation;
-   robots configuration;
-   page performance;
-   accessibility.

Do not sacrifice semantic HTML for editor convenience.

------------------------------------------------------------------------

# AI-Assisted SEO

The project may integrate an AI service to generate SEO suggestions.

Possible inputs:

-   business name;
-   business category;
-   city/location;
-   offered services;
-   target audience;
-   page objective;
-   current page content.

Possible outputs:

-   SEO title;
-   meta description;
-   Open Graph suggestions;
-   keyword/topic suggestions;
-   content improvement suggestions.

AI output must be treated as a **suggestion**, not automatically trusted
content.

The user should be able to review and edit generated content before
applying it.

AI API keys must never be exposed to the browser.

Calls to AI providers must go through the backend.

Apply rate limits and usage limits to AI endpoints.

------------------------------------------------------------------------

# SEO Assistant

The system may automatically identify common SEO issues.

Examples:

-   missing H1;
-   multiple inappropriate H1 elements;
-   missing meta description;
-   title too short or too long;
-   missing image alt text;
-   poor heading hierarchy;
-   missing canonical URL;
-   insufficient descriptive content.

Recommendations should be explained in simple language suitable for
small-business users.

------------------------------------------------------------------------

# Analytics

The platform should provide simple first-party analytics.

Initial events:

``` text
page_view
button_click
form_submit
```

Potential future events:

``` text
link_click
phone_click
whatsapp_click
email_click
video_play
custom_conversion
```

Analytics should help users answer practical questions such as:

-   How many people visited my page?
-   How many different visitors did I have?
-   How many clicked the main CTA?
-   How many submitted the form?
-   What is the conversion rate?

Avoid overwhelming users with unnecessary technical metrics.

------------------------------------------------------------------------

# Analytics Events

Components that can generate meaningful interactions should have stable
component IDs.

Example event:

``` json
{
  "type": "button_click",
  "pageId": "page-id",
  "componentId": "contact-button",
  "timestamp": "..."
}
```

Users may assign friendly conversion/event names such as:

``` text
Request Quote
Contact WhatsApp
Submit Contact Form
```

Do not trust analytics events as authoritative security or billing data
because public clients can forge requests.

------------------------------------------------------------------------

# Unique Visitors

If unique visitor estimation is implemented, minimize personal data
collection.

Prefer anonymous identifiers when possible.

Do not collect sensitive information merely for analytics.

Privacy and consent requirements must be considered when cookies or
third-party tracking technologies are introduced.

------------------------------------------------------------------------

# Google Tag Manager

The platform may integrate with Google Tag Manager.

Users should provide only a container ID such as:

``` text
GTM-XXXXXXX
```

The application is responsible for loading the integration.

Do not allow users to paste arbitrary GTM snippets or JavaScript.

Validate integration identifiers on the backend.

Internal events may also be exposed to GTM through a controlled
`dataLayer`.

Example concept:

``` ts
window.dataLayer?.push({
  event: "button_click",
  componentId: "contact-button",
});
```

Keep the internal analytics system independent from GTM so that pages
continue to work without third-party integrations.

------------------------------------------------------------------------

# Security Rules

Security is a core architectural requirement.

Assume **all browser input is untrusted**.

## Never allow arbitrary code execution

Do not allow user-controlled:

-   `<script>` tags;
-   `eval`;
-   arbitrary JavaScript;
-   React code;
-   event attributes such as `onclick`;
-   arbitrary HTML without strict sanitization;
-   arbitrary module imports.

Avoid `dangerouslySetInnerHTML`.

If HTML support becomes necessary, use a well-maintained sanitizer with
a strict allowlist.

## XSS

Validate and safely render user content.

Pay special attention to:

-   rich text;
-   URLs;
-   image URLs;
-   links;
-   custom components;
-   integration fields.

Block dangerous URL schemes such as:

``` text
javascript:
file:
```

Treat `data:` as blocked by default unless a specific safe use case is
designed.

Use a restrictive Content Security Policy.

## Cookies and Sessions

When cookie-based authentication is used, production cookies should use
appropriate settings such as:

``` text
HttpOnly
Secure
SameSite=Lax or Strict
```

Use appropriate session expiration and invalidation.

## CSRF

State-changing endpoints using cookie authentication must be protected
against CSRF.

## IDOR / Broken Access Control

Never return or modify a resource merely because its ID exists.

Always check authorization.

A user changing:

``` text
/pages/123
```

to:

``` text
/pages/124
```

must not gain access to another user's private resource.

## NoSQL Injection

MongoDB queries must never accept arbitrary query objects supplied by
clients.

A field expected to be a string must reject structures such as:

``` json
{
  "$ne": null
}
```

Use strict type validation and explicit query construction.

## Mass Assignment

Never blindly copy request bodies into database documents.

Use explicit allowlists of fields that may be created or updated.

## Rate Limiting

Apply rate limits according to endpoint sensitivity.

Examples:

-   login: strict;
-   registration: strict;
-   password-related operations: strict;
-   AI generation: strict/usage based;
-   analytics ingestion: high-volume but protected;
-   authenticated editor API: moderate;
-   public page rendering: optimized separately.

Do not create a generic frontend mechanism that bypasses backend rate
limits.

## Request Limits

Set limits for:

-   request body size;
-   component tree depth;
-   components per page;
-   string length;
-   array length;
-   analytics payload size;
-   AI prompt/context size.

This prevents accidental and malicious resource exhaustion.

## CORS

Use an explicit allowlist for trusted origins.

Do not use permissive authenticated CORS configurations.

## Secrets

Never commit:

-   database credentials;
-   session secrets;
-   API keys;
-   AI provider keys;
-   third-party credentials.

Use environment variables or a secrets manager.

`.env` files containing secrets must not be committed.

## Errors

Production API responses must not expose:

-   stack traces;
-   database connection details;
-   internal filesystem paths;
-   secrets.

Keep technical details in protected server logs.

------------------------------------------------------------------------

# Google Tag Manager and Third-Party Integrations

Integrations must be represented as structured configuration.

Good:

``` json
{
  "provider": "gtm",
  "containerId": "GTM-XXXXXXX"
}
```

Bad:

``` json
{
  "script": "<script>...</script>"
}
```

Prefer known integrations with validated IDs over arbitrary custom
scripts.

------------------------------------------------------------------------

# Data Modeling

A page document may conceptually resemble:

``` json
{
  "id": "...",
  "ownerId": "...",
  "name": "Landing Page",
  "slug": "my-business",
  "status": "draft",
  "seo": {
    "title": "",
    "description": "",
    "canonicalUrl": "",
    "ogImage": ""
  },
  "components": [],
  "integrations": {
    "gtm": null
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

Do not embed an unlimited analytics history inside the page document.

Analytics data should use separate collections/storage suitable for
event volume and aggregation.

------------------------------------------------------------------------

# API Design

Possible initial API groups:

``` text
/api/auth
/api/users
/api/pages
/api/components
/api/analytics
/api/events
/api/seo
/api/integrations
```

Keep naming and HTTP semantics consistent.

Examples:

``` text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

POST   /api/pages
GET    /api/pages/:id
PUT    /api/pages/:id
DELETE /api/pages/:id

POST   /api/events
GET    /api/analytics/pages/:id

POST   /api/seo/generate
```

Do not expose internal MongoDB implementation details through the API
unnecessarily.

------------------------------------------------------------------------

# Coding Guidelines

## General

-   Prefer simple, explicit code over clever abstractions.
-   Keep functions focused.
-   Avoid large files with unrelated responsibilities.
-   Avoid duplicated business rules.
-   Add abstractions when they solve an existing problem, not
    hypothetical future problems.
-   Use descriptive names.
-   Preserve existing project conventions when modifying established
    code.

## TypeScript

-   Avoid `any` unless unavoidable and documented.
-   Prefer explicit domain types.
-   Validate data received from APIs at trust boundaries.
-   Do not assume TypeScript types make runtime data safe.

## Server-side TypeScript

-   Use strict TypeScript types and runtime validation.
-   Keep controllers thin.
-   Keep MongoDB access inside repositories.
-   Keep business rules in services.
-   Keep validation explicit.

## Comments

Comments should explain **why**, not restate obvious code.

Avoid unnecessary comments such as:

``` ts
// Set title
title = value;
```

Prefer comments for architectural decisions, security constraints, and
non-obvious behavior.

------------------------------------------------------------------------

# Testing

Important behavior should be covered by automated tests.

Priority tests include:

## Renderer

-   known components render;
-   nested components render recursively;
-   unknown components fail safely;
-   invalid props are rejected or normalized;
-   depth limits work.

## Authorization

Test with at least two users.

User B must not be able to:

-   read User A's private page;
-   edit User A's page;
-   delete User A's page;
-   preview User A's private page;
-   inspect User A's private analytics.

## Security

Test rejection of:

-   script injection;
-   event-handler injection;
-   `javascript:` URLs;
-   unknown component types;
-   unknown properties;
-   MongoDB operators in user fields;
-   oversized JSON;
-   excessive tree depth;
-   invalid integration IDs;
-   unauthorized administrative fields.

## SEO

Test:

-   metadata generation;
-   canonical URL;
-   Open Graph;
-   robots settings;
-   slug behavior;
-   semantic output.

## Analytics

Test:

-   page views;
-   clicks;
-   form submissions;
-   invalid event types;
-   oversized event payloads;
-   aggregation calculations.

------------------------------------------------------------------------

# Development Order

When implementing the project from scratch, prefer this order:

``` text
1. Define page/component JSON format
2. Create base components
3. Create component schemas
4. Create Component Registry
5. Build recursive renderer
6. Test renderer using local JSON
7. Add basic SEO metadata model
8. Create Next.js server layers and MongoDB repositories
9. Create page model and API
10. Create recursive backend validator
11. Integrate the editor with Next.js Route Handlers
12. Implement authentication
13. Implement authorization/ownership
14. Build dashboard
15. Build basic editor
16. Generate editor controls from schemas
17. Implement save/update flow
18. Implement private preview
19. Implement publishing and public slugs
20. Build SEO editor
21. Build SEO checks/assistant
22. Implement basic analytics
23. Implement event tracking
24. Build analytics dashboard
25. Add GTM integration
26. Add reusable custom components
27. Add public component sharing
28. Add AI-assisted SEO
29. Perform security review
30. Add integration/security tests
31. Prepare production deployment
```

Do not implement advanced editor features before the renderer and JSON
contract are stable.

------------------------------------------------------------------------

# Priorities for AI Coding Agents

When an AI agent works on this repository, it should follow these
priorities:

1.  **Do not weaken security to simplify implementation.**
2.  **Preserve the JSON-driven architecture.**
3.  **Do not introduce arbitrary user JavaScript execution.**
4.  **Keep SEO server-renderable.**
5.  **Keep the editor usable by non-technical users.**
6.  **Keep frontend and backend validation separate.**
7.  **Perform authorization on the backend.**
8.  **Prefer reusable base components over one-off page-specific code.**
9.  **Keep analytics and third-party integrations decoupled.**
10. **Avoid unnecessary architectural complexity.**

------------------------------------------------------------------------

# Rules Before Modifying Code

Before implementing a change:

1.  Inspect the relevant existing files.
2.  Understand the current data flow.
3.  Identify whether the change affects the page JSON contract.
4.  Identify whether it affects SEO output.
5.  Identify whether it introduces new user-controlled input.
6.  Identify authorization requirements.
7.  Identify whether backend validation must change.
8.  Identify whether tests need to be added or updated.

Do not silently change the page JSON contract.

If a breaking schema change is required, document it and consider
migration/versioning.

------------------------------------------------------------------------

# Definition of Done

A feature should not be considered complete merely because the UI works.

Before considering a feature complete, verify as applicable:

-   frontend behavior works;
-   backend validation exists;
-   authorization exists;
-   invalid input is rejected;
-   errors are handled safely;
-   SEO impact was considered;
-   accessibility was considered;
-   analytics impact was considered;
-   security implications were considered;
-   tests cover critical behavior;
-   no secrets were introduced into source code;
-   no arbitrary executable user content was introduced.

------------------------------------------------------------------------

# Product Principle

The central product idea is:

``` text
Create
  ↓
Customize
  ↓
Optimize for SEO
  ↓
Publish
  ↓
Measure
  ↓
Improve
```

The platform should hide technical complexity from small-business users
without hiding security, validation, and correctness from the
implementation.

When choosing between exposing a technical configuration and automating
it safely, prefer **safe automation with a simple interface**.

## Next.js Backend Boundaries

Run npm commands from the repository root. Do not recreate separate frontend or Flask projects.
Use the Node.js runtime for MongoDB and crypto. Keep route files thin and mark server services and persistence with server-only. Reuse the MongoDB pool; do not connect during static builds.
Preserve Bearer authentication and existing collection/document formats. Private operations must filter by authenticated ownership. Do not trust forwarded IP headers without an explicitly configured trusted proxy.
Backend validation remains independent from renderer validation. When schemas change, review and export the contract snapshot with npm run contract:export and verify with npm run contract:check.
Run npm test, npm run typecheck, npm run lint and npm run build for backend migrations.
