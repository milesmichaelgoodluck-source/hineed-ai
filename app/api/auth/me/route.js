import { NextResponse } from "next/server";
import { findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ user: null });
  const user = findUserById(session.uid);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}
