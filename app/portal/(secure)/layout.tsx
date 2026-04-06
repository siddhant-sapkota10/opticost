import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PortalLogoutButton from "../PortalLogoutButton";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Applicant";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      <header
        className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
        style={{
          background: "linear-gradient(135deg, rgba(10,22,40,0.98) 0%, rgba(14,31,58,0.98) 100%)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="OptiCost Consulting"
                width={144}
                height={48}
                className="h-[34px] w-auto object-contain sm:h-[38px]"
              />
            </Link>
            <div
              className="hidden h-6 w-px sm:block"
              style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
            />
            <span
              className="hidden rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest sm:block"
              style={{ backgroundColor: "rgba(77,201,47,0.18)", color: "#4DC92F" }}
            >
              My Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#82E36D" }}>
                Signed in
              </p>
              <p className="break-all text-sm font-medium md:break-normal" style={{ color: "rgba(255,255,255,0.86)" }}>
                {displayName}
              </p>
            </div>
            <PortalLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}
