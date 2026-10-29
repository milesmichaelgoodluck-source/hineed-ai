import { NextResponse } from "next/server";
import { adminStats, adminListUsers } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  return NextResponse.json({ stats: adminStats(), users: adminListUsers() });
}
