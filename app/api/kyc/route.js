import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { setKyc, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ status: "none" });
  const u = findUserById(session.uid);
  return NextResponse.json({ status: (u && u.kyc && u.kyc.status) || "none" });
});

// Submit an ID document (data URL) for verification.
export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let body; try { body = await req.json(); } catch { body = {}; }
  if (!body.doc) return NextResponse.json({ error: "Attach a photo of your ID." }, { status: 400 });
  // keep it reasonable in size
  if (typeof body.doc === "string" && body.doc.length > 3_500_000) return NextResponse.json({ error: "Image too large — use a smaller photo." }, { status: 400 });
  setKyc(session.uid, body.doc);
  return NextResponse.json({ status: "pending" });
});
