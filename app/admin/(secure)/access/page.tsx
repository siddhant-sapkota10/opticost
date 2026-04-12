import type { Metadata } from "next";
import { getAdminAccessDashboardData, requireCurrentAdmin } from "@/utils/admin-access";
import AccessClient from "../../access/AccessClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Access",
};

export default async function AdminAccessPage() {
  const [{ user }, dashboard] = await Promise.all([
    requireCurrentAdmin(),
    getAdminAccessDashboardData(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0A1628" }}>
          Admin Access
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>
          Promote admins with a single-approval workflow and a server-side audit trail.
        </p>
      </div>

      {!dashboard.serviceRoleConfigured ? (
        <div
          className="rounded-2xl px-5 py-4 text-sm"
          style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#DC2626" }}
        >
          Set `SUPABASE_SERVICE_ROLE_KEY` on the server before using admin promotion tools.
        </div>
      ) : (
        <AccessClient
          currentUserId={user.id}
          currentAdmins={dashboard.currentAdmins}
          requests={dashboard.requests}
        />
      )}
    </div>
  );
}
