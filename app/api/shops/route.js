import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listShops } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async () => {
  return NextResponse.json({ shops: listShops() });
});
