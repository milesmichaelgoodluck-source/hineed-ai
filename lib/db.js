// Durable persistence for the Hineed store.
//
// The whole store state is kept as one JSON document. Three backends:
//   - Postgres  (when DATABASE_URL / POSTGRES_URL is set) — used in production
//                so accounts, logins and everything else PERSIST across visits.
//   - PGlite    (when HINEED_PGLITE=1) — in-process Postgres, for local tests.
//   - File      (default) — ./data/db.json for local development.
//
// Every API route is wrapped with withDb(), which loads the state before the
// handler runs and saves it after, so the store code stays simple and sync.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const g = globalThis;

function mode() {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) return "pg";
  if (process.env.HINEED_PGLITE) return "pglite";
  return "file";
}

function filePath() {
  if (process.env.HINEED_DATA_FILE) return process.env.HINEED_DATA_FILE;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return path.join(os.tmpdir(), "hineed-db.json");
  return path.join(process.cwd(), "data", "db.json");
}

// ---- Postgres / PGlite client (lazy, cached on globalThis) ----
async function sqlClient() {
  const m = mode();
  if (m === "pg") {
    if (!g.__hineedPg) {
      const pkg = await import(/* webpackIgnore: true */ "pg");
      const Pool = pkg.default?.Pool || pkg.Pool;
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false },
        max: 3,
      });
      await pool.query("CREATE TABLE IF NOT EXISTS hineed_state (id int PRIMARY KEY, data jsonb)");
      g.__hineedPg = { query: (sql, params) => pool.query(sql, params) };
    }
    return g.__hineedPg;
  }
  if (m === "pglite") {
    if (!g.__hineedPglite) {
      const { PGlite } = await import(/* webpackIgnore: true */ "@electric-sql/pglite");
      const db = new PGlite(process.env.HINEED_PGLITE_DIR || undefined);
      await db.query("CREATE TABLE IF NOT EXISTS hineed_state (id int PRIMARY KEY, data jsonb)");
      g.__hineedPglite = { query: (sql, params) => db.query(sql, params) };
    }
    return g.__hineedPglite;
  }
  return null;
}

// ---- load / save the whole state document ----
export async function dbLoad() {
  const m = mode();
  if (m === "file") {
    try {
      const f = filePath();
      if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
    } catch {}
    return null;
  }
  const c = await sqlClient();
  const res = await c.query("SELECT data FROM hineed_state WHERE id = 1");
  const row = res.rows && res.rows[0];
  if (!row) return null;
  return typeof row.data === "string" ? JSON.parse(row.data) : row.data;
}

export async function dbSave(state) {
  const m = mode();
  if (m === "file") {
    try {
      const f = filePath();
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, JSON.stringify(state, null, 2));
    } catch {}
    return;
  }
  const c = await sqlClient();
  const json = JSON.stringify(state);
  await c.query(
    "INSERT INTO hineed_state (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data",
    [json]
  );
}

export function dbMode() { return mode(); }

// ---- route wrapper: load state before, save (if changed) after ----
export function withDb(handler) {
  return async (req, ctx) => {
    const { loadState, saveState } = await import("./store.js");
    await loadState();
    const res = await handler(req, ctx);
    await saveState();
    return res;
  };
}
