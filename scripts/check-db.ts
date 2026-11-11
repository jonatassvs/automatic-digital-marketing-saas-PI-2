import * as envMod from "@next/env";
import { MongoClient } from "mongodb";
import { settings } from "../server/config";
import { createIndexes } from "../server/repositories/database";

const getLoadEnvConfig = () => {
  const mod = envMod as unknown as { loadEnvConfig?: (dir: string) => unknown; default?: { loadEnvConfig?: (dir: string) => unknown } };
  return mod.loadEnvConfig ?? mod.default?.loadEnvConfig;
};

async function main() {
  const loadEnvConfig = getLoadEnvConfig();
  if (typeof loadEnvConfig === "function") {
    loadEnvConfig(process.cwd());
  }
  const config = settings();
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(config.database);
    await createIndexes(db);
    await db.command({ ping: 1 });
    console.log("MongoDB conectado; indices conferidos.");
  } finally {
    await client.close();
  }
}
main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message.replace(/:[^@]+@/, ":***@") : String(err);
  console.error("Falha ao conectar ao MongoDB. Confira o ambiente, as credenciais e a permissao de rede.");
  console.error(`Detalhes: ${message}`);
  process.exitCode = 1;
});
