import { route } from "@/server/middleware/route";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = route((app, context) => app.controllers.auth.me(context));
export const OPTIONS = route(async () => new Response(null), false);
