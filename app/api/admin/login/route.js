import { NextResponse } from "next/server";
import { checkAdmin, signSession, ADMIN_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let body; try { body = await req.json(); } catch { body = {}; }
  const username = (body.username || "").trim();
  const password = String(body.password || "");
  if (!checkAdmin(username, password)) {
    return NextResponse.json({ error: "Wrong admin username or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signSession({ admin: true, u: username }), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: 60 * 60 * 8, secure: process.env.NODE_ENV === "production",
  });
  return res;
}
