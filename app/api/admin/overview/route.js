import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { adminStats, adminListUsers } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  return NextResponse.json({ stats: adminStats(), users: adminListUsers() });
});
