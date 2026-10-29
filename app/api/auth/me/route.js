import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { findUserById, publicUser, updateUser } from "@/lib/store";
import { sessionFromRequest, userFromSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ user: null });
  const user = findUserById(session.uid);
  if (user) {
    if (user.blocked) return NextResponse.json({ user: null });
    return NextResponse.json({ user: publicUser(user) });
  }
  // The store doesn't have this user (e.g. no database connected yet and the
  // server's memory was recycled). Keep them signed in from their session.
  return NextResponse.json({ user: userFromSession(session) });
});

export const PATCH = withDb(async (req) => {
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
  if (body.driver && typeof body.driver === "object") patch.driver = { ...(user.driver || {}), ...body.driver };
  if (typeof body.photo === "string") patch.photo = body.photo.slice(0, 2_000_000) || null;

  const updated = updateUser(session.uid, patch);
  return NextResponse.json({ user: publicUser(updated) });
});
