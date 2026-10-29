import { NextResponse } from "next/server";
import { listCallRequests, createCallRequest, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET -> call requests sent TO me (provider/business inbox)
export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({ calls: listCallRequests(session.uid) });
}

// POST -> customer requests a call from a provider/business
export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const toId = (body.toId || "").trim();
  if (!toId) return NextResponse.json({ error: "Recipient required." }, { status: 400 });
  const call = createCallRequest({ fromId: session.uid, fromName: me?.name || "Customer", toId });
  return NextResponse.json({ call });
}
