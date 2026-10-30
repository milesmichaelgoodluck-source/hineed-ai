/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the Postgres driver as a runtime dependency, not bundled.
  serverExternalPackages: ["pg", "nodemailer"],
  // Serve the hand-built Hineed UI (public/index.html) at the site root,
  // while all the backend lives under /api/*. beforeFiles makes the static
  // page win at "/" regardless of any app routes.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/index.html" }],
    };
  },
  // Always serve the freshest app shell so a refresh after a deploy shows the
  // new version immediately (no stale cached HTML on phones).
  async headers() {
    const noCache = [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }];
    return [
      { source: "/", headers: noCache },
      { source: "/index.html", headers: noCache },
    ];
  },
};

module.exports = nextConfig;
