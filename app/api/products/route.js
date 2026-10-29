import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listProducts, createProduct, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  const mine = new URL(req.url).searchParams.get("mine");
  const owner = mine && session?.uid ? session.uid : null;
  const products = listProducts(owner).map((p) => {
    const o = findUserById(p.ownerId);
    return { ...p, seller: o?.name || "Shop", shop: o?.shop?.name || o?.name || "Shop" };
  });
  return NextResponse.json({ products });
});

export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const user = findUserById(session.uid);
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });
  let body; try { body = await req.json(); } catch { body = {}; }
  const name = (body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  const product = createProduct({ ownerId: session.uid, name, price: (body.price || "").trim(), description: (body.description || "").trim(), image: body.image || null, category: body.category || "goods" });
  return NextResponse.json({ product });
});
