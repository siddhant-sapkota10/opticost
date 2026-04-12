"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Shield, UserPlus } from "lucide-react";
import type { AdminAccessRequestSummary, AdminUserSummary } from "@/utils/admin-access";

function formatTimestamp(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AccessClient({
  currentUserId,
  currentAdmins,
  requests,
}: {
  currentUserId: string;
  currentAdmins: AdminUserSummary[];
  requests: AdminAccessRequestSummary[];
}) {
  const router = useRouter();
  const [targetEmail, setTargetEmail] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    setActionError(null);
    setActionSuccess(null);

    const response = await fetch("/api/admin-access/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetEmail, note }),
    });

    const payload = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !payload.ok) {
      setFormError(payload.error ?? "Unable to create request.");
      setSubmitting(false);
      return;
    }

    setTargetEmail("");
    setNote("");
    setFormSuccess("Admin access granted. The user has been promoted immediately.");
    setSubmitting(false);
    startTransition(() => router.refresh());
  }

  async function handleApprove(id: string) {
    setApprovingId(id);
    setActionError(null);
    setActionSuccess(null);

    const response = await fetch(`/api/admin-access/requests/${id}/approve`, {
      method: "POST",
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; promoted?: boolean };

    if (!response.ok || !payload.ok) {
      setActionError(payload.error ?? "Unable to approve request.");
      setApprovingId(null);
      return;
    }

    setActionSuccess(
      payload.promoted
        ? "Approval recorded. The user has been promoted to admin."
        : "Approval recorded.",
    );
    setApprovingId(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section
          className="rounded-3xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(10,22,40,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(77,201,47,0.12)", color: "#2d8a1a" }}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#0A1628" }}>
                Request Admin Access
              </h2>
              <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
                Submit an existing user for admin promotion. Your approval is enough to promote
                them immediately.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateRequest} className="mt-5 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="target-email"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(26,26,26,0.55)" }}
              >
                User email
              </label>
              <input
                id="target-email"
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="person@example.com"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#1A6DB5] focus:ring-2 focus:ring-[#1A6DB5]/10"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "#1A1A1A" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="request-note"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "rgba(26,26,26,0.55)" }}
              >
                Reason
              </label>
              <textarea
                id="request-note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why does this person need admin access?"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#1A6DB5] focus:ring-2 focus:ring-[#1A6DB5]/10"
                style={{ borderColor: "rgba(10,22,40,0.12)", color: "#1A1A1A" }}
              />
            </div>

            {formError && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
              >
                {formError}
              </div>
            )}

            {formSuccess && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(77,201,47,0.10)", color: "#2d8a1a" }}
              >
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#4DC92F" }}
            >
              {submitting ? "Submitting..." : "Grant admin access"}
            </button>
          </form>
        </section>

        <section
          className="rounded-3xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(10,22,40,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(26,109,181,0.10)", color: "#1A6DB5" }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#0A1628" }}>
                Current Admins
              </h2>
              <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
                Existing admins who can create and approve access requests.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {currentAdmins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-2xl border px-4 py-4"
                style={{ borderColor: "rgba(10,22,40,0.08)", backgroundColor: "#FBFCFD" }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: "#2d8a1a" }} />
                  <p className="text-sm font-bold" style={{ color: "#0A1628" }}>
                    {admin.fullName}
                  </p>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: "rgba(26,109,181,0.10)", color: "#1A6DB5" }}
                  >
                    Admin
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
                  {admin.email}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {actionError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
        >
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(77,201,47,0.10)", color: "#2d8a1a" }}
        >
          {actionSuccess}
        </div>
      )}

      <section
        className="rounded-3xl border bg-white p-6 shadow-sm"
        style={{ borderColor: "rgba(10,22,40,0.08)" }}
      >
        <div className="mb-5">
          <h2 className="text-lg font-bold" style={{ color: "#0A1628" }}>
            Access History
          </h2>
          <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
            New requests are approved immediately. Older pending requests can still be completed
            here if needed.
          </p>
        </div>

        {requests.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-8 py-12 text-center"
            style={{ borderColor: "rgba(26,109,181,0.25)" }}
          >
            <p className="text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>
              No admin access activity yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const hasApproved = request.approvals.some(
                (approval) => approval.approverUserId === currentUserId,
              );
              const canApprove = request.status === "pending" && !hasApproved;

              return (
                <article
                  key={request.id}
                  className="rounded-2xl border px-5 py-5"
                  style={{
                    borderColor:
                      request.status === "approved"
                        ? "rgba(77,201,47,0.32)"
                        : "rgba(10,22,40,0.08)",
                    backgroundColor: request.status === "approved" ? "rgba(77,201,47,0.05)" : "white",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold" style={{ color: "#0A1628" }}>
                          {request.targetEmail}
                        </h3>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor:
                              request.status === "approved"
                                ? "rgba(77,201,47,0.14)"
                                : "rgba(26,109,181,0.10)",
                            color: request.status === "approved" ? "#2d8a1a" : "#1A6DB5",
                          }}
                        >
                          {request.status}
                        </span>
                        {!request.targetUserExists && (
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
                          >
                            Account missing
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
                        Requested by {request.requestedByEmail} on {formatTimestamp(request.createdAt)}
                      </p>

                      {request.note && (
                        <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.72)" }}>
                          {request.note}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {request.approvals.map((approval) => (
                          <span
                            key={`${request.id}-${approval.approverUserId}`}
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: "rgba(10,22,40,0.06)",
                              color: "rgba(26,26,26,0.65)",
                            }}
                          >
                            {approval.approverEmail}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex min-w-[160px] flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: "#0A1628" }}>
                          {Math.min(request.approvalCount, 1)}/1
                        </p>
                        <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
                          approvals
                        </p>
                      </div>

                      {request.status === "approved" ? (
                        <p className="text-right text-xs font-semibold" style={{ color: "#2d8a1a" }}>
                          Promoted {formatTimestamp(request.promotedAt)}
                        </p>
                      ) : canApprove ? (
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={approvingId === request.id}
                          className="rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                          style={{ backgroundColor: "#0A1628" }}
                        >
                          {approvingId === request.id ? "Approving..." : "Approve request"}
                        </button>
                      ) : (
                        <p className="text-right text-xs font-semibold" style={{ color: "rgba(26,26,26,0.45)" }}>
                          {hasApproved ? "You already approved" : "Awaiting approval"}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
