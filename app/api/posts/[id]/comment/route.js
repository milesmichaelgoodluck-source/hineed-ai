import { NextResponse } from "next/server";
import { addComment, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const me = findUserById(session.uid);
  const { id } = await params;
  let body; try { body = await req.json(); } catch { body = {}; }
  const text = (body.text || "").trim();
  if (!text) return NextResponse.json({ error: "Write a comment." }, { status: 400 });
  const p = addComment(id, session.uid, me?.name || "User", text);
  if (!p) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ comments: p.comments.map((c) => ({ author: c.authorName, text: c.text, createdAt: c.createdAt })) });
}
