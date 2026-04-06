import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PortalLogoutButton from "./PortalLogoutButton";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Applicant";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between border-b px-6"
        style={{ backgroundColor: "#0A1628", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="OptiCost Consulting"
              width={140}
              height={47}
              className="h-[36px] w-auto object-contain"
            />
          </Link>
          <div
            className="hidden h-5 w-px sm:block"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          />
          <span
            className="hidden rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest sm:block"
            style={{ backgroundColor: "rgba(77,201,47,0.18)", color: "#4DC92F" }}
          >
            My Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs sm:block" style={{ color: "rgba(255,255,255,0.45)" }}>
            {displayName}
          </span>
          <PortalLogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
