import { Pool, QueryResult, types } from "pg";
import { env } from "./env";

export type Tx = (sql: string, params?: unknown[]) => Promise<QueryResult>;

types.setTypeParser(1700, (value) => (value === null ? null : Number(value)));
types.setTypeParser(20, (value) => (value === null ? null : Number(value)));

export const pool = new Pool({ connectionString: env.DATABASE_URL });

const logSql = env.NODE_ENV === "development";

export function query<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
) {
  if (logSql) console.log("[SQL]", sql.replace(/\s+/g, " ").trim(), params.length ? params : "");
  return pool.query<T>(sql, params);
}

export async function withTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  const tx: Tx = (sql, params = []) => {
    if (logSql) console.log("[SQL:tx]", sql.replace(/\s+/g, " ").trim(), params.length ? params : "");
    return client.query(sql, params);
  };
  try {
    await client.query("BEGIN");
    const result = await fn(tx);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const PG = {
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
} as const;

export function isPgError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === code
  );
}

export const db = { query, withTransaction, pool };
