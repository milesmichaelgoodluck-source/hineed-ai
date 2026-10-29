import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listNotifications, notifUnread, markNotifsRead } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ notifications: [], unread: 0 });
  return NextResponse.json({ notifications: listNotifications(session.uid), unread: notifUnread(session.uid) });
});

// Mark all as read.
export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ ok: false });
  markNotifsRead(session.uid);
  return NextResponse.json({ ok: true });
});
