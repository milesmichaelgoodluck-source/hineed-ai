import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { getRide, updateRide, findUserById, addNotification } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Driver: accept/arrive/complete. Rider or driver: cancel.
export const PATCH = withDb(async (req, { params }) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  let body; try { body = await req.json(); } catch { body = {}; }
  const ride = getRide(id);
  if (!ride) return NextResponse.json({ error: "Ride not found." }, { status: 404 });
  const me = findUserById(session.uid);

  let patch = null;
  if (body.action === "accept" && ride.status === "requested") {
    patch = { status: "accepted", driverId: session.uid, driverName: me?.name || "Driver" };
    addNotification(ride.riderId, "ride", `${me?.name || "A driver"} accepted your ride`, "move");
  } else if (body.action === "arrive" && ride.driverId === session.uid) {
    patch = { status: "arriving" };
    addNotification(ride.riderId, "ride", "Your driver is arriving", "move");
  } else if (body.action === "complete" && ride.driverId === session.uid) {
    patch = { status: "completed" };
    addNotification(ride.riderId, "ride", "Your ride is complete", "move");
  } else if (body.action === "cancel") {
    patch = { status: "cancelled" };
  } else {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }
  const updated = updateRide(id, patch);
  return NextResponse.json({ ride: updated });
});
