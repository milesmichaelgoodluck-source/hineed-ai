import { NextResponse } from "next/server";
import { listConversation, listThreads, sendMessage, markRead, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/messages              -> my conversation threads
// GET /api/messages?with=<uid>   -> the full conversation with that user
export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const other = new URL(req.url).searchParams.get("with");
  if (other) {
    markRead(session.uid, other);
    const u = findUserById(other);
    const messages = listConversation(session.uid, other).map((m) => ({
      id: m.id, mine: m.fromId === session.uid, body: m.body, createdAt: m.createdAt,
    }));
    return NextResponse.json({ with: { id: other, name: u?.name || "User" }, messages });
  }
  return NextResponse.json({ threads: listThreads(session.uid) });
}

export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to message." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const toId = (body.toId || "").trim();
  const text = (body.body || "").trim();
  if (!toId || !text) return NextResponse.json({ error: "Message and recipient required." }, { status: 400 });
  const msg = sendMessage({ fromId: session.uid, fromName: me?.name || "User", toId, body: text });
  return NextResponse.json({ message: { id: msg.id, mine: true, body: msg.body, createdAt: msg.createdAt } });
}
