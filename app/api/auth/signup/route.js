import { NextResponse } from "next/server";
import { createUser, findUserByEmail, updateUser } from "@/lib/store";
import { hashPassword, verifyPassword, signSession, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES = ["customer", "provider", "business"];

// Single onboarding endpoint: creates an account, or logs the person in if the
// email already exists and the password matches.
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return bad("Invalid request."); }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim() || null;
  const dob = (body.dob || "").trim() || null;
  const password = String(body.password || "");
  const role = ROLES.includes(body.role) ? body.role : "customer";

  if (!email || !email.includes("@")) return bad("Enter a valid email address.");
  if (password.length < 6) return bad("Password must be at least 6 characters.");

  const existing = findUserByEmail(email);

  let user;
  if (existing) {
    if (!verifyPassword(password, existing.passwordHash)) {
      return bad("That email is already registered. Check your password.", 409);
    }
    user = updateUser(existing.id, {
      role,
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(dob ? { dob } : {}),
    });
  } else {
    user = createUser({
      name: name || email.split("@")[0], email, phone, dob, role, passwordHash: hashPassword(password),
    });
  }

  return withSession(user);
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}
function bad(error, status = 400) {
  return NextResponse.json({ error }, { status });
}
function withSession(user) {
  const res = NextResponse.json({ user: publicUser(user) });
  res.cookies.set(COOKIE_NAME, signSession({ uid: user.id }), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: SESSION_MAX_AGE, secure: process.env.NODE_ENV === "production",
  });
  return res;
}
