import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import PeopleClient from "../../people/PeopleClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "People",
};

export default async function AdminPeoplePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: people, error } = await supabase
    .from("people")
    .select("id, name, role, bio, email, phone, linkedin_url, photo_url, display_order, active")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold" style={{ color: "#0A1628" }}>
          People
        </h1>
        <p className="text-sm" style={{ color: "#DC2626" }}>
          Error loading people: {error.message}
        </p>
      </div>
    );
  }

  const normalised = (people ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    role: (p.role as string) ?? "",
    bio: (p.bio as string) ?? "",
    email: (p.email as string) ?? "",
    phone: (p.phone as string) ?? "",
    linkedin_url: (p.linkedin_url as string) ?? "",
    photo_url: (p.photo_url as string) ?? "",
    display_order: (p.display_order as number) ?? 0,
    active: (p.active as boolean) ?? true,
  }));

  const activeCount = normalised.filter((p) => p.active).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0A1628" }}>
            People
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>
            Manage the team members shown on the public People page.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="rounded-xl border px-4 py-2.5 text-center" style={{ borderColor: "rgba(10,22,40,0.08)", backgroundColor: "white" }}>
            <p className="text-xl font-bold" style={{ color: "#0A1628" }}>{normalised.length}</p>
            <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>Total</p>
          </div>
          <div className="rounded-xl border px-4 py-2.5 text-center" style={{ borderColor: "rgba(77,201,47,0.3)", backgroundColor: "rgba(77,201,47,0.06)" }}>
            <p className="text-xl font-bold" style={{ color: "#2d8a1a" }}>{activeCount}</p>
            <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>Active</p>
          </div>
        </div>
      </div>

      <PeopleClient initialPeople={normalised} />
    </div>
  );
}
