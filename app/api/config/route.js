import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, client-safe config. The Paystack PUBLIC key and the Google Maps
// browser key are both designed to be used in the browser. The Paystack SECRET
// key is never exposed here. Keys are pattern-matched so a stray label like
// "Key " or extra spaces around a pasted value don't break anything.
export async function GET() {
  const rawPub = process.env.PAYSTACK_PUBLIC_KEY || "";
  const pm = rawPub.match(/pk_(?:test|live)_[A-Za-z0-9]+/);
  const pub = pm ? pm[0] : rawPub.trim();

  const rawSec = process.env.PAYSTACK_SECRET_KEY || "";
  const hasSecret = /sk_(?:test|live)_[A-Za-z0-9]+/.test(rawSec);

  const mapsRaw = (process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY || "").trim();

  return NextResponse.json({
    paystackPublicKey: pub || null,
    paymentsLive: !!(pub && hasSecret),
    googleMapsKey: mapsRaw || null,
    mapsKey: !!mapsRaw,
  });
}
