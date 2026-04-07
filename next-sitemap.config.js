const publicPaths = new Set([
  "/",
  "/about",
  "/services",
  "/contact",
  "/careers",
  "/people",
]);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://opticost.com.au",
  generateRobotsTxt: true,
  exclude: [
    "/login",
    "/admin",
    "/admin/*",
    "/admin/**",
    "/admin/login",
    "/admin/mfa",
    "/portal",
    "/portal/*",
    "/portal/**",
    "/portal/mfa",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/admin", "/admin/*", "/portal", "/portal/*"],
      },
    ],
  },
  transform: async (_, path) => {
    if (!publicPaths.has(path)) {
      return null;
    }

    return {
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async () =>
    Array.from(publicPaths).map((path) => ({
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })),
};
