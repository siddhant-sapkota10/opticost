import { NextResponse } from "next/server";
import { approveAdminAccessRequest } from "@/utils/admin-access";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const result = await approveAdminAccessRequest(id);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to approve request.";
    const status =
      message === "Admin access required."
        ? 403
        : message === "Missing SUPABASE_SERVICE_ROLE_KEY."
        ? 500
        : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
