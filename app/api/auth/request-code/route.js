import { NextResponse } from "next/server";
import { withDb, dbMode } from "@/lib/db";
import { setOtp, findUserByEmail } from "@/lib/store";
import { sendOtpEmail } from "@/lib/email";
import { sendOtpSms } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withDb(async (req) => {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  setOtp(email, code);

  const emailRes = await sendOtpEmail(email, code);
  // Also text the code if the account has a phone and an SMS provider is set up.
  const u = findUserByEmail(email);
  const smsRes = u && u.phone ? await sendOtpSms(u.phone, code) : { sent: false };

  const sent = emailRes.sent || smsRes.sent;
  const payload = { sent, viaEmail: emailRes.sent, viaSms: smsRes.sent };
  if (!sent) payload.devCode = code; // test mode — no provider configured yet
  // Safe diagnostics (no secret values) — booleans + a short reason string.
  if (new URL(req.url).searchParams.get("debug") === "1") {
    payload.debug = {
      gmailSet: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      resendSet: !!process.env.RESEND_API_KEY,
      emailReason: emailRes.reason || null,
      emailVia: emailRes.via || null,
      gmailErr: globalThis.__gmailErr || null,
      dbMode: dbMode(),
    };
  }
  return NextResponse.json(payload);
});
