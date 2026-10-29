import { NextResponse } from "next/server";
import { toggleLike } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  const p = toggleLike(id, session.uid);
  if (!p) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ likes: p.likes.length, liked: p.likes.includes(session.uid) });
}
