import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listKycPending, adminSetKyc, addNotification } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  return NextResponse.json({ pending: listKycPending() });
});

export const POST = withDb(async (req) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  let body; try { body = await req.json(); } catch { body = {}; }
  const status = body.action === "verify" ? "verified" : "rejected";
  const u = adminSetKyc((body.userId || "").trim(), status);
  if (!u) return NextResponse.json({ error: "Not found." }, { status: 404 });
  addNotification(u.id, "kyc", status === "verified" ? "Your identity is verified ✓" : "Your ID verification was declined — please re-submit", "dash");
  return NextResponse.json({ ok: true, status });
});
