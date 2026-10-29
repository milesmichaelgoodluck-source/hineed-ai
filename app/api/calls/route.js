import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listCallRequests, createCallRequest, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({ calls: listCallRequests(session.uid) });
});

export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const toId = (body.toId || "").trim();
  if (!toId) return NextResponse.json({ error: "Recipient required." }, { status: 400 });
  const call = createCallRequest({ fromId: session.uid, fromName: me?.name || "Customer", toId });
  return NextResponse.json({ call });
});
