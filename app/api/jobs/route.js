import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listJobs, listTalent, createJob, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async () => {
  return NextResponse.json({ jobs: listJobs(), talent: listTalent() });
});

// Employer posts a job
export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to post a job." }, { status: 401 });
  const me = findUserById(session.uid);
  let b; try { b = await req.json(); } catch { b = {}; }
  if (!b.title) return NextResponse.json({ error: "Enter a job title." }, { status: 400 });
  const job = createJob({
    posterId: session.uid,
    company: (b.company || (me && me.name) || "A business").trim(),
    title: (b.title || "").trim(),
    type: (b.type || "Full-time").trim(),
    pay: (b.pay || "Negotiable").trim(),
    cat: (b.cat || "Other").trim(),
    area: (b.area || "").trim(),
    desc: (b.desc || "").trim(),
  });
  return NextResponse.json({ job });
});
