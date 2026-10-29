import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { getBooking, updateBookingStatus } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEXT = { complete: "completed", release: "released", cancel: "cancelled" };

export const PATCH = withDb(async (req, { params }) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await params;
  let body; try { body = await req.json(); } catch { body = {}; }
  const status = NEXT[body.action];
  if (!status) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  const booking = getBooking(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  // customer (owner) or the provider the booking is for may advance it
  if (booking.userId !== session.uid && booking.providerId !== session.uid) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const updated = updateBookingStatus(id, status);
  return NextResponse.json({ booking: { id: updated.id, status: updated.status } });
});
