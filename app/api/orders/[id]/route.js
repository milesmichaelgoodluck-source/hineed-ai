import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { updateOrderStatus } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEXT = { accept: "accepted", complete: "completed", cancel: "cancelled" };

export const PATCH = withDb(async (req, { params }) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  let body; try { body = await req.json(); } catch { body = {}; }
  const status = NEXT[body.action];
  if (!status) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const updated = updateOrderStatus(id, status, session.uid);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ order: { id: updated.id, status: updated.status } });
});
