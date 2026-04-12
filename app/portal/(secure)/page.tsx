import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "My Applications",
};

type Application = {
  id: string;
  job_title: string;
  created_at: string;
  status: string;
  archived: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  pending: {
    label: "Pending Review",
    bg: "rgba(234,179,8,0.12)",
    color: "rgba(253,224,71,0.9)",
    dot: "#FBBF24",
  },
  reviewed: {
    label: "Under Review",
    bg: "rgba(59,130,246,0.12)",
    color: "rgba(147,197,253,0.9)",
    dot: "#60A5FA",
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "rgba(77,201,47,0.12)",
    color: "rgba(134,239,172,0.9)",
    dot: "#4DC92F",
  },
  rejected: {
    label: "Not Progressing",
    bg: "rgba(239,68,68,0.10)",
    color: "rgba(252,165,165,0.9)",
    dot: "#F87171",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)",
    dot: "rgba(255,255,255,0.4)",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PortalPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, job_title, created_at, status, archived")
    .eq("email", user!.email)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  const apps: Application[] = applications ?? [];
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "#0A1628" }}
        >
          Hi, {displayName}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(10,22,40,0.55)" }}>
          Track the status of your OptiCost job applications below.
        </p>
      </div>

      {apps.length === 0 ? (
        <div
          className="flex flex-col items-center rounded-2xl px-5 py-12 text-center sm:px-8 sm:py-16"
          style={{
            backgroundColor: "#fff",
            border: "1px solid rgba(10,22,40,0.08)",
          }}
        >
          <div
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(77,201,47,0.10)" }}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4DC92F"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2
            className="mb-2 text-base font-bold"
            style={{ color: "#0A1628" }}
          >
            No applications yet
          </h2>
          <p className="mb-6 max-w-xs text-sm" style={{ color: "rgba(10,22,40,0.5)" }}>
            When you apply for a role at OptiCost, your applications will appear
            here so you can track their progress.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: "#4DC92F", boxShadow: "0 4px 20px rgba(77,201,47,0.25)" }}
          >
            View Open Roles
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl px-4 py-4 transition-shadow duration-200 hover:shadow-md sm:px-6 sm:py-5"
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgba(10,22,40,0.08)",
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ color: "#0A1628" }}
                  >
                    {app.job_title}
                  </h3>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "rgba(10,22,40,0.45)" }}
                  >
                    Applied {formatDate(app.created_at)}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs" style={{ color: "rgba(10,22,40,0.35)" }}>
        Not seeing your application?{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:opacity-80">
          Contact us
        </Link>{" "}
        and we&apos;ll help.
      </p>
    </div>
  );
}
