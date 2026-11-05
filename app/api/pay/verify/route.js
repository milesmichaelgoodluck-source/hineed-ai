import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { sessionFromRequest } from "@/lib/auth";
import { findUserById, addPayment, getPaymentByRef, updateOrderStatus } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Verifies a Paystack transaction server-side (the only trustworthy place to do
// it) and records the payment. The browser sends the reference after the popup
// succeeds; we confirm it with Paystack using the SECRET key.
export const POST = withDb(async (req) => {
  // Extract the real key even if the value picked up a label like "Key " or
  // stray spaces/quotes when it was pasted into the dashboard.
  const rawSecret = process.env.PAYSTACK_SECRET_KEY || "";
  const secMatch = rawSecret.match(/sk_(?:test|live)_[A-Za-z0-9]+/);
  const secret = secMatch ? secMatch[0] : rawSecret.trim();
  if (!secret) return NextResponse.json({ error: "Payments are not switched on yet." }, { status: 503 });

  const session = sessionFromRequest(req);
  const user = session?.uid ? findUserById(session.uid) : null;

  let body; try { body = await req.json(); } catch { body = {}; }
  const reference = (body.reference || "").trim();
  if (!reference) return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });

  // Idempotency — if we already recorded this reference, return it.
  const existing = getPaymentByRef(reference);
  if (existing) return NextResponse.json({ ok: true, payment: existing, alreadyRecorded: true });

  let data;
  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const j = await r.json();
    data = j.data;
    if (!j.status || !data || data.status !== "success") {
      return NextResponse.json({ error: "Payment not successful.", detail: (data && data.gateway_response) || j.message || null }, { status: 402 });
    }
  } catch {
    return NextResponse.json({ error: "Could not verify payment — try again." }, { status: 502 });
  }

  const amountNaira = (Number(data.amount) || 0) / 100; // Paystack amounts are in kobo
  const meta = data.metadata || {};
  const payment = addPayment({
    userId: user?.id || null,
    reference,
    amount: amountNaira,
    currency: data.currency || "NGN",
    purpose: meta.purpose || "payment",
    status: "success",
    meta,
  });

  // If this paid for an order, mark it paid.
  if (meta.orderId) {
    try { updateOrderStatus(meta.orderId, "paid", meta.sellerId || null); } catch {}
  }

  return NextResponse.json({ ok: true, payment });
});
