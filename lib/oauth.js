// OAuth provider configs. A provider is "configured" only when its client id
// and secret are present as environment variables — set them on the host and
// "Continue with Google / Facebook" start working, with no code change.
//
// Required redirect URI to register with each provider:
//   https://YOUR-DOMAIN/api/auth/oauth/callback?provider=google
//   https://YOUR-DOMAIN/api/auth/oauth/callback?provider=facebook

export const PROVIDERS = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "openid email profile",
    idEnv: "GOOGLE_CLIENT_ID",
    secretEnv: "GOOGLE_CLIENT_SECRET",
    parseUser: (u) => ({ email: (u.email || "").toLowerCase(), name: u.name || u.given_name || "User" }),
  },
  facebook: {
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
    userUrl: "https://graph.facebook.com/me?fields=id,name,email",
    scope: "email public_profile",
    idEnv: "FACEBOOK_CLIENT_ID",
    secretEnv: "FACEBOOK_CLIENT_SECRET",
    parseUser: (u) => ({ email: (u.email || "").toLowerCase(), name: u.name || "User" }),
  },
  // Apple uses a different (JWT-based) flow; left for a later stage.
};

export function isConfigured(provider) {
  const p = PROVIDERS[provider];
  return !!(p && process.env[p.idEnv] && process.env[p.secretEnv]);
}

export function callbackUrl(origin, provider) {
  return `${origin}/api/auth/oauth/callback?provider=${provider}`;
}
