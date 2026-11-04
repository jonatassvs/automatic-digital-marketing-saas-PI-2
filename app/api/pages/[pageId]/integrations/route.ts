import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = route((app, context) => app.controllers.integrations.get(context));
export const PUT = route((app, context) => app.controllers.integrations.update(context));
export const OPTIONS = route(async () => new Response(null), false);
