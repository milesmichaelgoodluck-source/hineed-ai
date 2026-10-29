import { NextResponse } from "next/server";
import { PROVIDERS, isConfigured, callbackUrl } from "@/lib/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Starts a social login. If the provider isn't configured yet, returns JSON so
// the UI can show a friendly "set up needed" message instead of a broken redirect.
export async function GET(req) {
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider") || "";
  const p = PROVIDERS[provider];
  if (!p) return NextResponse.json({ error: "Unknown provider." }, { status: 400 });

  if (!isConfigured(provider)) {
    return NextResponse.json({ configured: false, provider });
  }

  const origin = url.origin;
  const auth = new URL(p.authUrl);
  auth.searchParams.set("client_id", process.env[p.idEnv]);
  auth.searchParams.set("redirect_uri", callbackUrl(origin, provider));
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", p.scope);
  auth.searchParams.set("state", provider);
  return NextResponse.redirect(auth.toString());
}
