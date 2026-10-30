import { NextResponse } from "next/server";
import { dbPing } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight health/diagnostic endpoint. Does NOT use withDb, so it responds
// even when the database is misconfigured.
export async function GET() {
  const db = await dbPing();
  return NextResponse.json({ ok: true, version: "db-resilient-1", db });
}
