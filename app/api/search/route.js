import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { search } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const q = new URL(req.url).searchParams.get("q") || "";
  return NextResponse.json(search(q));
});
