/**
 * Derives the absolute base URL from the incoming Next.js request so that
 * auth redirect URLs work on any host — localhost, LAN IP, or production.
 *
 * Priority:
 *  1. x-forwarded-host  (set by reverse proxies / Vercel)
 *  2. host header       (direct access, e.g. 192.168.86.23:3000)
 *  3. NEXT_PUBLIC_SITE_URL env var (production fallback)
 */
export function getBaseUrl(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-host");
  const host = forwarded ?? request.headers.get("host");

  if (host) {
    const proto = request.headers.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
  }

  // Last-resort: env var (set in production, e.g. https://opticost.com.au)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "http://localhost:3000";
}
