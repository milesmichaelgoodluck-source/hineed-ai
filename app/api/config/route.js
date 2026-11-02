import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, client-safe config. The Paystack PUBLIC key is designed to be used in
// the browser; the SECRET key is never exposed here.
export async function GET() {
  return NextResponse.json({
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || null,
    paymentsLive: !!(process.env.PAYSTACK_PUBLIC_KEY && process.env.PAYSTACK_SECRET_KEY),
    mapsKey: !!(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY),
  });
}
