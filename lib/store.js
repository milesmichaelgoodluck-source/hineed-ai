// Hineed data store.
// Dependency-free persistent store. Catalog (categories/charges/providers/
// reviews) comes from seedData; everything users do (accounts, bookings,
// products, orders, messages, works, social posts, call requests) is written to
// a JSON file so it survives restarts. Local: ./data/db.json. Serverless: OS temp.
// Swap this one module for Postgres later (see DEPLOY.md) — routes only call these.

import crypto from "node:crypto";
import { CATEGORIES, CHARGES, PROVIDERS, REVIEWS, SHOPS, PRODUCTS, FOOD_SHOPS, FOOD_PRODUCTS, LISTINGS, JOBS, TALENT } from "./seedData.js";
import { dbLoad, dbSave } from "./db.js";

const g = globalThis;
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const COLLECTIONS = ["users", "bookings", "products", "orders", "messages", "works", "posts", "callRequests", "rides", "reviews", "notifications"];

function freshState() {
  const s = { otps: {} };
  COLLECTIONS.forEach((c) => (s[c] = []));
  return s;
}

function normalize(parsed) {
  const st = freshState();
  if (parsed && typeof parsed === "object") {
    COLLECTIONS.forEach((c) => { if (Array.isArray(parsed[c])) st[c] = parsed[c]; });
    st.otps = parsed.otps || {};
  }
  return st;
}

function getState() {
  if (!g.__hineedState) g.__hineedState = freshState();
  return g.__hineedState;
}

// Called by withDb() before each request: pull the latest state from the DB.
export async function loadState() {
  const data = await dbLoad();
  g.__hineedState = normalize(data);
  g.__hineedDirty = false;
  return g.__hineedState;
}

// Called by withDb() after each request: write back only if something changed.
export async function saveState() {
  if (g.__hineedDirty) {
    await dbSave(getState());
    g.__hineedDirty = false;
  }
}

function persist() {
  g.__hineedDirty = true;
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
    profile: null,        // provider profile {category, area, bio, experience, rate, active}
    shop: null,           // business shop {name, kind, bio}
    driver: null,         // driver info {vehicle, plate, online}
    photo: null,          // avatar / shop photo (data URL)
    kyc: { status: "none", doc: null }, // none | pending | verified | rejected
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
    profile: u.profile || null, shop: u.shop || null, driver: u.driver || null,
    photo: u.photo || null, kyc: u.kyc || { status: "none" },
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
const SEED_PRODUCTS = [...PRODUCTS, ...FOOD_PRODUCTS].map((p) => ({ ...p, seller: p.shop, image: null, kind: "seed", createdAt: 0 }));

export function listProducts(ownerId) {
  const all = getState().products.slice().sort(byNewest);
  if (ownerId) return all.filter((p) => p.ownerId === ownerId);
  // real seller products first, then the starter catalog
  return [...all, ...SEED_PRODUCTS];
}
export function listShops() {
  const userShops = getState().users
    .filter((u) => u.role === "business" && u.shop && u.shop.name && !u.blocked)
    .map((u) => ({ id: u.id, name: u.shop.name, kind: u.shop.kind || "", area: u.location || "", rating: 5, avatar: (u.shop.name || "S").charAt(0).toUpperCase(), color: "a2", kind2: "user" }));
  const seeded = [...SHOPS, ...FOOD_SHOPS].map((s) => ({ ...s, kind2: "seed" }));
  return [...userShops, ...seeded];
}

// ---- Real estate listings, jobs and talent (seeded catalog) ----
export function listListings() { return LISTINGS.map((l) => ({ ...l })); }
export function getListing(id) { return LISTINGS.find((l) => l.id === id) || null; }
export function listJobs() { return JOBS.map((j) => ({ ...j })); }
export function getJob(id) { return JOBS.find((j) => j.id === id) || null; }
export function listTalent() { return TALENT.map((t) => ({ ...t })); }
export function getProduct(pid) { return getState().products.find((p) => p.id === pid) || SEED_PRODUCTS.find((p) => p.id === pid) || null; }
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

// -------------------------------------------------------------- Search ----
export function search(q) {
  const ql = (q || "").toLowerCase().trim();
  if (!ql) return { products: [], shops: [], providers: [] };
  const s = getState();
  const has = (v) => (v || "").toLowerCase().includes(ql);

  const products = s.products
    .filter((p) => has(p.name) || has(p.description) || has(p.category))
    .map((p) => { const o = findUserById(p.ownerId); return { ...p, shopId: p.ownerId, shop: (o && o.shop && o.shop.name) || (o && o.name) || "Shop" }; });

  const shops = s.users
    .filter((u) => u.role === "business" && !u.blocked && (has(u.name) || has(u.shop && u.shop.name) || has(u.shop && u.shop.kind)))
    .map((u) => ({ id: u.id, name: (u.shop && u.shop.name) || u.name, kind: (u.shop && u.shop.kind) || "", bio: (u.shop && u.shop.bio) || "", location: u.location || "" }));

  // real provider-users + seeded catalog providers
  const userProviders = s.users
    .filter((u) => u.role === "provider" && !u.blocked && (has(u.name) || has(u.profile && u.profile.category) || has(u.profile && u.profile.bio)))
    .map((u) => ({
      id: u.id, name: u.name, category: (u.profile && u.profile.category) || "", bio: (u.profile && u.profile.bio) || "",
      area: (u.profile && u.profile.area) || u.location || "", active: !!(u.profile && u.profile.active),
      experience: (u.profile && u.profile.experience) || "", rate: (u.profile && u.profile.rate) || "", kind: "user",
    }));
  const seedProviders = PROVIDERS
    .filter((p) => has(p.name) || has(p.category) || has(p.bio))
    .map((p) => ({ id: p.id, name: p.name, category: p.category, bio: p.bio, area: p.area, active: true, experience: "", rate: "", kind: "seed" }));

  return { products, shops, providers: [...userProviders, ...seedProviders] };
}

// ------------------------------------------------------- Public profile ----
export function getPublicProfile(id) {
  const u = findUserById(id);
  if (u && !u.blocked) {
    const r = ratingFor(id);
    const base = { id: u.id, name: u.name, role: u.role, location: u.location || "", photo: u.photo || null,
      verified: !!(u.kyc && u.kyc.status === "verified"), rating: r.avg, reviewCount: r.count, reviews: listReviews(id) };
    if (u.role === "provider") {
      const pr = u.profile || {};
      return { ...base, category: pr.category || "", bio: pr.bio || "", area: pr.area || u.location || "",
        active: !!pr.active, experience: pr.experience || "", rate: pr.rate || "", works: listWorks(u.id) };
    }
    if (u.role === "business") {
      const sh = u.shop || {};
      return { ...base, shopName: sh.name || u.name, kind: sh.kind || "", bio: sh.bio || "", products: listProducts(u.id) };
    }
    return base;
  }
  const seed = getProvider(id);
  if (seed) { const r = ratingFor(id); return { id: seed.id, name: seed.name, role: "provider", category: seed.category, area: seed.area, bio: seed.bio, active: true, experience: "", rate: "", works: [], rating: r.avg || Number(seed.rating) || 0, reviewCount: r.count || Number(seed.reviewCount) || 0, reviews: listReviews(id), verified: true, photo: null }; }
  return null;
}

// ------------------------------------------------------ Ratings / reviews ----
export function createReview({ targetId, authorId, authorName, rating, body }) {
  const rv = { id: id(), targetId, authorId, authorName: authorName || "Customer", rating: Math.max(1, Math.min(5, Number(rating) || 5)), body: body || "", createdAt: now() };
  getState().reviews.push(rv);
  persist();
  return rv;
}
export function listReviews(targetId) {
  return getState().reviews.filter((r) => r.targetId === targetId).sort(byNewest).map((r) => ({ author: r.authorName, rating: r.rating, body: r.body, createdAt: r.createdAt }));
}
export function ratingFor(targetId) {
  const rs = getState().reviews.filter((r) => r.targetId === targetId);
  if (!rs.length) return { avg: 0, count: 0 };
  const avg = rs.reduce((a, r) => a + r.rating, 0) / rs.length;
  return { avg: Math.round(avg * 10) / 10, count: rs.length };
}

// ---------------------------------------------------------- Notifications ----
export function addNotification(userId, type, text, link) {
  if (!userId) return;
  getState().notifications.push({ id: id(), userId, type: type || "info", text: text || "", link: link || null, read: false, createdAt: now() });
  persist();
}
export function listNotifications(userId) {
  return getState().notifications.filter((n) => n.userId === userId).sort(byNewest).slice(0, 50);
}
export function notifUnread(userId) {
  return getState().notifications.filter((n) => n.userId === userId && !n.read).length;
}
export function markNotifsRead(userId) {
  let ch = false;
  getState().notifications.forEach((n) => { if (n.userId === userId && !n.read) { n.read = true; ch = true; } });
  if (ch) persist();
}

// ------------------------------------------------------------------ Rides ----
export function createRide({ riderId, riderName, pickup, dropoff, fare }) {
  const r = { id: id(), riderId, riderName: riderName || "Rider", driverId: null, driverName: null,
    pickup: pickup || "", dropoff: dropoff || "", fare: fare || "", status: "requested",
    createdAt: now(), updatedAt: now() };
  getState().rides.push(r);
  persist();
  return r;
}
export function listOpenRides() { return getState().rides.filter((r) => r.status === "requested").sort(byNewest); }
export function listRidesForDriver(driverId) { return getState().rides.filter((r) => r.driverId === driverId).sort(byNewest); }
export function listRidesForRider(riderId) { return getState().rides.filter((r) => r.riderId === riderId).sort(byNewest); }
export function getRide(rid) { return getState().rides.find((r) => r.id === rid) || null; }
export function updateRide(rid, patch) {
  const r = getRide(rid);
  if (!r) return null;
  Object.assign(r, patch, { updatedAt: now() });
  persist();
  return r;
}
export function listDrivers() {
  return getState().users.filter((u) => u.role === "rider" && !u.blocked && u.driver && u.driver.online)
    .map((u) => ({ id: u.id, name: u.name, vehicle: (u.driver && u.driver.vehicle) || "", area: u.location || "" }));
}

// ------------------------------------------------------------------- KYC ----
export function setKyc(uid, doc) {
  const u = findUserById(uid);
  if (!u) return null;
  u.kyc = { status: "pending", doc: doc || null, submittedAt: now() };
  persist();
  return u;
}
export function adminSetKyc(uid, status) {
  const u = findUserById(uid);
  if (!u) return null;
  u.kyc = { ...(u.kyc || {}), status };
  persist();
  return u;
}
export function listKycPending() {
  return getState().users.filter((u) => u.kyc && u.kyc.status === "pending")
    .map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, submittedAt: u.kyc.submittedAt }));
}

function byNewest(a, b) { return (a.createdAt < b.createdAt ? 1 : -1); }
