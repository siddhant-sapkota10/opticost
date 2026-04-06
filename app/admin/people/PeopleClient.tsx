"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, ArchiveRestore, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

export type PersonRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  linkedin_url: string;
  photo_url: string;
  display_order: number;
  active: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  name,
  photoUrl,
  size = 48,
}: {
  name: string;
  photoUrl: string;
  size?: number;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size, flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ width: size, height: size, backgroundColor: "#1A6DB5", flexShrink: 0 }}
    >
      {initials(name)}
    </div>
  );
}

// ─── Person modal ─────────────────────────────────────────────────────────────

type ModalMode = { kind: "add" } | { kind: "edit"; person: PersonRow };

function PersonModal({
  mode,
  onClose,
  onSaved,
}: {
  mode: ModalMode;
  onClose: () => void;
  onSaved: (person: PersonRow) => void;
}) {
  const isEdit = mode.kind === "edit";
  const src = isEdit ? mode.person : null;

  const [name, setName] = useState(src?.name ?? "");
  const [role, setRole] = useState(src?.role ?? "");
  const [bio, setBio] = useState(src?.bio ?? "");
  const [email, setEmail] = useState(src?.email ?? "");
  const [phone, setPhone] = useState(src?.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(src?.linkedin_url ?? "");
  const [displayOrder, setDisplayOrder] = useState(String(src?.display_order ?? 0));
  const [photoUrl, setPhotoUrl] = useState(src?.photo_url ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(src?.photo_url ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    let finalPhotoUrl = photoUrl;

    // Upload new photo if one was selected
    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("people")
        .upload(path, photoFile, { upsert: true });

      if (uploadErr) {
        setError(`Photo upload failed: ${uploadErr.message}`);
        setSaving(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("people").getPublicUrl(path);
      finalPhotoUrl = publicUrl;
    }

    const payload = {
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      email: email.trim(),
      phone: phone.trim(),
      linkedin_url: linkedinUrl.trim(),
      photo_url: finalPhotoUrl,
      display_order: parseInt(displayOrder, 10) || 0,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("people")
        .update(payload)
        .eq("id", mode.person.id);

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      onSaved({ ...mode.person, ...payload });
    } else {
      const { data, error: err } = await supabase
        .from("people")
        .insert({ ...payload, active: true })
        .select("id, active")
        .single();

      if (err || !data) {
        setError(err?.message ?? "Insert failed.");
        setSaving(false);
        return;
      }
      onSaved({
        id: data.id as string,
        active: data.active as boolean,
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
        style={{ border: "1px solid rgba(10,22,40,0.08)", maxHeight: "92vh" }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6"
          style={{ borderColor: "rgba(10,22,40,0.07)" }}
        >
          <h2 className="text-base font-bold" style={{ color: "#0A1628" }}>
            {isEdit ? "Edit team member" : "Add team member"}
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
          className="overflow-y-auto px-4 py-5 sm:px-6"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="space-y-4">
            {/* Photo upload */}
            <Field label="Photo">
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                      style={{ width: 64, height: 64 }}
                      unoptimized={photoPreview.startsWith("blob:")}
                    />
                    <button
                      type="button"
                      onClick={() => { setPhotoPreview(""); setPhotoFile(null); setPhotoUrl(""); }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow"
                      style={{ border: "1px solid rgba(10,22,40,0.15)" }}
                    >
                      <X size={10} style={{ color: "rgba(26,26,26,0.6)" }} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: name ? "#1A6DB5" : "rgba(10,22,40,0.1)", color: name ? "white" : "rgba(26,26,26,0.3)" }}
                  >
                    {name ? initials(name) : "?"}
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-50"
                    style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                  >
                    <Upload size={12} />
                    {photoPreview ? "Change photo" : "Upload photo"}
                  </button>
                  <p className="mt-1 text-xs" style={{ color: "rgba(26,26,26,0.35)" }}>
                    JPG, PNG or WebP. Will be cropped to a circle.
                  </p>
                </div>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  ref={nameRef}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Role / Title" required>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Principal Consultant"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Bio">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short professional background…"
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+61 4xx xxx xxx"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn URL">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/…"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

              <Field label="Display Order">
                <input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>
            </div>

            {error && (
              <p
                className="rounded-xl px-4 py-2.5 text-sm"
                style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.7)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !role.trim()}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#4DC92F" }}
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Person card ──────────────────────────────────────────────────────────────

function PersonCard({
  person,
  busy,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: {
  person: PersonRow;
  busy: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      className="rounded-2xl border bg-white shadow-sm"
      style={{
        borderColor: person.active ? "rgba(10,22,40,0.07)" : "rgba(10,22,40,0.05)",
        opacity: person.active ? 1 : 0.72,
      }}
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: avatar + info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={person.name} photoUrl={person.photo_url} size={44} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold" style={{ color: "#0A1628" }}>
                {person.name}
              </span>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={
                  person.active
                    ? { backgroundColor: "rgba(77,201,47,0.12)", color: "#2d8a1a" }
                    : { backgroundColor: "rgba(0,0,0,0.06)", color: "rgba(26,26,26,0.4)" }
                }
              >
                {person.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="truncate text-xs" style={{ color: "#1A6DB5" }}>
              {person.role}
            </p>
            {person.display_order !== 0 && (
              <p className="text-xs" style={{ color: "rgba(26,26,26,0.35)" }}>
                Order: {person.display_order}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-wrap items-center gap-2">
          {person.active ? (
            <>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                aria-label={`Edit ${person.name}`}
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={onArchive}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.45)" }}
                aria-label={`Archive ${person.name}`}
              >
                <Archive size={12} />
                Archive
              </button>
            </>
          ) : confirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "rgba(26,26,26,0.55)" }}>
                Delete permanently?
              </span>
              <button
                onClick={() => { setConfirmingDelete(false); onDelete(); }}
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
            </div>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                aria-label={`Edit ${person.name}`}
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={onRestore}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.6)" }}
                aria-label={`Restore ${person.name}`}
              >
                <ArchiveRestore size={12} />
                Restore
              </button>
              <button
                onClick={() => setConfirmingDelete(true)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "rgba(26,26,26,0.45)" }}
                aria-label={`Delete ${person.name}`}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PeopleClient({ initialPeople }: { initialPeople: PersonRow[] }) {
  const [people, setPeople] = useState<PersonRow[]>(initialPeople);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [inactiveOpen, setInactiveOpen] = useState(false);

  const activePeople = people.filter((p) => p.active);
  const inactivePeople = people.filter((p) => !p.active);

  function setBusyId(id: string, on: boolean) {
    setBusy((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });
  }

  async function handleArchive(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase.from("people").update({ active: false }).eq("id", id);
    if (error) {
      setActionError(`Failed to archive: ${error.message}`);
    } else {
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, active: false } : p)));
      setInactiveOpen(true);
    }
    setBusyId(id, false);
  }

  async function handleRestore(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase.from("people").update({ active: true }).eq("id", id);
    if (error) {
      setActionError(`Failed to restore: ${error.message}`);
    } else {
      setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, active: true } : p)));
    }
    setBusyId(id, false);
  }

  async function handleDelete(id: string) {
    setBusyId(id, true);
    setActionError(null);
    const supabase = createClient();
    const { error } = await supabase.from("people").delete().eq("id", id);
    if (error) {
      setActionError(`Failed to delete: ${error.message}`);
    } else {
      setPeople((prev) => prev.filter((p) => p.id !== id));
    }
    setBusyId(id, false);
  }

  function handleSaved(saved: PersonRow) {
    setPeople((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [...prev, saved].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name));
    });
  }

  return (
    <>
      {modal && (
        <PersonModal
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
          Add new person
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

      {/* Active people */}
      {activePeople.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed px-8 py-14 text-center"
          style={{ borderColor: "rgba(26,109,181,0.25)" }}
        >
          <p className="mb-4 text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>
            No active team members yet.
          </p>
          <button
            onClick={() => setModal({ kind: "add" })}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: "#4DC92F" }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add your first member
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {activePeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              busy={busy.has(person.id)}
              onEdit={() => setModal({ kind: "edit", person })}
              onArchive={() => handleArchive(person.id)}
              onRestore={() => handleRestore(person.id)}
              onDelete={() => handleDelete(person.id)}
            />
          ))}
        </div>
      )}

      {/* Inactive section */}
      {inactivePeople.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setInactiveOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-100"
            style={{
              backgroundColor: "rgba(10,22,40,0.03)",
              border: "1px solid rgba(10,22,40,0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <Archive size={14} style={{ color: "rgba(26,26,26,0.4)" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(26,26,26,0.55)" }}>
                Inactive
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: "rgba(10,22,40,0.07)", color: "rgba(26,26,26,0.45)" }}
              >
                {inactivePeople.length}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200"
              style={{
                transform: inactiveOpen ? "rotate(180deg)" : "rotate(0deg)",
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

          {inactiveOpen && (
            <div className="mt-2 space-y-2">
              {inactivePeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  busy={busy.has(person.id)}
                  onEdit={() => setModal({ kind: "edit", person })}
                  onArchive={() => handleArchive(person.id)}
                  onRestore={() => handleRestore(person.id)}
                  onDelete={() => handleDelete(person.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
