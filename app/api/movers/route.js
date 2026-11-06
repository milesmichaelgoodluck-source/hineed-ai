import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listMovers } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area") || "";
  return NextResponse.json({ movers: listMovers({ area }) });
});
