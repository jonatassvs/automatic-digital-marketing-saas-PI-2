import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = route((app, context) => app.controllers.pages.get(context));
export const PUT = route((app, context) => app.controllers.pages.update(context));
export const DELETE = route((app, context) => app.controllers.pages.delete(context));
export const OPTIONS = route(async () => new Response(null), false);
