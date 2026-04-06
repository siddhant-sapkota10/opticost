import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Try to get the current user for the header — proxy.ts handles the redirect
  // so by the time we render here the user is guaranteed to be authenticated
  // (except on /admin/login which has its own layout-free page).
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" style={user ? { backgroundColor: "#F5F7FA" } : {}}>
      {/* Top bar — hidden on the login page (user will be null) */}
      {user && (
        <header
          className="sticky top-0 z-50 flex h-14 items-center justify-between border-b px-6"
          style={{ backgroundColor: "#0A1628", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className="rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: "rgba(77,201,47,0.18)", color: "#4DC92F" }}
              >
                Admin
              </span>
              <span className="hidden text-sm font-semibold text-white sm:block">OptiCost</span>
            </div>
            <AdminNav />
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs sm:block" style={{ color: "rgba(255,255,255,0.45)" }}>
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </header>
      )}

      {user ? (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
