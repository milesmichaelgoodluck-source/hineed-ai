import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { getPublicProfile } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req, { params }) => {
  const { id } = await params;
  const profile = getPublicProfile(id);
  if (!profile) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ profile });
});
