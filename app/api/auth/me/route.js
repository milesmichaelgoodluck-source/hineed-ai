import { NextResponse } from "next/server";
import { findUserById, publicUser, updateUser } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ user: null });
  const user = findUserById(session.uid);
  if (!user || user.blocked) return NextResponse.json({ user: null });
  return NextResponse.json({ user: publicUser(user) });
}

// Update the signed-in user's own profile / shop / location.
export async function PATCH(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const user = findUserById(session.uid);
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body;
  try { body = await req.json(); } catch { body = {}; }

  const patch = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body.phone === "string") patch.phone = body.phone.trim() || null;
  if (typeof body.location === "string") patch.location = body.location.trim() || null;
  if (body.profile && typeof body.profile === "object") patch.profile = { ...(user.profile || {}), ...body.profile };
  if (body.shop && typeof body.shop === "object") patch.shop = { ...(user.shop || {}), ...body.shop };

  const updated = updateUser(session.uid, patch);
  return NextResponse.json({ user: publicUser(updated) });
}
