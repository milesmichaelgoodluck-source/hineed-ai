import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listTalent, createTalent, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async () => {
  return NextResponse.json({ talent: listTalent() });
});

// Job seeker lists themselves as talent
export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to create your profile." }, { status: 401 });
  const me = findUserById(session.uid);
  let b; try { b = await req.json(); } catch { b = {}; }
  if (!b.role) return NextResponse.json({ error: "Enter your role / expertise." }, { status: 400 });
  const skills = Array.isArray(b.skills) ? b.skills : String(b.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const jobsWorked = Array.isArray(b.jobsWorked) ? b.jobsWorked : String(b.jobsWorked || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const t = createTalent({
    userId: session.uid,
    name: (b.name || (me && me.name) || "Talent").trim(),
    role: (b.role || "").trim(),
    exp: (b.exp || "").trim(),
    rate: (b.rate || "Negotiable").trim(),
    location: (b.location || "").trim(),
    phone: (b.phone || (me && me.phone) || "").trim(),
    available: (b.available || "").trim(),
    skills, jobsWorked,
    bio: (b.bio || "").trim(),
  });
  return NextResponse.json({ talent: t });
});
