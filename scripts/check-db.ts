import { loadEnvConfig } from "@next/env";
import { MongoClient } from "mongodb";
import { settings } from "../server/config";
import { createIndexes } from "../server/repositories/database";
async function main() {
  loadEnvConfig(process.cwd());
  const config = settings();
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 5000 });
  try { await client.connect(); const db = client.db(config.database); await createIndexes(db); await db.command({ ping: 1 }); console.log("MongoDB conectado; indices conferidos."); }
  finally { await client.close(); }
}
main().catch(() => { console.error("Falha ao conectar ao MongoDB. Confira o ambiente, as credenciais e a permissao de rede."); process.exitCode = 1; });
