"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Mail,
  Trash2,
  X,
} from "lucide-react";

export type Applicant = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
  status: string;
  notes: string | null;
  archived: boolean;
};

export type JobGroup = {
  job_id: string;
  job_title: string;
  applicants: Applicant[];
};

const STATUS_OPTIONS = ["pending", "reviewed", "shortlisted", "rejected"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  pending: { bg: "rgba(26,109,181,0.10)", color: "#1A6DB5" },
  reviewed: { bg: "rgba(10,22,40,0.08)", color: "rgba(26,26,26,0.55)" },
  shortlisted: { bg: "rgba(77,201,47,0.12)", color: "#2d8a1a" },
  rejected: { bg: "rgba(220,38,38,0.09)", color: "#DC2626" },
};

type StatusFilter = "all" | "pending" | "shortlisted" | "rejected";

const STAT_CONFIG: {
  key: StatusFilter;
  label: string;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    key: "all",
    label: "Total",
    activeColor: "#0A1628",
    activeBg: "rgba(10,22,40,0.07)",
    activeBorder: "rgba(10,22,40,0.25)",
  },
  {
    key: "pending",
    label: "Pending",
    activeColor: "#1A6DB5",
    activeBg: "rgba(26,109,181,0.10)",
    activeBorder: "rgba(26,109,181,0.35)",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    activeColor: "#2d8a1a",
    activeBg: "rgba(77,201,47,0.12)",
    activeBorder: "rgba(77,201,47,0.4)",
  },
  {
    key: "rejected",
    label: "Rejected",
    activeColor: "#DC2626",
    activeBg: "rgba(220,38,38,0.08)",
    activeBorder: "rgba(220,38,38,0.3)",
  },
];

function statusStyle(s: string) {
  return STATUS_STYLES[s as Status] ?? STATUS_STYLES.pending;
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApplicantCard({
  applicant,
  jobTitle,
  busy,
  onArchive,
  onRestore,
  onDelete,
}: {
  applicant: Applicant;
  jobTitle: string;
  busy: boolean;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [status, setStatus] = useState(applicant.status || "pending");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [coverOpen, setCoverOpen] = useState(false);
  const [note, setNote] = useState(applicant.notes ?? "");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleStatusChange(next: string) {
    setStatusSaving(true);
    setStatusError(null);
    const prev = status;
    setStatus(next);

    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ status: next })
      .eq("id", applicant.id);

    if (error) {
      setStatus(prev);
      setStatusError("Failed to save.");
    }

    setStatusSaving(false);
  }

  async function handleSaveNote() {
    setNoteSaving(true);
    setNoteError(null);
    setNoteSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ notes: note || null })
      .eq("id", applicant.id);

    if (error) {
      setNoteError("Failed to save note.");
    } else {
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }

    setNoteSaving(false);
  }

  const emailSubject = encodeURIComponent(
    `Re: Your application for ${jobTitle} at OptiCost`
  );
  const mailtoHref = `mailto:${applicant.email}?subject=${emailSubject}`;
  const st = statusStyle(status);

  return (
    <div
      className="rounded-2xl border bg-white shadow-sm"
      style={{
        borderColor: applicant.archived ? "rgba(10,22,40,0.05)" : "rgba(10,22,40,0.07)",
        opacity: applicant.archived ? 0.78 : 1,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold" style={{ color: "#0A1628" }}>
              {applicant.first_name} {applicant.last_name}
            </p>
            {applicant.archived && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.06)", color: "rgba(26,26,26,0.45)" }}
              >
                Archived
              </span>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>
              {applicant.email}
            </span>
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-opacity hover:opacity-75"
              style={{ backgroundColor: "rgba(26,109,181,0.08)", color: "#1A6DB5" }}
            >
              <Mail size={10} strokeWidth={2} />
              Send Email
            </a>
          </div>

          <p className="mt-0.5 text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>
            {applicant.phone}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "rgba(26,26,26,0.35)" }}>
            Applied {formatDate(applicant.created_at)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="relative">
            <select
              value={status}
              disabled={statusSaving || applicant.archived}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none rounded-full py-1 pl-3 pr-7 text-xs font-semibold outline-none transition disabled:opacity-60"
              style={{
                backgroundColor: st.bg,
                color: st.color,
                border: "none",
                cursor: applicant.archived ? "not-allowed" : "pointer",
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke={st.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {statusError && (
            <p className="text-xs" style={{ color: "#DC2626" }}>
              {statusError}
            </p>
          )}
        </div>
      </div>

      <div
        className="border-t px-5 pb-5 pt-3"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <div className="flex flex-wrap gap-3">
          {applicant.resume_url ? (
            <a
              href={applicant.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-75"
              style={{ backgroundColor: "rgba(26,109,181,0.08)", color: "#1A6DB5" }}
            >
              <FileText size={12} />
              View Resume
              <ExternalLink size={10} />
            </a>
          ) : (
            <span className="text-xs" style={{ color: "rgba(26,26,26,0.35)" }}>
              No resume attached
            </span>
          )}

          {applicant.cover_letter && (
            <button
              onClick={() => setCoverOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-75"
              style={{
                backgroundColor: "rgba(10,22,40,0.05)",
                color: "rgba(26,26,26,0.7)",
              }}
            >
              Cover Letter
              {coverOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {coverOpen && applicant.cover_letter && (
          <div
            className="mt-3 rounded-xl p-4 whitespace-pre-wrap text-xs leading-relaxed"
            style={{
              backgroundColor: "#F8FAFC",
              color: "rgba(26,26,26,0.75)",
              border: "1px solid rgba(10,22,40,0.06)",
            }}
          >
            {applicant.cover_letter}
          </div>
        )}

        <div className="mt-4">
          <label
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "rgba(26,26,26,0.45)" }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Private Notes
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal notes about this applicant..."
            disabled={applicant.archived}
            className="w-full resize-none rounded-xl border px-3 py-2.5 text-xs leading-relaxed outline-none transition focus:ring-2 disabled:opacity-60"
            style={{
              borderColor: "rgba(10,22,40,0.10)",
              backgroundColor: "#FAFBFC",
              color: "#1A1A1A",
              // @ts-expect-error CSS custom property
              "--tw-ring-color": "rgba(26,109,181,0.12)",
            }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveNote}
              disabled={noteSaving || applicant.archived}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#0A1628" }}
            >
              {noteSaving ? "Saving..." : "Save note"}
            </button>
            {noteSaved && (
              <span className="text-xs font-medium" style={{ color: "#2d8a1a" }}>
                Saved
              </span>
            )}
            {noteError && (
              <span className="text-xs" style={{ color: "#DC2626" }}>
                {noteError}
              </span>
            )}
          </div>
        </div>

        <div
          className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4"
          style={{ borderColor: "rgba(10,22,40,0.06)" }}
        >
          {applicant.archived ? (
            confirmingDelete ? (
              <>
                <span className="text-xs font-medium" style={{ color: "rgba(26,26,26,0.55)" }}>
                  Delete permanently?
                </span>
                <button
                  onClick={() => {
                    setConfirmingDelete(false);
                    onDelete();
                  }}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "#DC2626" }}
                >
                  <Trash2 size={11} />
                  Delete
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={busy}
                  className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onRestore}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                >
                  <ArchiveRestore size={12} />
                  Restore
                </button>
                <button
                  onClick={() => setConfirmingDelete(true)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.45)" }}
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </>
            )
          ) : (
            <button
              onClick={onArchive}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.45)" }}
            >
              <Archive size={12} />
              Archive application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function JobGroup({
  group,
  busyIds,
  onArchive,
  onRestore,
  onDelete,
}: {
  group: JobGroup;
  busyIds: Set<string>;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const count = group.applicants.length;

  const statusCounts = group.applicants.reduce<Record<string, number>>((acc, a) => {
    const s = a.status || "pending";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: "rgba(10,22,40,0.07)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="min-w-0">
          <span className="text-base font-semibold" style={{ color: "#0A1628" }}>
            {group.job_title}
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([s, n]) => {
              const st = statusStyle(s);
              return (
                <span
                  key={s}
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: st.bg, color: st.color }}
                >
                  {n} {s}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: "rgba(26,109,181,0.1)", color: "#1A6DB5" }}
          >
            {count} {count === 1 ? "applicant" : "applicants"}
          </span>
          {open ? (
            <ChevronUp size={18} style={{ color: "rgba(26,26,26,0.4)" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "rgba(26,26,26,0.4)" }} />
          )}
        </div>
      </button>

      {open && (
        <div
          className="border-t px-5 pb-5 pt-4"
          style={{ borderColor: "rgba(0,0,0,0.05)", backgroundColor: "#F8FAFC" }}
        >
          <div className="space-y-3">
            {group.applicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                jobTitle={group.job_title}
                busy={busyIds.has(applicant.id)}
                onArchive={() => onArchive(applicant.id)}
                onRestore={() => onRestore(applicant.id)}
                onDelete={() => onDelete(applicant.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  active,
  onClick,
  config,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  config: (typeof STAT_CONFIG)[number];
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border px-4 py-2.5 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm"
      style={{
        borderColor: active ? config.activeBorder : "rgba(10,22,40,0.08)",
        backgroundColor: active ? config.activeBg : "white",
        minWidth: 72,
      }}
    >
      <p
        className="text-xl font-bold"
        style={{ color: active ? config.activeColor : "#0A1628" }}
      >
        {value}
      </p>
      <p
        className="text-xs font-medium"
        style={{ color: active ? config.activeColor : "rgba(26,26,26,0.5)" }}
      >
        {label}
      </p>
    </button>
  );
}

export default function ApplicationsClient({
  groups,
  filterJobId,
  filterJobTitle,
  counts,
}: {
  groups: JobGroup[];
  filterJobId: string | null;
  filterJobTitle: string | null;
  counts: { total: number; pending: number; shortlisted: number; rejected: number };
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [localGroups, setLocalGroups] = useState<JobGroup[]>(groups);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);

  function setBusyId(id: string, on: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function updateApplicant(id: string, updater: (applicant: Applicant) => Applicant) {
    setLocalGroups((prev) =>
      prev.map((group) => ({
        ...group,
        applicants: group.applicants.map((applicant) =>
          applicant.id === id ? updater(applicant) : applicant
        ),
      }))
    );
  }

  function removeApplicant(id: string) {
    setLocalGroups((prev) =>
      prev
        .map((group) => ({
          ...group,
          applicants: group.applicants.filter((applicant) => applicant.id !== id),
        }))
        .filter((group) => group.applicants.length > 0)
    );
  }

  async function handleArchive(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ archived: true })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to archive: ${error.message}`);
    } else {
      updateApplicant(id, (applicant) => ({ ...applicant, archived: true }));
      setArchivedOpen(true);
    }

    setBusyId(id, false);
  }

  async function handleRestore(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ archived: false })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to restore: ${error.message}`);
    } else {
      updateApplicant(id, (applicant) => ({ ...applicant, archived: false }));
    }

    setBusyId(id, false);
  }

  async function handleDelete(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      setActionError(`Failed to delete: ${error.message}`);
    } else {
      removeApplicant(id);
    }

    setBusyId(id, false);
  }

  const jobFiltered = filterJobId
    ? localGroups.filter((group) => group.job_id === filterJobId)
    : localGroups;

  const liveGroups = jobFiltered
    .map((group) => ({
      ...group,
      applicants: group.applicants.filter((applicant) => !applicant.archived),
    }))
    .filter((group) => group.applicants.length > 0);

  const archivedGroups = jobFiltered
    .map((group) => ({
      ...group,
      applicants: group.applicants.filter((applicant) => applicant.archived),
    }))
    .filter((group) => group.applicants.length > 0);

  const visibleGroups =
    statusFilter === "all"
      ? liveGroups
      : liveGroups
          .map((group) => ({
            ...group,
            applicants: group.applicants.filter((applicant) =>
              statusFilter === "pending"
                ? !applicant.status || applicant.status === "pending"
                : applicant.status === statusFilter
            ),
          }))
          .filter((group) => group.applicants.length > 0);

  const statValues: Record<StatusFilter, number> = {
    all: counts.total,
    pending: counts.pending,
    shortlisted: counts.shortlisted,
    rejected: counts.rejected,
  };

  const archivedCount = archivedGroups.reduce(
    (sum, group) => sum + group.applicants.length,
    0
  );

  return (
    <div>
      {actionError && (
        <div
          className="mb-3 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
        >
          {actionError}
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-3">
        {STAT_CONFIG.map((cfg) => (
          <StatCard
            key={cfg.key}
            label={cfg.label}
            value={statValues[cfg.key]}
            active={statusFilter === cfg.key}
            onClick={() => setStatusFilter(cfg.key)}
            config={cfg}
          />
        ))}
      </div>

      {filterJobId && (
        <div
          className="mb-4 flex items-center justify-between rounded-xl px-4 py-2.5"
          style={{
            backgroundColor: "rgba(26,109,181,0.07)",
            border: "1px solid rgba(26,109,181,0.2)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "#1A6DB5" }}>
            Showing applications for:{" "}
            <span className="font-bold">{filterJobTitle ?? filterJobId}</span>
          </span>
          <button
            onClick={() => router.push("/admin/applications")}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-blue-500/10"
            style={{ color: "#1A6DB5" }}
          >
            <X size={12} />
            Clear filter
          </button>
        </div>
      )}

      {visibleGroups.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed px-8 py-14 text-center"
          style={{ borderColor: "rgba(26,109,181,0.25)" }}
        >
          <p className="text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>
            {filterJobId
              ? "No active applications for this job."
              : statusFilter !== "all"
              ? `No ${statusFilter} applications.`
              : "No applications received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleGroups.map((group) => (
            <JobGroup
              key={group.job_id}
              group={group}
              busyIds={busyIds}
              onArchive={handleArchive}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {archivedCount > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setArchivedOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-100"
            style={{
              backgroundColor: "rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <Archive size={14} style={{ color: "rgba(26,26,26,0.4)" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(26,26,26,0.55)" }}>
                Archived applications
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "rgba(10,22,40,0.07)", color: "rgba(26,26,26,0.45)" }}
              >
                {archivedCount}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200"
              style={{
                transform: archivedOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "rgba(26,26,26,0.35)",
              }}
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {archivedOpen && (
            <div className="mt-3 space-y-3">
              {archivedGroups.map((group) => (
                <JobGroup
                  key={group.job_id}
                  group={group}
                  busyIds={busyIds}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
