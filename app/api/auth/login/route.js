import { NextResponse } from "next/server";
import { findUserByEmail, publicUser } from "@/lib/store";
import { verifyPassword, signSession, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = (body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  if (user.blocked) {
    return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
  }

  const res = NextResponse.json({ user: publicUser(user) });
  res.cookies.set(COOKIE_NAME, signSession({ uid: user.id }), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: SESSION_MAX_AGE, secure: process.env.NODE_ENV === "production",
  });
  return res;
}
