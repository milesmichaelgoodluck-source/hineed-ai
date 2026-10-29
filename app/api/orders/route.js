import { NextResponse } from "next/server";
import { listOrdersForSeller, listOrdersForBuyer, createOrder, getProduct, findUserById } from "@/lib/store";
import { sessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/orders?role=seller  -> orders TO me (business)
// GET /api/orders (default buyer) -> my orders
export async function GET(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const role = new URL(req.url).searchParams.get("role");
  const list = role === "seller" ? listOrdersForSeller(session.uid) : listOrdersForBuyer(session.uid);
  return NextResponse.json({ orders: list });
}

// A customer places an order for a product.
export async function POST(req) {
  const session = sessionFromRequest(req);
  if (!session?.uid) return NextResponse.json({ error: "Sign in to order." }, { status: 401 });
  const buyer = findUserById(session.uid);

  let body;
  try { body = await req.json(); } catch { body = {}; }
  const product = getProduct((body.productId || "").trim());
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  const order = createOrder({
    productId: product.id, productName: product.name,
    buyerId: session.uid, buyerName: buyer?.name || "Customer",
    sellerId: product.ownerId, qty: Number(body.qty) || 1,
    price: product.price, note: (body.note || "").trim(),
  });
  return NextResponse.json({ order });
}
