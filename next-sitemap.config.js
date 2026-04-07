/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://opticost.com.au",
  generateRobotsTxt: true,
  exclude: ["/login", "/admin/*", "/admin/login"],
};
