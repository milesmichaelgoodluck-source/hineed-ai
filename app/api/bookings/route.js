import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listBookings, listBookingsForProvider, createBooking, getProvider, findUserById, addNotification } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const role = new URL(req.url).searchParams.get("role");
  if (role === "provider") {
    const bookings = listBookingsForProvider(session.uid).map((b) => {
      const buyer = findUserById(b.userId);
      return { id: b.id, customer: buyer?.name || "Customer", service: b.service, price: b.price, status: b.status, createdAt: b.createdAt };
    });
    return NextResponse.json({ bookings });
  }
  const bookings = listBookings(session.uid).map((b) => {
    const p = getProvider(b.providerId);
    return { id: b.id, provider: b.providerName || p?.name || b.providerId, category: p?.category || null, area: p?.area || null, service: b.service, price: b.price, status: b.status, createdAt: b.createdAt };
  });
  return NextResponse.json({ bookings });
});

export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Please sign in to book." }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const providerId = (body.providerId || "").trim();
  const service = (body.service || "").trim() || "Service booking";
  const price = (body.price || "").trim() || "Quote";
  const provider = getProvider(providerId);
  if (!provider) return NextResponse.json({ error: "Unknown provider." }, { status: 404 });
  const booking = createBooking({ userId: session.uid, providerId, providerName: provider.name, service, price });
  const cust = findUserById(session.uid);
  addNotification(providerId, "booking", `${cust?.name || "A customer"} requested: ${service}`, "dash");
  return NextResponse.json({ booking: { id: booking.id, provider: provider.name, service: booking.service, price: booking.price, status: booking.status } });
});
