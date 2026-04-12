import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requireCurrentAdmin } from "@/utils/admin-access";
import { hasEmailConfig, sendEmail } from "@/utils/email";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      subject?: string;
      message?: string;
    };

    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Subject and message are required." },
        { status: 400 },
      );
    }

    if (!hasEmailConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email sending is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM_EMAIL to the server environment.",
        },
        { status: 500 },
      );
    }

    const { user } = await requireCurrentAdmin();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: application, error } = await supabase
      .from("applications")
      .select("email, first_name, last_name, job_title")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!application?.email) {
      return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
    }

    const recipientName = [application.first_name, application.last_name].filter(Boolean).join(" ").trim();
    const personalizedMessage = recipientName
      ? `Hi ${recipientName},\n\n${message}`
      : message;

    await sendEmail({
      to: application.email,
      subject,
      text: personalizedMessage,
      replyTo: user.email ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      sentTo: application.email,
      jobTitle: application.job_title ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    const status = message === "Admin access required." ? 403 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
