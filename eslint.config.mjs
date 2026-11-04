import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "node_modules/**", "out/**", "next-env.d.ts", "old_project/**", "cold_project/**"]),
  { files: ["tests/**/*.cjs", "scripts/**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } }
]);
