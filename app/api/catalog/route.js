import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listCategories, chargesByCategory, listProviders, sampleReviews } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async () => {
  const cats = listCategories();
  const providers = listProviders().filter((p) => !p.blocked);
  const reviews = sampleReviews();
  const CATLBL = {};
  cats.forEach((c) => { CATLBL[c.id] = c.label; });
  const CAT_CHARGES = chargesByCategory();
  const PROV = {};
  providers.forEach((p) => {
    PROV[p.id] = { n: p.name, c: p.category, a: p.area, r: String(p.rating), rv: String(p.reviewCount), b: p.bio };
  });
  const REVIEWS = reviews.map((r) => [r.author, r.rating, r.body]);
  return NextResponse.json({ CATLBL, CAT_CHARGES, PROV, REVIEWS });
});
