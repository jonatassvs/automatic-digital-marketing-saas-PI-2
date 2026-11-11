import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createRequire } from "node:module";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import { createApplication, type Application } from "../server/application";
import { createIndexes } from "../server/repositories/database";
import { route } from "../server/middleware/route";
import { settings } from "../server/config";
import { PageValidator } from "../server/validators/page.validator";
import { verifyPassword } from "../server/auth/password";
import sample from "./fixtures/sample_page.json";
import type { LandingPageDocument } from "../types/page";
import type { ControllerContext } from "../server/controllers/http";

let mongo: MongoMemoryServer, client: MongoClient, db: Db, app: Application;
const require = createRequire(import.meta.url);
before(async () => {
  mongo = await MongoMemoryServer.create(); client = await new MongoClient(mongo.getUri()).connect();
  db = client.db("migration_tests"); await createIndexes(db);
  process.env.MONGODB_URI = mongo.getUri();
  process.env.MONGODB_DATABASE = "migration_tests";
  (globalThis as typeof globalThis & { landingDatabase: Promise<Db> }).landingDatabase = Promise.resolve(db);
  app = createApplication(db, settings({ MONGODB_URI: mongo.getUri() }));
});
after(async () => { await client?.close(); await mongo?.stop(); });

async function call(method: string, path: string, payload?: unknown, token?: string, extra: Record<string, string> = {}) {
  const pathname = path.split("?")[0];
  const params: Record<string, string> = {};
  let file = pathname.slice(5);
  if (/^pages\/[^/]+/.test(file)) { params.pageId = file.split("/")[1]; file = file.replace(/^pages\/[^/]+/, "pages/[pageId]"); }
  if (/^public\/pages\//.test(file)) { params.slug = file.split("/")[2]; file = file.replace(/^public\/pages\/[^/]+/, "public/pages/[slug]"); }
  if (/^analytics\/pages\//.test(file)) { params.pageId = file.split("/")[2]; file = "analytics/pages/[pageId]"; }
  const routeModule = require(`../app/api/${file}/route.ts`);
  // Actual exported handlers share only the isolated test database with the services.
    const response: Response = await routeModule[method](new Request(`http://localhost:3000${path}`, {
      method, headers: { ...(payload !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra },
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
    }), { params: Promise.resolve(params) });
    const body = await response.text();
    return { status: response.status, headers: response.headers, body: body ? JSON.parse(body) : null };
}
async function account(name: string) {
  const credentials = { email: `${name}@example.com`, password: "a sufficiently long password" };
  assert.equal((await call("POST", "/api/auth/register", { ...credentials, name })).status, 201);
  const login = await call("POST", "/api/auth/login", credentials);
  assert.equal(login.status, 200); return login.body.data.accessToken as string;
}

test("API lifecycle, ownership, sessions, integrations, analytics and safe failures", async () => {
  const alice = await account("alice"), bob = await account("bob");
  assert.equal((await call("GET", "/api/pages")).status, 401);
  const created = await call("POST", "/api/pages", sample, alice);
  assert.equal(created.status, 201);
  const page: LandingPageDocument = created.body.data;
  assert.notEqual(page.id, sample.id); assert.equal(Object.hasOwn(page, "owner_id"), false);
  const path = `/api/pages/${page.id}`, publicPath = `/api/public/pages/${page.seo.slug}`;
  assert.equal((await call("GET", publicPath)).status, 404);
  assert.deepEqual((await call("GET", "/api/pages", undefined, bob)).body.data, []);
  const privateRequests: [string, string, unknown?][] = [
    ["GET", path], ["PUT", path, page], ["DELETE", path], ["GET", path + "/preview"],
    ["POST", path + "/publish"], ["POST", path + "/unpublish"], ["POST", path + "/duplicate"],
    ["PUT", path + "/seo", page.seo], ["GET", path + "/seo/check"],
    ["GET", path + "/integrations"], ["PUT", path + "/integrations", { gtm: null }],
    ["GET", `/api/analytics/pages/${page.id}`],
  ];
  for (const [method, url, body] of privateRequests) assert.equal((await call(method, url, body, bob)).status, 404, `${method} ${url}`);
  assert.deepEqual((await call("GET", path + "/preview", undefined, alice)).body.data, page);
  assert.equal((await call("POST", "/api/pages", sample, bob)).status, 409);
  for (const key of ["owner_id", "ownerId", "isOwner", "integrations", "createdAt"]) assert.equal((await call("PUT", path, { ...page, [key]: "forged" }, alice)).status, 422);
  assert.equal((await call("PUT", path, { ...page, id: "different" }, alice)).status, 422);
  page.name = "Updated";
  assert.equal((await call("PUT", path, page, alice)).body.data.name, "Updated");
  assert.equal((await call("POST", path + "/publish", undefined, alice)).status, 200);
  assert.equal((await call("GET", publicPath)).body.data.status, "published");
  const gtm = { gtm: { containerId: "GTM-AB12345" } };
  assert.deepEqual((await call("PUT", path + "/integrations", gtm, alice)).body.data, gtm);
  assert.deepEqual((await call("GET", publicPath + "/integrations")).body.data, gtm);
  assert.equal((await call("PUT", path + "/integrations", { gtm: { ...gtm.gtm, script: "evil" } }, alice)).status, 422);
  assert.equal((await call("PUT", path + "/seo", { ...page.seo, canonicalUrl: "https://example.com/page" }, alice)).status, 200);
  assert.ok(Array.isArray((await call("GET", path + "/seo/check", undefined, alice)).body.data.issues));
  const view = { type: "page_view", pageId: page.id, visitorId: "anonymous-visitor-123" };
  for (let i = 0; i < 2; i++) assert.equal((await call("POST", "/api/events", view)).status, 202);
  assert.equal((await call("POST", "/api/events", { type: "button_click", pageId: page.id, componentId: "hero-button" })).status, 202);
  assert.deepEqual((await call("GET", `/api/analytics/pages/${page.id}`, undefined, alice)).body.data, { days: 30, pageViews: 2, uniqueVisitors: 1, buttonClicks: 1, formSubmissions: 0, formSubmissionsPerView: 0 });
  for (const body of [{ ...view, type: "unknown" }, { ...view, timestamp: "forged" }, { ...view, visitorId: { $ne: null } }, { ...view, type: "button_click", componentId: "hero-title" }, { ...view, type: "form_submit", componentId: "hero-button" }]) assert.equal((await call("POST", "/api/events", body)).status, 422);
  assert.equal((await call("POST", "/api/events", { ...view, visitorId: "a".repeat(3000) })).status, 413);
  assert.equal((await call("POST", "/api/pages", { name: "a".repeat(513 * 1024) }, alice)).status, 413);
  for (const query of ["limit=0", "limit=101", "offset=-1", "limit=hello"]) assert.equal((await call("GET", "/api/pages?" + query, undefined, alice)).status, 422);
  const copy = await call("POST", path + "/duplicate", undefined, alice);
  assert.equal(copy.status, 201); assert.equal(copy.body.data.status, "draft"); assert.notEqual(copy.body.data.seo.slug, page.seo.slug);
  assert.equal((await call("POST", path + "/unpublish", undefined, alice)).body.data.status, "private");
  assert.equal((await call("GET", publicPath)).status, 404);
  assert.equal((await call("POST", "/api/events", view)).status, 404);
  assert.equal((await call("DELETE", path, undefined, alice)).status, 204);
  assert.equal((await call("GET", path, undefined, alice)).status, 404);
  assert.equal((await call("GET", "/api/auth/me", undefined, alice, { Origin: "https://evil.example" })).status, 403);
  assert.equal((await call("POST", "/api/auth/login", {}, undefined, { Origin: "https://evil.example" })).status, 403);
  const cors = await call("OPTIONS", "/api/pages", undefined, undefined, { Origin: "http://localhost:3000" });
  assert.equal(cors.status, 200); assert.equal(cors.headers.get("Access-Control-Allow-Origin"), "http://localhost:3000");
  assert.equal(cors.headers.get("Access-Control-Allow-Credentials"), null);
  const publicCors = await call("GET", publicPath, undefined, undefined, { Origin: "https://business.example" });
  assert.equal(publicCors.headers.get("Access-Control-Allow-Origin"), "https://business.example");
  assert.equal(publicCors.headers.get("Cache-Control"), "no-store");
  assert.equal((await call("POST", "/api/auth/logout", undefined, alice)).status, 204);
  assert.equal((await call("GET", "/api/auth/me", undefined, alice)).status, 401);
  await db.collection("sessions").updateMany({}, { $set: { expiresAt: new Date(0) } });
  assert.equal((await call("GET", "/api/auth/me", undefined, bob)).status, 401);
  assert.equal((await call("GET", "/api/health")).status, 200);
  assert.equal((await db.collection("users").indexes()).find(index => index.name === "email_1")?.unique, true);
  assert.equal((await db.collection("pages").indexes()).find(index => index.name === "seo.slug_1")?.unique, true);
  for (const name of ["events", "sessions", "rate_limits"]) assert.equal((await db.collection(name).indexes()).find(index => index.name === "expiresAt_1")?.expireAfterSeconds, 0);
  const event = await db.collection("events").findOne(); assert.ok(event); assert.equal(Object.hasOwn(event, "ip"), false);
});

test("strict component/page validation rejects injection, invalid schemas and resource exhaustion", () => {
  const validator = new PageValidator();
  assert.equal(validator.validate(sample).seo.slug, sample.seo.slug);
  for (const node of [
    { id: "a", component: "Unknown", props: {} }, { id: "a", component: "constructor", props: {} },
    { id: "a", component: "Text", props: { text: "<script>alert(1)</script>" } },
    { id: "a", component: "Button", props: { onclick: "evil" } },
    ...["javascript:alert(1)", "data:text/html,test", "file:///secret", "//evil.example", "java\nscript:evil"].map(href => ({ id: "a", component: "Link", props: { href } })),
    { id: "a", component: "Grid", props: { columns: 1.5 } },
    { id: "a", component: "Image", props: { src: "/photo.png", alt: "Photo", width: Infinity } },
  ]) assert.throws(() => validator.validate({ ...sample, components: [node] }));
  assert.throws(() => validator.validate({ ...sample, name: { $ne: null } }));
  assert.throws(() => validator.validate({ ...sample, components: Array.from({ length: 81 }, (_, i) => ({ id: `n${i}`, component: "Container", props: {} })) }));
  let nodes: unknown[] = [];
  for (let i = 0; i < 9; i++) nodes = [{ id: `n${i}`, component: "Container", props: {}, children: nodes }];
  assert.throws(() => validator.validate({ ...sample, components: nodes }));
  assert.throws(() => validator.validate({ ...sample, design: { fonts: ["evil"] } }));
  assert.throws(() => validator.validate({ ...sample, seo: { ...sample.seo, canonicalUrl: "https://user:pass@example.com" } }));
});

test("rate limits cannot be bypassed with arbitrary forwarded headers; internal failures stay safe", async () => {
  await db.collection("rate_limits").deleteMany({});
  for (let i = 0; i < 10; i++) assert.equal((await call("POST", "/api/auth/login", {})).status, 422);
  const limited = await call("POST", "/api/auth/login", {}, undefined, { "X-Forwarded-For": "1.2.3.4" });
  assert.equal(limited.status, 429); assert.equal(limited.headers.get("Retry-After"), "60");
  const handler = route(async () => { throw new Error("secret host and password"); }, true, async () => app);
  const response = await handler(new Request("http://localhost:3000/api/health"), { params: Promise.resolve({}) });
  assert.equal(response.status, 500); assert.doesNotMatch(await response.text(), /secret|password/);
});

test("authentication rejects invalid input and never persists raw passwords or tokens", async () => {
  await db.collection("rate_limits").deleteMany({});
  const credentials = { name: "Ana", email: "ana@example.com", password: "a sufficiently long password" };
  for (const payload of [{ ...credentials, email: { $ne: null } }, { ...credentials, isAdmin: true }, { ...credentials, password: "short" }, [], null]) {
    assert.equal((await call("POST", "/api/auth/register", payload)).status, 422);
  }
  assert.equal((await call("POST", "/api/auth/login", { email: "missing@example.com", password: credentials.password })).status, 401);
  const created = await call("POST", "/api/auth/register", credentials);
  assert.equal(created.status, 201); assert.equal(Object.hasOwn(created.body.data, "password_hash"), false);
  assert.equal((await call("POST", "/api/auth/register", credentials)).status, 409);
  const login = await call("POST", "/api/auth/login", { email: " ANA@EXAMPLE.COM ", password: credentials.password });
  assert.equal(login.status, 200); assert.equal(login.headers.get("Set-Cookie"), null);
  const stored = await db.collection("users").findOne({ email: credentials.email });
  assert.ok(stored); assert.notEqual(stored.password_hash, credentials.password);
  const { digest } = await import("../server/services/auth.service");
  const session = await db.collection<{ _id: string }>("sessions").findOne({ _id: digest(login.body.data.accessToken) });
  assert.ok(session); assert.notEqual(session._id, login.body.data.accessToken);
});

test("bounded streaming JSON and content type errors", async () => {
  const { readJson } = await import("../server/controllers/http");
  for (const [body, contentType, status] of [["{broken", "application/json", 400], ["{}", "text/plain", 415], [" ".repeat(3000), "application/json", 413]] as const) {
    const handler = route(async (_app: Application, context: ControllerContext) => { await readJson(context.request, 2048); return new Response(null); }, true, async () => app);
    const response = await handler(new Request("http://localhost:3000/api/test", { method: "POST", body, headers: { "Content-Type": contentType } }), { params: Promise.resolve({}) });
    assert.equal(response.status, status);
  }
});

test("Werkzeug scrypt format is accepted, invalid password rejected", async () => {
  const { scryptSync } = await import("node:crypto");
  const password = "legacy password", salt = "WerkzeugSalt1234";
  const hash = `scrypt:32768:8:1$${salt}$${scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 67108864 }).toString("hex")}`;
  assert.equal(await verifyPassword(password, hash), true); assert.equal(await verifyPassword("wrong password", hash), false);
  assert.throws(() => settings({ MONGODB_URI: "invalid" }));
  assert.throws(() => settings({ MONGODB_URI: "mongodb://localhost", CORS_ORIGINS: "*" }));
});
