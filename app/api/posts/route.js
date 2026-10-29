import { NextResponse } from "next/server";
import { listPosts, createPost, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = sessionFromRequest(req);
  const me = session?.uid || null;
  const posts = listPosts().map((p) => ({
    id: p.id, author: p.authorName, authorId: p.authorId, text: p.text, image: p.image,
    likes: p.likes.length, liked: me ? p.likes.includes(me) : false,
    comments: p.comments.map((c) => ({ author: c.authorName, text: c.text, createdAt: c.createdAt })),
    createdAt: p.createdAt,
  }));
  return NextResponse.json({ posts });
}

export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const text = (body.text || "").trim();
  if (!text && !body.image) return NextResponse.json({ error: "Write something to post." }, { status: 400 });
  const post = createPost({ authorId: session.uid, authorName: me?.name || "User", text, image: body.image || null });
  return NextResponse.json({ post: { id: post.id, author: post.authorName, text: post.text, image: post.image, likes: 0, liked: false, comments: [], createdAt: post.createdAt } });
}
