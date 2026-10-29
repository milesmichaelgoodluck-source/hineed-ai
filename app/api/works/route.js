import { NextResponse } from "next/server";
import { listWorks, createWork, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/works            -> public works feed (all providers)
// GET /api/works?owner=<id> -> one provider's works (their profile)
export async function GET(req) {
  const owner = new URL(req.url).searchParams.get("owner");
  const works = listWorks(owner).map((w) => {
    const o = findUserById(w.ownerId);
    return { ...w, ownerName: w.ownerName || o?.name || "Provider", category: w.category || o?.profile?.category || "" };
  });
  return NextResponse.json({ works });
}

// A provider shares a completed job to their public profile + the works feed.
export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const title = (body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Add a title for your work." }, { status: 400 });
  const work = createWork({
    ownerId: session.uid, ownerName: me?.name || "Provider",
    title, description: (body.description || "").trim(), image: body.image || null,
    category: (body.category || me?.profile?.category || "").trim(),
  });
  return NextResponse.json({ work });
}
