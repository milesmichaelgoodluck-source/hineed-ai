import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { checkAdmin, verifyPassword, signSession, ADMIN_COOKIE } from "@/lib/auth";
import { getAdminCreds } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withDb(async (req) => {
  let body; try { body = await req.json(); } catch { body = {}; }
  const username = (body.username || "").trim();
  const password = String(body.password || "");

  // A password set from the admin console (stored hashed) overrides the env default.
  const creds = getAdminCreds();
  let ok;
  if (creds && creds.passwordHash) {
    ok = username === creds.username && verifyPassword(password, creds.passwordHash);
  } else {
    ok = checkAdmin(username, password);
  }
  if (!ok) return NextResponse.json({ error: "Wrong admin username or password." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signSession({ admin: true, u: username }), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: 60 * 60 * 8, secure: process.env.NODE_ENV === "production",
  });
  return res;
});
