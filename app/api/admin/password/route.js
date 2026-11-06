import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { isAdminRequest, hashPassword } from "@/lib/auth";
import { setAdminCreds, getAdminCreds } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  return NextResponse.json({ customSet: !!getAdminCreds() });
});

export const POST = withDb(async (req) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  let body; try { body = await req.json(); } catch { body = {}; }
  const username = (body.username || "").trim();
  const password = String(body.password || "");
  if (!username) return NextResponse.json({ error: "Enter an admin username." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  setAdminCreds(username, hashPassword(password));
  return NextResponse.json({ ok: true });
});
