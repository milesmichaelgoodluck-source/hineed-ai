import { NextResponse } from "next/server";
import { setOtp } from "@/lib/store";
import { sendOtpEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generates a 6-digit code, stores it (10-min expiry), and emails it.
// If no email provider is configured, returns the code as `devCode` so the
// verification flow stays usable in test mode.
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  setOtp(email, code);

  const result = await sendOtpEmail(email, code);
  const payload = { sent: result.sent };
  if (!result.sent) payload.devCode = code; // test mode — no email provider set
  return NextResponse.json(payload);
}
