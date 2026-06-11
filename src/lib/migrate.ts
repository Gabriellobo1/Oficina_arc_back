import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./db";

async function main() {
  const schemaPath = join(__dirname, "..", "..", "sql", "schema.sql");
  const sql = readFileSync(schemaPath, "utf-8");

  await pool.query(sql);
  console.log("Esquema aplicado com sucesso (sql/schema.sql).");
}

main()
  .catch((error) => {
    console.error("Falha ao aplicar o esquema:", error);
    process.exit(1);
  })
  .finally(() => pool.end());
