import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { createRide, listOpenRides, listRidesForDriver, listRidesForRider, findUserById } from "@/lib/store";
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
  const ride = createRide({ riderId: session.uid, riderName: me?.name || "Rider", pickup, dropoff, fare: (body.fare || "").trim() });
  return NextResponse.json({ ride });
});
