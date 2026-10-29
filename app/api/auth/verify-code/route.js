import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { getOtp, clearOtp, markVerifiedByEmail } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withDb(async (req) => {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = (body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();

  const rec = getOtp(email);
  if (!rec) return NextResponse.json({ error: "No code found. Request a new one." }, { status: 400 });
  if (rec.expires < Date.now()) { clearOtp(email); return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 }); }
  if (rec.code !== code) return NextResponse.json({ error: "Wrong code. Try again." }, { status: 400 });

  clearOtp(email);
  markVerifiedByEmail(email);
  return NextResponse.json({ ok: true });
});
