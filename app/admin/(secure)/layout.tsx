import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import AdminNav from "../AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" style={user ? { backgroundColor: "#F5F7FA" } : {}}>
      {user && (
        <header
          className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,22,40,0.98) 0%, rgba(14,31,58,0.98) 100%)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex items-center gap-3">
                <Link href="/" className="shrink-0">
                  <Image
                    src="/logo.png"
                    alt="OptiCost Consulting"
                    width={144}
                    height={48}
                    className="h-[38px] w-auto object-contain"
                    priority
                  />
                </Link>
                <div
                  className="hidden h-8 w-px sm:block"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                />
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ backgroundColor: "rgba(77,201,47,0.18)", color: "#82E36D" }}
                  >
                    Admin
                  </span>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                      Internal operations dashboard
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.72)" }}>
                      Manage roles, applicants, and team information.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <AdminNav />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 xl:flex-none xl:justify-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#82E36D" }}>
                  Signed in
                </p>
                <p className="break-all text-sm font-medium xl:whitespace-nowrap" style={{ color: "rgba(255,255,255,0.92)" }}>
                  {user.email}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}

      {user ? (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
