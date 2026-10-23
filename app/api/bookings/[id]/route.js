import { NextResponse } from "next/server";
import { getBooking, updateBookingStatus } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Move a booking through the escrow lifecycle.
//   complete -> provider marks the job done
//   release  -> customer approves, funds released
//   cancel   -> booking cancelled
const NEXT = { complete: "completed", release: "released", cancel: "cancelled" };

export async function PATCH(req, { params }) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  let body;
  try { body = await req.json(); } catch { body = {}; }
  const status = NEXT[body.action];
  if (!status) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const booking = getBooking(id);
  if (!booking || booking.userId !== session.uid) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const updated = updateBookingStatus(id, status);
  return NextResponse.json({ booking: { id: updated.id, status: updated.status } });
}
