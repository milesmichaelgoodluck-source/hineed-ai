import crypto from "node:crypto";

const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
export const COOKIE_NAME = "hineed_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ---- Passwords (scrypt, no native deps so it builds cleanly on Vercel) ----
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(pw), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const test = crypto.scryptSync(String(pw), salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---- Sessions (signed cookie: base64url(payload).HMAC) ----
export function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expect = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}

export function sessionFromRequest(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

// The session carries basic identity so a signed-in user stays logged in across
// refreshes even if the server's memory was recycled (before a database is added).
export function tokenForUser(u) {
  return signSession({ uid: u.id, n: u.name, e: u.email, r: u.role });
}
export function userFromSession(s) {
  if (!s || !s.uid) return null;
  return {
    id: s.uid, name: s.n || "", email: s.e || "", role: s.r || "customer",
    phone: null, dob: null, location: null, verified: true, profile: null, shop: null,
  };
}

// ---- Admin (owner-only) ----
// Defaults can be overridden on the host with ADMIN_USERNAME / ADMIN_PASSWORD.
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "hineed.admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Hineed@Admin#2026";
export const ADMIN_COOKIE = "hineed_admin";

export function checkAdmin(username, password) {
  return String(username) === ADMIN_USERNAME && String(password) === ADMIN_PASSWORD;
}
export function isAdminRequest(req) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const s = verifySession(token);
  return !!(s && s.admin === true);
}
