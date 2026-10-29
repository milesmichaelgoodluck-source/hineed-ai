// Hineed data store.
// Dependency-free persistent store. Catalog (categories/charges/providers/
// reviews) comes from seedData; everything users do (accounts, bookings,
// products, orders, messages, works, social posts, call requests) is written to
// a JSON file so it survives restarts. Local: ./data/db.json. Serverless: OS temp.
// Swap this one module for Postgres later (see DEPLOY.md) — routes only call these.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { CATEGORIES, CHARGES, PROVIDERS, REVIEWS } from "./seedData.js";

function dataFilePath() {
  if (process.env.HINEED_DATA_FILE) return process.env.HINEED_DATA_FILE;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "hineed-db.json");
  }
  return path.join(process.cwd(), "data", "db.json");
}

const g = globalThis;
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const COLLECTIONS = ["users", "bookings", "products", "orders", "messages", "works", "posts", "callRequests"];

function freshState() {
  const s = { otps: {} };
  COLLECTIONS.forEach((c) => (s[c] = []));
  return s;
}

function load() {
  const file = dataFilePath();
  let st = freshState();
  try {
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      COLLECTIONS.forEach((c) => (st[c] = Array.isArray(parsed[c]) ? parsed[c] : []));
      st.otps = parsed.otps || {};
    }
  } catch {
    st = freshState();
  }
  return st;
}

function getState() {
  if (!g.__hineedState) g.__hineedState = load();
  return g.__hineedState;
}

function persist() {
  const file = dataFilePath();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(getState(), null, 2));
  } catch {
    /* read-only FS: lives in memory for this instance */
  }
}

// ---------------------------------------------------------------- Catalog ----
export function listCategories() {
  return CATEGORIES.map((c, i) => ({ id: c.id, label: c.label, sort: i }));
}
export function chargesByCategory() {
  const out = {};
  for (const catId of Object.keys(CHARGES)) out[catId] = CHARGES[catId].map((r) => [r[0], r[1]]);
  return out;
}
export function listProviders() {
  // seeded catalog providers + real provider-users who published a profile
  const seeded = PROVIDERS.map((p) => ({ ...p, blocked: false, kind: "seed" }));
  const userProviders = getState().users
    .filter((u) => u.role === "provider" && u.profile && u.profile.category && !u.blocked)
    .map((u) => ({
      id: u.id, name: u.name, category: u.profile.category,
      area: u.profile.area || (u.location || ""), rating: u.profile.rating || 5,
      reviewCount: u.profile.reviewCount || 0, bio: u.profile.bio || "",
      blocked: false, kind: "user",
    }));
  return [...userProviders, ...seeded];
}
export function getProvider(pid) {
  const seed = PROVIDERS.find((x) => x.id === pid);
  if (seed) return { ...seed, blocked: false, kind: "seed" };
  const u = getState().users.find((x) => x.id === pid && x.role === "provider");
  if (u) return {
    id: u.id, name: u.name, category: (u.profile && u.profile.category) || "service",
    area: (u.profile && u.profile.area) || u.location || "", rating: (u.profile && u.profile.rating) || 5,
    reviewCount: (u.profile && u.profile.reviewCount) || 0, bio: (u.profile && u.profile.bio) || "",
    blocked: !!u.blocked, kind: "user",
  };
  return null;
}
export function sampleReviews() {
  return REVIEWS.map((r) => ({ author: r.author, rating: r.rating, body: r.body }));
}

// ------------------------------------------------------------------ Users ----
export function findUserByEmail(email) {
  return getState().users.find((u) => u.email === email) || null;
}
export function findUserById(uid) {
  return getState().users.find((u) => u.id === uid) || null;
}
export function createUser({ name, email, phone, dob, role, location, passwordHash, provider: isProvider }) {
  const user = {
    id: id(), name, email, phone: phone || null, dob: dob || null,
    role: role || "customer", location: location || null,
    passwordHash, verified: false, blocked: false,
    profile: null,        // provider profile {category, area, bio, rating, reviewCount}
    shop: null,           // business shop {name, kind, bio}
    provider: isProvider || "email", // auth provider: email | google | apple | facebook
    createdAt: now(),
  };
  getState().users.push(user);
  persist();
  return user;
}
export function updateUser(uid, patch) {
  const u = findUserById(uid);
  if (!u) return null;
  Object.assign(u, patch);
  persist();
  return u;
}
export function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id, name: u.name, email: u.email, phone: u.phone, dob: u.dob,
    role: u.role, location: u.location, verified: u.verified,
    profile: u.profile || null, shop: u.shop || null,
  };
}

// --------------------------------------------- Email verification codes ----
export function setOtp(email, code) {
  const s = getState();
  if (!s.otps) s.otps = {};
  s.otps[email] = { code: String(code), expires: Date.now() + 10 * 60 * 1000 };
  persist();
}
export function getOtp(email) { return (getState().otps || {})[email] || null; }
export function clearOtp(email) { if (getState().otps) delete getState().otps[email]; persist(); }
export function markVerifiedByEmail(email) {
  const u = findUserByEmail(email);
  if (u) { u.verified = true; persist(); }
  return u;
}

// --------------------------------------------------------------- Bookings ----
export function createBooking({ userId, providerId, providerName, service, price }) {
  const b = {
    id: id(), userId, providerId, providerName: providerName || "", service, price,
    status: "held", createdAt: now(), updatedAt: now(),
  };
  getState().bookings.push(b);
  persist();
  return b;
}
export function listBookings(userId) {
  return getState().bookings.filter((b) => b.userId === userId).sort(byNewest);
}
export function listBookingsForProvider(providerId) {
  return getState().bookings.filter((b) => b.providerId === providerId).sort(byNewest);
}
export function getBooking(bid) { return getState().bookings.find((b) => b.id === bid) || null; }
export function updateBookingStatus(bid, status) {
  const b = getBooking(bid);
  if (!b) return null;
  b.status = status; b.updatedAt = now(); persist();
  return b;
}

// ---------------------------------------------------------------- Products ----
export function createProduct({ ownerId, name, price, description, image, category }) {
  const p = { id: id(), ownerId, name, price: price || "", description: description || "", image: image || null, category: category || "goods", createdAt: now() };
  getState().products.push(p);
  persist();
  return p;
}
export function listProducts(ownerId) {
  const all = getState().products.slice().sort(byNewest);
  return ownerId ? all.filter((p) => p.ownerId === ownerId) : all;
}
export function getProduct(pid) { return getState().products.find((p) => p.id === pid) || null; }
export function deleteProduct(pid, ownerId) {
  const s = getState();
  const i = s.products.findIndex((p) => p.id === pid && p.ownerId === ownerId);
  if (i < 0) return false;
  s.products.splice(i, 1); persist(); return true;
}

// ------------------------------------------------------------------ Orders ----
export function createOrder({ productId, productName, buyerId, buyerName, sellerId, qty, price, note }) {
  const o = {
    id: id(), productId, productName: productName || "", buyerId, buyerName: buyerName || "",
    sellerId, qty: qty || 1, price: price || "", note: note || "",
    status: "placed", createdAt: now(), updatedAt: now(),
  };
  getState().orders.push(o);
  persist();
  return o;
}
export function listOrdersForSeller(sellerId) {
  return getState().orders.filter((o) => o.sellerId === sellerId).sort(byNewest);
}
export function listOrdersForBuyer(buyerId) {
  return getState().orders.filter((o) => o.buyerId === buyerId).sort(byNewest);
}
export function updateOrderStatus(oid, status, sellerId) {
  const o = getState().orders.find((x) => x.id === oid);
  if (!o || (sellerId && o.sellerId !== sellerId)) return null;
  o.status = status; o.updatedAt = now(); persist();
  return o;
}

// ---------------------------------------------------------------- Messages ----
export function sendMessage({ fromId, fromName, toId, body }) {
  const m = { id: id(), fromId, fromName: fromName || "", toId, body, read: false, createdAt: now() };
  getState().messages.push(m);
  persist();
  return m;
}
export function listConversation(aId, bId) {
  return getState().messages
    .filter((m) => (m.fromId === aId && m.toId === bId) || (m.fromId === bId && m.toId === aId))
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}
export function listThreads(userId) {
  const msgs = getState().messages.filter((m) => m.fromId === userId || m.toId === userId);
  const byOther = {};
  msgs.forEach((m) => {
    const other = m.fromId === userId ? m.toId : m.fromId;
    const otherName = m.fromId === userId ? "" : m.fromName;
    if (!byOther[other]) byOther[other] = { otherId: other, otherName: "", last: null, unread: 0 };
    if (otherName) byOther[other].otherName = otherName;
    if (!byOther[other].last || byOther[other].last.createdAt < m.createdAt) byOther[other].last = m;
    if (m.toId === userId && !m.read) byOther[other].unread++;
  });
  return Object.values(byOther)
    .map((t) => {
      const u = findUserById(t.otherId);
      return { ...t, otherName: t.otherName || (u ? u.name : "User") };
    })
    .sort((a, b) => ((a.last?.createdAt || "") < (b.last?.createdAt || "") ? 1 : -1));
}
export function markRead(userId, otherId) {
  let changed = false;
  getState().messages.forEach((m) => {
    if (m.toId === userId && m.fromId === otherId && !m.read) { m.read = true; changed = true; }
  });
  if (changed) persist();
}

// ------------------------------------------------------------------- Works ----
export function createWork({ ownerId, ownerName, title, description, image, category }) {
  const w = { id: id(), ownerId, ownerName: ownerName || "", title, description: description || "", image: image || null, category: category || "", createdAt: now() };
  getState().works.push(w);
  persist();
  return w;
}
export function listWorks(ownerId) {
  const all = getState().works.slice().sort(byNewest);
  return ownerId ? all.filter((w) => w.ownerId === ownerId) : all;
}

// ------------------------------------------------------------- Social posts ----
export function createPost({ authorId, authorName, text, image }) {
  const p = { id: id(), authorId, authorName: authorName || "", text, image: image || null, likes: [], comments: [], createdAt: now() };
  getState().posts.push(p);
  persist();
  return p;
}
export function listPosts() { return getState().posts.slice().sort(byNewest); }
export function toggleLike(postId, userId) {
  const p = getState().posts.find((x) => x.id === postId);
  if (!p) return null;
  const i = p.likes.indexOf(userId);
  if (i >= 0) p.likes.splice(i, 1); else p.likes.push(userId);
  persist();
  return p;
}
export function addComment(postId, authorId, authorName, text) {
  const p = getState().posts.find((x) => x.id === postId);
  if (!p) return null;
  p.comments.push({ id: id(), authorId, authorName: authorName || "", text, createdAt: now() });
  persist();
  return p;
}

// ------------------------------------------------------------ Call requests ----
export function createCallRequest({ fromId, fromName, toId }) {
  const c = { id: id(), fromId, fromName: fromName || "", toId, status: "requested", createdAt: now() };
  getState().callRequests.push(c);
  persist();
  return c;
}
export function listCallRequests(toId) {
  return getState().callRequests.filter((c) => c.toId === toId).sort(byNewest);
}

// ------------------------------------------------------------------- Admin ----
export function adminStats() {
  const s = getState();
  return {
    users: s.users.length,
    providers: s.users.filter((u) => u.role === "provider").length,
    businesses: s.users.filter((u) => u.role === "business").length,
    bookings: s.bookings.length,
    orders: s.orders.length,
    products: s.products.length,
    posts: s.posts.length,
  };
}
export function adminListUsers() {
  return getState().users.slice().sort(byNewest).map((u) => ({
    id: u.id, name: u.name, email: u.email, role: u.role,
    location: u.location, verified: u.verified, blocked: !!u.blocked, createdAt: u.createdAt,
  }));
}
export function adminSetBlocked(uid, blocked) {
  const u = findUserById(uid);
  if (!u) return null;
  u.blocked = !!blocked; persist();
  return u;
}
export function adminDeleteUser(uid) {
  const s = getState();
  const i = s.users.findIndex((u) => u.id === uid);
  if (i < 0) return false;
  s.users.splice(i, 1); persist(); return true;
}

function byNewest(a, b) { return (a.createdAt < b.createdAt ? 1 : -1); }
