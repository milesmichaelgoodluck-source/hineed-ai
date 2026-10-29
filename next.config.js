/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the Postgres driver as a runtime dependency, not bundled.
  serverExternalPackages: ["pg"],
  // Serve the hand-built Hineed UI (public/index.html) at the site root,
  // while all the backend lives under /api/*. beforeFiles makes the static
  // page win at "/" regardless of any app routes.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/index.html" }],
    };
  },
};

module.exports = nextConfig;
