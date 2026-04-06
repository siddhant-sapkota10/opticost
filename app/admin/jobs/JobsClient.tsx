"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Archive, ArchiveRestore, Pencil, Plus, X } from "lucide-react";

export type JobRow = {
  id: string;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  work_arrangement: string;
  start_date: string;
  security_clearance: string;
  active: boolean;
  archived: boolean;
  application_count: number;
};

// ─── Dropdown options ─────────────────────────────────────────────────────────

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract", "Casual"];
const WORK_ARRANGEMENTS = ["On Site", "Remote", "Hybrid"];
const CLEARANCE_LEVELS = ["None", "Baseline", "NV1", "NV2", "PV"];

// ─── Shared field wrapper ─────────────────────────────────────────────────────

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "rgba(26,26,26,0.55)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#4DC92F" }}>
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  borderColor: "rgba(10,22,40,0.12)",
  color: "#1A1A1A",
};

const inputClass =
  "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-[#1A6DB5] focus:ring-2 focus:ring-[#1A6DB5]/10 bg-white";

// ─── Job form modal ───────────────────────────────────────────────────────────

type ModalMode = { kind: "add" } | { kind: "edit"; job: JobRow };

function JobModal({
  mode,
  onClose,
  onSaved,
}: {
  mode: ModalMode;
  onClose: () => void;
  onSaved: (job: JobRow) => void;
}) {
  const isEdit = mode.kind === "edit";
  const src = isEdit ? mode.job : null;

  const [title, setTitle] = useState(src?.title ?? "");
  const [description, setDescription] = useState(src?.description ?? "");
  const [location, setLocation] = useState(src?.location ?? "");
  const [employmentType, setEmploymentType] = useState(src?.employment_type ?? "");
  const [workArrangement, setWorkArrangement] = useState(src?.work_arrangement ?? "");
  const [startDate, setStartDate] = useState(src?.start_date ?? "");
  const [clearance, setClearance] = useState(src?.security_clearance ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      employment_type: employmentType,
      work_arrangement: workArrangement,
      start_date: startDate.trim(),
      security_clearance: clearance,
    };

    const supabase = createClient();

    if (isEdit) {
      const { error: err } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", mode.job.id);

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      onSaved({ ...mode.job, ...payload });
    } else {
      const { data, error: err } = await supabase
        .from("jobs")
        .insert({ ...payload, active: true, archived: false })
        .select("id, active, archived")
        .single();

      if (err || !data) {
        setError(err?.message ?? "Insert failed.");
        setSaving(false);
        return;
      }
      onSaved({
        id: data.id as string,
        active: data.active as boolean,
        archived: false,
        application_count: 0,
        ...payload,
      });
    }

    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ backgroundColor: "rgba(10,22,40,0.55)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
        style={{ border: "1px solid rgba(10,22,40,0.08)", maxHeight: "90vh" }}
      >
        <div
          className="flex shrink-0 items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "rgba(10,22,40,0.07)" }}
        >
          <h2 className="text-base font-bold" style={{ color: "#0A1628" }}>
            {isEdit ? "Edit job listing" : "Add new job listing"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={16} style={{ color: "rgba(26,26,26,0.5)" }} />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="overflow-y-auto px-6 py-5"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="space-y-4">
            <Field label="Job Title" required>
              <input
                ref={titleRef}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Financial Analyst"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Role overview, responsibilities, requirements…"
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </Field>

            <Field label="Location">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Canberra, ACT"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Employment Type">
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">— Select —</option>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Work Arrangement">
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">— Select —</option>
                  {WORK_ARRANGEMENTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. Immediate"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Security Clearance">
                <select
                  value={clearance}
                  onChange={(e) => setClearance(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">— Select —</option>
                  {CLEARANCE_LEVELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {error && (
              <p
                className="rounded-xl px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: "rgba(220,38,38,0.08)",
                  color: "#DC2626",
                }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{
                borderColor: "rgba(10,22,40,0.12)",
                color: "rgba(26,26,26,0.7)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#4DC92F" }}
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Metadata pill ────────────────────────────────────────────────────────────

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: "rgba(26,109,181,0.07)",
        color: "rgba(26,26,26,0.6)",
      }}
    >
      {children}
    </span>
  );
}

// ─── Job card ─────────────────────────────────────────────────────────────────

function JobCard({
  job,
  busy,
  onEdit,
  onToggle,
  onArchive,
  onRestore,
}: {
  job: JobRow;
  busy: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onArchive: () => void;
  onRestore: () => void;
}) {
  const meta = [
    job.location,
    job.employment_type,
    job.work_arrangement,
    job.start_date ? `Start: ${job.start_date}` : "",
    job.security_clearance && job.security_clearance !== "None"
      ? `${job.security_clearance} clearance`
      : "",
  ].filter(Boolean);

  return (
    <div
      className="rounded-2xl border bg-white shadow-sm"
      style={{
        borderColor: job.archived ? "rgba(10,22,40,0.05)" : "rgba(10,22,40,0.07)",
        opacity: job.archived ? 0.72 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-4 px-6 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="truncate text-base font-semibold"
              style={{ color: "#0A1628" }}
            >
              {job.title}
            </span>
            {job.archived ? (
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.06)", color: "rgba(26,26,26,0.4)" }}
              >
                Archived
              </span>
            ) : (
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={
                  job.active
                    ? { backgroundColor: "rgba(77,201,47,0.12)", color: "#2d8a1a" }
                    : { backgroundColor: "rgba(0,0,0,0.06)", color: "rgba(26,26,26,0.45)" }
                }
              >
                {job.active ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          {meta.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meta.map((m) => (
                <MetaPill key={m}>{m}</MetaPill>
              ))}
            </div>
          )}

          {job.description && (
            <p
              className="mt-2 line-clamp-2 text-sm leading-relaxed"
              style={{ color: "rgba(26,26,26,0.5)" }}
            >
              {job.description}
            </p>
          )}

          <Link
            href={`/admin/applications?job=${job.id}`}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
            style={{ color: job.application_count > 0 ? "#1A6DB5" : "rgba(26,26,26,0.35)" }}
          >
            {job.application_count}{" "}
            {job.application_count === 1 ? "application" : "applications"}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {job.archived ? (
            /* Archived: only show Restore button */
            <button
              onClick={onRestore}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
              style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
              aria-label={`Restore ${job.title}`}
            >
              <ArchiveRestore size={12} />
              Restore
            </button>
          ) : (
            /* Live: show Edit, Archive, and active toggle */
            <>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                aria-label={`Edit ${job.title}`}
              >
                <Pencil size={12} />
                Edit
              </button>

              <button
                onClick={onArchive}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.45)" }}
                aria-label={`Archive ${job.title}`}
              >
                <Archive size={12} />
                Archive
              </button>

              <button
                role="switch"
                aria-checked={job.active}
                aria-label={`Toggle ${job.title}`}
                disabled={busy}
                onClick={onToggle}
                className="relative shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                style={{
                  width: 48,
                  height: 26,
                  backgroundColor: job.active ? "#4DC92F" : "rgba(10,22,40,0.15)",
                }}
              >
                <span
                  className="absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{
                    width: 22,
                    height: 22,
                    transform: job.active ? "translateX(22px)" : "translateX(0)",
                  }}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function JobsClient({
  initialJobs,
  activeOnly = false,
}: {
  initialJobs: JobRow[];
  activeOnly?: boolean;
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobRow[]>(initialJobs);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);

  const liveJobs = jobs.filter((j) => !j.archived);
  const archivedJobs = jobs.filter((j) => j.archived);
  const visibleJobs = activeOnly ? liveJobs.filter((j) => j.active) : liveJobs;

  function setBusyId(id: string, on: boolean) {
    setBusy((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });
  }

  async function handleToggle(id: string, current: boolean) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("jobs")
      .update({ active: !current })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to update: ${error.message}`);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, active: !current } : j)));
    }
    setBusyId(id, false);
  }

  async function handleArchive(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("jobs")
      .update({ archived: true, active: false })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to archive: ${error.message}`);
    } else {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, archived: true, active: false } : j))
      );
      setArchivedOpen(true); // open the section so the user sees where it went
    }
    setBusyId(id, false);
  }

  async function handleRestore(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("jobs")
      .update({ archived: false })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to restore: ${error.message}`);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, archived: false } : j)));
    }
    setBusyId(id, false);
  }

  function handleSaved(saved: JobRow) {
    setJobs((prev) => {
      const exists = prev.find((j) => j.id === saved.id);
      if (exists) {
        return prev.map((j) => (j.id === saved.id ? saved : j));
      }
      return [saved, ...prev].sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  return (
    <>
      {modal && (
        <JobModal
          mode={modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setModal({ kind: "add" })}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: "#4DC92F" }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add new listing
        </button>
      </div>

      {actionError && (
        <div
          className="mb-3 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
        >
          {actionError}
        </div>
      )}

      {activeOnly && (
        <div
          className="mb-4 flex items-center justify-between rounded-xl px-4 py-2.5"
          style={{
            backgroundColor: "rgba(77,201,47,0.08)",
            border: "1px solid rgba(77,201,47,0.25)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "#2d8a1a" }}>
            Showing active listings only
          </span>
          <button
            onClick={() => router.push("/admin/jobs")}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-green-500/10"
            style={{ color: "#2d8a1a" }}
          >
            <X size={12} />
            Clear filter
          </button>
        </div>
      )}

      {/* Live listings */}
      {visibleJobs.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed px-8 py-14 text-center"
          style={{ borderColor: "rgba(26,109,181,0.25)" }}
        >
          <p className="mb-4 text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>
            {activeOnly ? "No active listings." : "No job listings yet."}
          </p>
          {!activeOnly && (
            <button
              onClick={() => setModal({ kind: "add" })}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#4DC92F" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add your first listing
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              busy={busy.has(job.id)}
              onEdit={() => setModal({ kind: "edit", job })}
              onToggle={() => handleToggle(job.id, job.active)}
              onArchive={() => handleArchive(job.id)}
              onRestore={() => handleRestore(job.id)}
            />
          ))}
        </div>
      )}

      {/* Archived section */}
      {archivedJobs.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setArchivedOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-100"
            style={{
              backgroundColor: "rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <Archive size={14} style={{ color: "rgba(26,26,26,0.4)" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(26,26,26,0.55)" }}>
                Drafts &amp; Archived
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "rgba(10,22,40,0.07)", color: "rgba(26,26,26,0.45)" }}
              >
                {archivedJobs.length}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200"
              style={{ transform: archivedOpen ? "rotate(180deg)" : "rotate(0deg)", color: "rgba(26,26,26,0.35)" }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {archivedOpen && (
            <div className="mt-2 space-y-2">
              {archivedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  busy={busy.has(job.id)}
                  onEdit={() => setModal({ kind: "edit", job })}
                  onToggle={() => handleToggle(job.id, job.active)}
                  onArchive={() => handleArchive(job.id)}
                  onRestore={() => handleRestore(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
