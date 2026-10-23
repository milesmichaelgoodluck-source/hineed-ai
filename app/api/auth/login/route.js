import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/store";
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

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
  res.cookies.set(COOKIE_NAME, signSession({ uid: user.id }), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: SESSION_MAX_AGE, secure: process.env.NODE_ENV === "production",
  });
  return res;
}
