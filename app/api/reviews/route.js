import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { createReview, listReviews, ratingFor, findUserById, addNotification } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const target = new URL(req.url).searchParams.get("target") || "";
  return NextResponse.json({ reviews: listReviews(target), ...ratingFor(target) });
});

export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to review." }, { status: 401 });
  const me = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const targetId = (body.targetId || "").trim();
  if (!targetId) return NextResponse.json({ error: "Missing who you're reviewing." }, { status: 400 });
  const review = createReview({ targetId, authorId: session.uid, authorName: me?.name || "Customer", rating: body.rating, body: (body.body || "").trim() });
  addNotification(targetId, "review", `${me?.name || "Someone"} left you a ${review.rating}★ review`, "dash");
  return NextResponse.json({ review, ...ratingFor(targetId) });
});
