import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { adminSetBlocked, adminDeleteUser } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const PATCH = withDb(async (req, { params }) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  const { id } = await params;
  let body; try { body = await req.json(); } catch { body = {}; }
  const u = adminSetBlocked(id, body.action === "block");
  if (!u) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, blocked: u.blocked });
});

export const DELETE = withDb(async (req, { params }) => {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin only." }, { status: 403 });
  const { id } = await params;
  const ok = adminDeleteUser(id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
});
