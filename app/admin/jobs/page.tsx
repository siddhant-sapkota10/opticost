import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeOnly = filter === "active";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, description, location, employment_type, work_arrangement, start_date, security_clearance, active, archived, applications(count)")
    .order("title");

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold" style={{ color: "#0A1628" }}>
          Job Listings
        </h1>
        <p className="text-sm" style={{ color: "#DC2626" }}>
          Error loading jobs: {error.message}
        </p>
      </div>
    );
  }

  const normalised = (jobs ?? []).map((j) => ({
    id: j.id as string,
    title: j.title as string,
    description: (j.description as string) ?? "",
    location: (j.location as string) ?? "",
    employment_type: (j.employment_type as string) ?? "",
    work_arrangement: (j.work_arrangement as string) ?? "",
    start_date: (j.start_date as string) ?? "",
    security_clearance: (j.security_clearance as string) ?? "",
    active: j.active as boolean,
    archived: (j.archived as boolean) ?? false,
    application_count: Array.isArray(j.applications)
      ? (j.applications[0] as { count: number } | undefined)?.count ?? 0
      : 0,
  }));

  const activeCount = normalised.filter((j) => j.active && !j.archived).length;
  const totalApplications = normalised.reduce((sum, j) => sum + j.application_count, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0A1628" }}>
            Job Listings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>
            Manage which roles appear on the public careers page.
          </p>
        </div>

        <div className="flex gap-4">
          <Stat label="Total listings" value={normalised.length} />
          <Stat
            label="Active"
            value={activeCount}
            accent
            href={activeOnly ? "/admin/jobs" : "/admin/jobs?filter=active"}
            selected={activeOnly}
          />
          <Stat
            label="Applications"
            value={totalApplications}
            href="/admin/applications"
          />
        </div>
      </div>

      <JobsClient initialJobs={normalised} activeOnly={activeOnly} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
  href,
  selected = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
  href?: string;
  selected?: boolean;
}) {
  const inner = (
    <>
      <p
        className="text-xl font-bold"
        style={{ color: accent ? "#2d8a1a" : "#0A1628" }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
        {label}
      </p>
    </>
  );

  const baseStyle: React.CSSProperties = {
    borderColor: selected
      ? "#4DC92F"
      : accent
      ? "rgba(77,201,47,0.3)"
      : "rgba(10,22,40,0.08)",
    backgroundColor: selected
      ? "rgba(77,201,47,0.14)"
      : accent
      ? "rgba(77,201,47,0.06)"
      : "white",
  };

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl border px-4 py-2.5 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm"
        style={baseStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border px-4 py-2.5 text-center" style={baseStyle}>
      {inner}
    </div>
  );
}
