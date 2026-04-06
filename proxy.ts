import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, claims } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isUser = user?.user_metadata?.role === "user";
  const isAdmin = Boolean(user) && !isUser;
  const isAdminMfaPath = pathname.startsWith("/admin/mfa");
  const isPortalMfaPath = pathname.startsWith("/portal/mfa");
  const hasAdminMfa = claims?.aal === "aal2";
  const hasUserMfa = claims?.aal === "aal2";

  // Helper: redirect based on role
  function roleRedirect() {
    return NextResponse.redirect(
      new URL(
        isUser ? (hasUserMfa ? "/portal" : "/portal/mfa") : hasAdminMfa ? "/admin/jobs" : "/admin/mfa",
        request.url
      )
    );
  }

  // ── /login — universal sign-in/sign-up page ──────────────────────────────
  if (pathname === "/login") {
    if (user) return roleRedirect();
    return supabaseResponse;
  }

  // ── /admin/login — legacy route: redirect to universal login ─────────────
  if (pathname === "/admin/login") {
    if (user) return roleRedirect();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── /portal/* — requires any authenticated user ───────────────────────────
  if (pathname.startsWith("/portal")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isUser && !hasUserMfa && !isPortalMfaPath) {
      return NextResponse.redirect(new URL("/portal/mfa", request.url));
    }
    if (isUser && hasUserMfa && isPortalMfaPath) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    if (!isUser) {
      return NextResponse.redirect(new URL(hasAdminMfa ? "/admin/jobs" : "/admin/mfa", request.url));
    }
    return supabaseResponse;
  }

  // ── /admin/* — requires an admin (non-user) account ──────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isUser) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    if (isAdmin && !hasAdminMfa && !isAdminMfaPath) {
      return NextResponse.redirect(new URL("/admin/mfa", request.url));
    }
    if (isAdmin && hasAdminMfa && isAdminMfaPath) {
      return NextResponse.redirect(new URL("/admin/jobs", request.url));
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/portal/:path*"],
};
