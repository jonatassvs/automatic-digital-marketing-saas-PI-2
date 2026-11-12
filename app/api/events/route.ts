import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = route((app, context) => app.controllers.analytics.ingest(context), true);
export const OPTIONS = route(async () => new Response(null), true);
