import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listFreight } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  return NextResponse.json({ partners: listFreight({ from, to }) });
});
