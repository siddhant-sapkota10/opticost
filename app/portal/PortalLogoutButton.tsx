"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PortalLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-red-500/10"
      style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.30)" }}
    >
      Sign out
    </button>
  );
}
