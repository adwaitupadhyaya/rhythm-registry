import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: readonly unknown[],
): Promise<QueryResult<T>> {
  try {
    return await pool.query<T>(text, params ? [...params] : params);
  } catch (error) {
    throw error;
  }
}

export async function checkDb(): Promise<void> {
  await query("SELECT 1");
}

export default pool;
