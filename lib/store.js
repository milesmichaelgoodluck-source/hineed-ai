// Hineed data store.
// A small, dependency-free persistent store: the catalog (categories, charges,
// providers, reviews) comes from seedData; users and bookings are written to a
// JSON file so they survive restarts. Locally that file is ./data/db.json; on a
// serverless host it falls back to the OS temp dir.
//
// This is deliberately simple so it runs anywhere with no database to provision.
// When you outgrow it, swap this module for a Postgres-backed one (see DEPLOY.md)
// — every route only talks to the methods below, nothing else changes.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { CATEGORIES, CHARGES, PROVIDERS, REVIEWS } from "./seedData.js";

function dataFilePath() {
  if (process.env.HINEED_DATA_FILE) return process.env.HINEED_DATA_FILE;
  // Vercel / most serverless hosts only allow writes under the temp dir.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "hineed-db.json");
  }
  return path.join(process.cwd(), "data", "db.json");
}

const g = globalThis;

function freshState() {
  return { users: [], bookings: [], otps: {} };
}

function load() {
  const file = dataFilePath();
  let dynamic = freshState();
  try {
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      dynamic = { users: parsed.users || [], bookings: parsed.bookings || [], otps: parsed.otps || {} };
    }
  } catch {
    dynamic = freshState();
  }
  return dynamic;
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
    // On a read-only FS the data simply lives in memory for this instance.
  }
}

const id = () => crypto.randomUUID();

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
  return PROVIDERS.map((p) => ({ ...p, blocked: false }));
}

export function getProvider(pid) {
  const p = PROVIDERS.find((x) => x.id === pid);
  return p ? { ...p, blocked: false } : null;
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

export function createUser({ name, email, phone, dob, role, passwordHash }) {
  const user = {
    id: id(), name, email, phone: phone || null, dob: dob || null,
    role: role || "customer", passwordHash, verified: false,
    createdAt: new Date().toISOString(),
  };
  getState().users.push(user);
  persist();
  return user;
}

// ----------------------------------------------- Email verification codes ----
export function setOtp(email, code) {
  const s = getState();
  if (!s.otps) s.otps = {};
  s.otps[email] = { code: String(code), expires: Date.now() + 10 * 60 * 1000 };
  persist();
}

export function getOtp(email) {
  return (getState().otps || {})[email] || null;
}

export function clearOtp(email) {
  if (getState().otps) delete getState().otps[email];
  persist();
}

export function markVerifiedByEmail(email) {
  const u = findUserByEmail(email);
  if (u) { u.verified = true; persist(); }
  return u;
}

export function updateUser(uid, patch) {
  const u = findUserById(uid);
  if (!u) return null;
  Object.assign(u, patch);
  persist();
  return u;
}

// --------------------------------------------------------------- Bookings ----
export function createBooking({ userId, providerId, service, price }) {
  const booking = {
    id: id(), userId, providerId, service, price,
    status: "held", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  getState().bookings.push(booking);
  persist();
  return booking;
}

export function listBookings(userId) {
  return getState().bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getBooking(bid) {
  return getState().bookings.find((b) => b.id === bid) || null;
}

export function updateBookingStatus(bid, status) {
  const b = getBooking(bid);
  if (!b) return null;
  b.status = status;
  b.updatedAt = new Date().toISOString();
  persist();
  return b;
}
