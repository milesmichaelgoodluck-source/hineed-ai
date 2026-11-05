import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { createRide, listOpenRides, listRidesForDriver, listRidesForRider, findUserById, getDriverPublic, addNotification } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?role=driver -> my driving jobs ; ?role=open -> open requests ; else my rides as a rider
export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const role = new URL(req.url).searchParams.get("role");
  if (role === "driver") return NextResponse.json({ rides: listRidesForDriver(session.uid) });
  if (role === "open") return NextResponse.json({ rides: listOpenRides() });
  return NextResponse.json({ rides: listRidesForRider(session.uid) });
});

// A customer requests a ride.
export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to book a ride." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const pickup = (body.pickup || "").trim();
  const dropoff = (body.dropoff || "").trim();
  if (!pickup || !dropoff) return NextResponse.json({ error: "Enter pickup and drop-off." }, { status: 400 });
  const kind = body.kind === "dispatch" ? "dispatch" : "ride";
  const driverId = (body.driverId || "").trim() || null;

  // If the customer picked a specific driver:
  let opts = { riderId: session.uid, riderName: me?.name || "Rider", pickup, dropoff, fare: (body.fare || "").trim(), kind };
  if (driverId) {
    const drv = getDriverPublic(driverId);
    if (!drv) return NextResponse.json({ error: "That driver is no longer available." }, { status: 400 });
    if (!drv.online) return NextResponse.json({ error: "That driver is offline right now." }, { status: 400 });
    if (drv.booked) return NextResponse.json({ error: "That driver is on another trip right now." }, { status: 400 });
    opts.driverId = driverId;
    opts.driverName = drv.name;
    opts.type = drv.type;
    opts.fare = opts.fare || drv.price || "";
    // Seeded demo drivers auto-accept so the trip is live immediately.
    // A real rider account must accept from their own dashboard.
    const isSeeded = /^drv-/.test(driverId);
    if (isSeeded) {
      opts.status = "accepted";
    } else {
      opts.status = "requested";
      addNotification(driverId, "ride", `${me?.name || "A customer"} requested a ${kind === "dispatch" ? "dispatch" : "ride"}: ${pickup} → ${dropoff}`, "dash");
    }
  }
  const ride = createRide(opts);
  return NextResponse.json({ ride });
});
