import { NextResponse } from "next/server";
import { listBookings, createBooking, getProvider } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// List the signed-in user's bookings.
export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const bookings = listBookings(session.uid).map((b) => {
    const p = getProvider(b.providerId);
    return {
      id: b.id,
      provider: p?.name || b.providerId,
      category: p?.category || null,
      area: p?.area || null,
      service: b.service,
      price: b.price,
      status: b.status,
      createdAt: b.createdAt,
    };
  });

  return NextResponse.json({ bookings });
}

// Create a booking. Money is modelled as held in escrow on creation.
export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Please sign in to book." }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const providerId = (body.providerId || "").trim();
  const service = (body.service || "").trim() || "Service booking";
  const price = (body.price || "").trim() || "Quote";

  const provider = getProvider(providerId);
  if (!provider) return NextResponse.json({ error: "Unknown provider." }, { status: 404 });

  const booking = createBooking({ userId: session.uid, providerId, service, price });

  return NextResponse.json({
    booking: {
      id: booking.id,
      provider: provider.name,
      service: booking.service,
      price: booking.price,
      status: booking.status,
    },
  });
}
