/** @type {import('next').NextConfig} */
const nextConfig = {
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
