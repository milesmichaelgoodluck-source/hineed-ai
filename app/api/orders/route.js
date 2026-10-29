import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { listOrdersForSeller, listOrdersForBuyer, createOrder, getProduct, findUserById, addNotification } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const role = new URL(req.url).searchParams.get("role");
  const list = role === "seller" ? listOrdersForSeller(session.uid) : listOrdersForBuyer(session.uid);
  return NextResponse.json({ orders: list });
});

export const POST = withDb(async (req) => {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to order." }, { status: 401 });
  const buyer = findUserById(session.uid);
  let body; try { body = await req.json(); } catch { body = {}; }
  const product = getProduct((body.productId || "").trim());
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const order = createOrder({ productId: product.id, productName: product.name, buyerId: session.uid, buyerName: buyer?.name || "Customer", sellerId: product.ownerId, qty: Number(body.qty) || 1, price: product.price, note: (body.note || "").trim() });
  addNotification(product.ownerId, "order", `${buyer?.name || "A customer"} ordered ${product.name}`, "dash");
  return NextResponse.json({ order });
});
