import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, client-safe config. The Paystack PUBLIC key is designed to be used in
// the browser; the SECRET key is never exposed here.
export async function GET(req) {
  const pub = (process.env.PAYSTACK_PUBLIC_KEY || "").trim();
  const out = {
    paystackPublicKey: pub || null,
    paymentsLive: !!(pub && (process.env.PAYSTACK_SECRET_KEY || "").trim()),
    mapsKey: !!(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY),
  };
  // Safe diagnostic (no secret revealed): only shape of the secret key.
  try {
    if (new URL(req.url).searchParams.get("debug") === "1") {
      const raw = process.env.PAYSTACK_SECRET_KEY || "";
      out.secretCheck = {
        present: !!raw,
        rawLen: raw.length,
        trimLen: raw.trim().length,
        startsWith: raw.trim().slice(0, 8),
        startsSkTest: raw.trim().startsWith("sk_test_"),
        hasSpaceInside: /\s/.test(raw.trim()),
        hasQuote: /["']/.test(raw),
      };
    }
  } catch {}
  return NextResponse.json(out);
}
