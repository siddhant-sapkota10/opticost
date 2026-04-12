import { NextResponse } from "next/server";
import { createAdminAccessRequest } from "@/utils/admin-access";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { targetEmail?: string; note?: string };
    const id = await createAdminAccessRequest({
      targetEmail: body.targetEmail ?? "",
      note: body.note ?? null,
    });

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create request.";
    const status =
      message === "Admin access required."
        ? 403
        : message === "Missing SUPABASE_SERVICE_ROLE_KEY."
        ? 500
        : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
