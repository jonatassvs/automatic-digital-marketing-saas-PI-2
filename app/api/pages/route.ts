import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = route((app, context) => app.controllers.pages.list(context));
export const POST = route((app, context) => app.controllers.pages.create(context));
export const OPTIONS = route(async () => new Response(null), false);
