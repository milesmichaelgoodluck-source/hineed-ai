import { NextResponse } from "next/server";
import { PROVIDERS, isConfigured, callbackUrl } from "@/lib/oauth";
import { findUserByEmail, createUser } from "@/lib/store";
import { signSession, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Handles the redirect back from Google/Facebook: exchanges the code for the
// user's email, creates or finds the account, signs them in, sends them home.
export async function GET(req) {
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider") || "";
  const code = url.searchParams.get("code");
  const p = PROVIDERS[provider];
  if (!p || !isConfigured(provider) || !code) {
    return NextResponse.redirect(`${url.origin}/?auth=oauth_error`);
  }

  try {
    const redirect = callbackUrl(url.origin, provider);
    const tokenRes = await fetch(p.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env[p.idEnv],
        client_secret: process.env[p.secretEnv],
        redirect_uri: redirect,
        grant_type: "authorization_code",
      }),
    });
    const token = await tokenRes.json();
    if (!token.access_token) return NextResponse.redirect(`${url.origin}/?auth=oauth_error`);

    const uRes = await fetch(p.userUrl, { headers: { Authorization: `Bearer ${token.access_token}` } });
    const profile = p.parseUser(await uRes.json());
    if (!profile.email) return NextResponse.redirect(`${url.origin}/?auth=oauth_noemail`);

    let user = findUserByEmail(profile.email);
    if (!user) {
      user = createUser({
        name: profile.name, email: profile.email, role: "customer",
        passwordHash: crypto.randomBytes(24).toString("hex"), // no password login for social accounts
        provider,
      });
    }

    const res = NextResponse.redirect(`${url.origin}/?auth=ok`);
    res.cookies.set(COOKIE_NAME, signSession({ uid: user.id }), {
      httpOnly: true, sameSite: "lax", path: "/",
      maxAge: SESSION_MAX_AGE, secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch {
    return NextResponse.redirect(`${url.origin}/?auth=oauth_error`);
  }
}
