import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";

  // Unauthenticated user hitting any /admin/* route → send to login
  if (!isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Already authenticated user hitting /admin/login → send to dashboard
  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin/jobs", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
