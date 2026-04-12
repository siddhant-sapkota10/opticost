import { cookies } from "next/headers";
import { createClient as createSessionClient } from "@/utils/supabase/server";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/utils/supabase/service-role";
import { getRoleFromUser, isAdminUser } from "@/utils/auth/roles";

type AdminAccessRequestRow = {
  id: string;
  target_email: string;
  target_user_id: string | null;
  requested_by_user_id: string;
  requested_by_email: string;
  note: string | null;
  status: "pending" | "approved";
  created_at: string;
  completed_at: string | null;
  promoted_at: string | null;
  promoted_user_id: string | null;
};

type AdminAccessApprovalRow = {
  request_id: string;
  approver_user_id: string;
  approver_email: string;
  created_at: string;
};

export type AdminUserSummary = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export type AdminAccessRequestSummary = {
  id: string;
  targetEmail: string;
  targetUserId: string | null;
  targetUserExists: boolean;
  targetAlreadyAdmin: boolean;
  requestedByUserId: string;
  requestedByEmail: string;
  note: string | null;
  status: "pending" | "approved";
  createdAt: string;
  completedAt: string | null;
  promotedAt: string | null;
  promotedUserId: string | null;
  approvalCount: number;
  approvals: {
    approverUserId: string;
    approverEmail: string;
    createdAt: string;
  }[];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function fullNameFromUser(user: {
  user_metadata?: { full_name?: unknown } | null;
  email?: string | null | undefined;
}) {
  return typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
    ? user.user_metadata.full_name.trim()
    : formatEmailName(user.email);
}

function formatEmailName(email?: string | null) {
  const localPart = email?.split("@")[0]?.trim();
  if (!localPart) {
    return "Unknown user";
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function promoteUserToAdmin(
  supabase: ReturnType<typeof createServiceRoleClient>,
  requestId: string,
  targetUserId: string | null,
  targetEmail: string,
) {
  const targetUser =
    (targetUserId
      ? await supabase.auth.admin.getUserById(targetUserId)
      : { data: { user: await findAuthUserByEmail(targetEmail) }, error: null });

  if (targetUser.error) {
    throw new Error(targetUser.error.message);
  }
  if (!targetUser.data.user) {
    throw new Error("The target account no longer exists.");
  }

  const existingMetadata =
    typeof targetUser.data.user.app_metadata === "object" && targetUser.data.user.app_metadata
      ? targetUser.data.user.app_metadata
      : {};

  const { error: promoteError } = await supabase.auth.admin.updateUserById(targetUser.data.user.id, {
    app_metadata: {
      ...existingMetadata,
      role: "admin",
    },
  });

  if (promoteError) {
    throw new Error(promoteError.message);
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("admin_access_requests")
    .update({
      target_user_id: targetUser.data.user.id,
      status: "approved",
      completed_at: now,
      promoted_at: now,
      promoted_user_id: targetUser.data.user.id,
    })
    .eq("id", requestId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { promoted: true };
}

export async function requireCurrentAdmin() {
  const cookieStore = await cookies();
  const supabase = createSessionClient(cookieStore);
  const [
    {
      data: { user },
    },
    { data: claimsData },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getClaims()]);

  if (!user || !isAdminUser(user, claimsData?.claims)) {
    throw new Error("Admin access required.");
  }

  return {
    user,
    claims: claimsData?.claims ?? null,
  };
}

async function listAllAuthUsers() {
  const supabase = createServiceRoleClient();
  const users: {
    id: string;
    email?: string | null | undefined;
    app_metadata?: Record<string, unknown> | null;
    user_metadata?: Record<string, unknown> | null;
  }[] = [];

  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      throw new Error(error.message);
    }

    users.push(...(data.users ?? []));

    if (!data.nextPage) {
      break;
    }

    page = data.nextPage;
  }

  return users;
}

export async function findAuthUserByEmail(email: string) {
  const normalized = normalizeEmail(email);
  const users = await listAllAuthUsers();

  return (
    users.find((user) => normalizeEmail(user.email ?? "") === normalized) ?? null
  );
}

export async function listCurrentAdmins(): Promise<AdminUserSummary[]> {
  if (!hasServiceRoleConfig()) {
    return [];
  }

  const users = await listAllAuthUsers();

  return users
    .filter((user) => getRoleFromUser(user as never) === "admin" && user.email)
    .map((user) => ({
      id: user.id,
      email: user.email ?? "",
      fullName: fullNameFromUser(user),
      role: "admin",
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
}

export async function listAdminAccessRequests(): Promise<AdminAccessRequestSummary[]> {
  if (!hasServiceRoleConfig()) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const [{ data: requestRows, error: requestError }, { data: approvalRows, error: approvalError }, users] =
    await Promise.all([
      supabase
        .from("admin_access_requests")
        .select(
          "id, target_email, target_user_id, requested_by_user_id, requested_by_email, note, status, created_at, completed_at, promoted_at, promoted_user_id",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("admin_access_approvals")
        .select("request_id, approver_user_id, approver_email, created_at")
        .order("created_at", { ascending: true }),
      listAllAuthUsers(),
    ]);

  if (requestError) {
    throw new Error(requestError.message);
  }
  if (approvalError) {
    throw new Error(approvalError.message);
  }

  const usersById = new Map(users.map((user) => [user.id, user]));
  const approvalsByRequest = new Map<string, AdminAccessApprovalRow[]>();

  for (const approval of (approvalRows ?? []) as AdminAccessApprovalRow[]) {
    const existing = approvalsByRequest.get(approval.request_id) ?? [];
    existing.push(approval);
    approvalsByRequest.set(approval.request_id, existing);
  }

  return ((requestRows ?? []) as AdminAccessRequestRow[]).map((request) => {
    const targetUser = request.target_user_id ? usersById.get(request.target_user_id) : null;
    const approvals = (approvalsByRequest.get(request.id) ?? []).map((approval) => ({
      approverUserId: approval.approver_user_id,
      approverEmail: approval.approver_email,
      createdAt: approval.created_at,
    }));

    return {
      id: request.id,
      targetEmail: request.target_email,
      targetUserId: request.target_user_id,
      targetUserExists: Boolean(targetUser),
      targetAlreadyAdmin: getRoleFromUser(targetUser as never) === "admin",
      requestedByUserId: request.requested_by_user_id,
      requestedByEmail: request.requested_by_email,
      note: request.note,
      status: request.status,
      createdAt: request.created_at,
      completedAt: request.completed_at,
      promotedAt: request.promoted_at,
      promotedUserId: request.promoted_user_id,
      approvalCount: approvals.length,
      approvals,
    };
  });
}

export async function getAdminAccessDashboardData() {
  return {
    serviceRoleConfigured: hasServiceRoleConfig(),
    currentAdmins: await listCurrentAdmins(),
    requests: await listAdminAccessRequests(),
  };
}

export async function createAdminAccessRequest(input: { targetEmail: string; note?: string | null }) {
  const normalizedEmail = normalizeEmail(input.targetEmail);
  const note = input.note?.trim() || null;
  const {
    user,
  } = await requireCurrentAdmin();

  if (!hasServiceRoleConfig()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!normalizedEmail) {
    throw new Error("Enter an email address.");
  }

  const supabase = createServiceRoleClient();
  const targetUser = await findAuthUserByEmail(normalizedEmail);

  if (!targetUser || !targetUser.email) {
    throw new Error("That email does not belong to an existing account yet.");
  }

  if (getRoleFromUser(targetUser as never) === "admin") {
    throw new Error("That user is already an admin.");
  }

  const { data: existingRequest, error: existingError } = await supabase
    .from("admin_access_requests")
    .select("id")
    .eq("target_email", normalizedEmail)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }
  if (existingRequest) {
    throw new Error("A pending admin request already exists for that email.");
  }

  const requesterEmail = user.email ?? "";
  const { data: requestRow, error: insertError } = await supabase
    .from("admin_access_requests")
    .insert({
      target_email: normalizedEmail,
      target_user_id: targetUser.id,
      requested_by_user_id: user.id,
      requested_by_email: requesterEmail,
      note,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !requestRow) {
    throw new Error(insertError?.message ?? "Failed to create admin request.");
  }

  const { error: approvalError } = await supabase.from("admin_access_approvals").insert({
    request_id: requestRow.id,
    approver_user_id: user.id,
    approver_email: requesterEmail,
  });

  if (approvalError) {
    throw new Error(approvalError.message);
  }

  await promoteUserToAdmin(supabase, requestRow.id as string, targetUser.id, normalizedEmail);

  return requestRow.id as string;
}

export async function approveAdminAccessRequest(requestId: string) {
  const {
    user,
  } = await requireCurrentAdmin();

  if (!hasServiceRoleConfig()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const supabase = createServiceRoleClient();
  const { data: requestRow, error: requestError } = await supabase
    .from("admin_access_requests")
    .select(
      "id, target_email, target_user_id, status, promoted_at",
    )
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    throw new Error(requestError.message);
  }
  if (!requestRow) {
    throw new Error("Request not found.");
  }
  if (requestRow.status !== "pending") {
    throw new Error("That request has already been completed.");
  }

  const approverEmail = user.email ?? "";
  const { error: approvalError } = await supabase
    .from("admin_access_approvals")
    .insert({
      request_id: requestId,
      approver_user_id: user.id,
      approver_email: approverEmail,
    });

  if (approvalError) {
    if (approvalError.code === "23505") {
      throw new Error("You have already approved this request.");
    }
    throw new Error(approvalError.message);
  }

  return promoteUserToAdmin(supabase, requestId, requestRow.target_user_id, requestRow.target_email);
}
