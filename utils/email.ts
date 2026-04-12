import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFromEmail = process.env.SMTP_FROM_EMAIL;
const smtpFromName = process.env.SMTP_FROM_NAME || "OptiCost";
const smtpSecure = process.env.SMTP_SECURE === "true";

export function hasEmailConfig() {
  return Boolean(smtpHost && smtpUser && smtpPass && smtpFromEmail);
}

function createTransport() {
  if (!hasEmailConfig()) {
    throw new Error(
      "Email sending is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM_EMAIL.",
    );
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string | null;
}) {
  const transport = createTransport();

  await transport.sendMail({
    from: smtpFromName ? `"${smtpFromName}" <${smtpFromEmail}>` : smtpFromEmail,
    to: input.to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo || undefined,
  });
}
