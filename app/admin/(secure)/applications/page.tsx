import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import ApplicationsClient, { type JobGroup } from "../../applications/ApplicationsClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Applications",
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const { job: filterJobId } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, job_id, job_title, first_name, last_name, email, phone, cover_letter, resume_url, created_at, status, notes, archived"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold" style={{ color: "#0A1628" }}>
          Applications
        </h1>
        <p className="text-sm" style={{ color: "#DC2626" }}>
          Error loading applications: {error.message}
        </p>
      </div>
    );
  }

  const applications = data ?? [];

  const groupMap = new Map<string, JobGroup>();
  for (const app of applications) {
    const key = app.job_id as string;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        job_id: key,
        job_title: app.job_title as string,
        applicants: [],
      });
    }
    groupMap.get(key)!.applicants.push({
      id: app.id as string,
      first_name: app.first_name as string,
      last_name: app.last_name as string,
      email: app.email as string,
      phone: app.phone as string,
      cover_letter: app.cover_letter as string | null,
      resume_url: app.resume_url as string | null,
      created_at: app.created_at as string,
      status: (app.status as string) ?? "pending",
      notes: (app.notes as string | null) ?? null,
      archived: Boolean(app.archived),
    });
  }

  const groups = Array.from(groupMap.values()).sort((a, b) =>
    a.job_title.localeCompare(b.job_title)
  );

  const filterJobTitle = filterJobId
    ? (groupMap.get(filterJobId)?.job_title ?? null)
    : null;

  const activeApplications = applications.filter((app) => !app.archived);

  const counts = {
    total: activeApplications.length,
    pending: activeApplications.filter((app) => !app.status || app.status === "pending").length,
    shortlisted: activeApplications.filter((app) => app.status === "shortlisted").length,
    rejected: activeApplications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0A1628" }}>
          Applications
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>
          Review and update the status of each applicant.
        </p>
      </div>

      <ApplicationsClient
        groups={groups}
        filterJobId={filterJobId ?? null}
        filterJobTitle={filterJobTitle}
        counts={counts}
      />
    </div>
  );
}
