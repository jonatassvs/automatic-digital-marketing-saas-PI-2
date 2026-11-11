import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const PUT = route((app, context) => app.controllers.pages.updateSeo(context));
export const OPTIONS = route(async () => new Response(null), false);
