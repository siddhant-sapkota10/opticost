"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Navbar from "../components/Navbar";

const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

const ENQUIRY_TYPES = [
  "General Enquiry",
  "Financial Management & Control",
  "Capability Costing & Cost Modelling",
  "Commercial & Contract Financial Analysis",
  "ICT & Digital Cost Modelling",
  "Governance, Compliance & Assurance",
  "Transformation & Capability Uplift",
] as const;

type FormState = {
  firstName:   string;
  lastName:    string;
  organisation:string;
  phone:       string;
  email:       string;
  enquiryType: string;
  message:     string;
};

const EMPTY: FormState = {
  firstName:    "",
  lastName:     "",
  organisation: "",
  phone:        "",
  email:        "",
  enquiryType:  "",
  message:      "",
};

export default function ContactPage() {
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.brandBg, color: C.bodyLight }}>
      <Navbar />

      {/* ══════════════════════════════
          1. HERO
         ══════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.deepNavy }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 65% 50%, rgba(26,109,181,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div
              className="mb-6 h-1 w-14 rounded-full"
              style={{ backgroundColor: C.brightGreen }}
            />
            <h1
              className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: "#FFFFFF" }}
            >
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              Reach out to our team of Defence and government finance specialists.
            </p>
          </div>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ══════════════════════════════
          2. MAIN CONTENT
         ══════════════════════════════ */}
      <section style={{ backgroundColor: C.brandBg }}>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">

            {/* ── Left column — contact info ── */}
            <div>
              <h2
                className="mb-8 text-2xl font-bold"
                style={{ color: C.elecBlue }}
              >
                Contact Us
              </h2>

              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(77,201,47,0.12)" }}
                >
                  <Mail size={18} strokeWidth={1.75} style={{ color: C.brightGreen }} />
                </div>
                <div>
                  <p
                    className="mb-0.5 text-xs font-bold uppercase tracking-widest"
                    style={{ color: C.brightGreen }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:admin@opticost.com.au"
                    className="text-sm font-medium transition-colors hover:underline"
                    style={{ color: C.bodyLight }}
                  >
                    admin@opticost.com.au
                  </a>
                </div>
              </div>
            </div>

            {/* ── Right column — form ── */}
            <div
              className="rounded-2xl bg-white p-8 shadow-sm lg:p-10"
            >
              {submitted ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(77,201,47,0.12)" }}
                  >
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke={C.brightGreen}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3
                    className="mb-3 text-xl font-bold"
                    style={{ color: C.deepNavy }}
                  >
                    Enquiry Received
                  </h3>
                  <p className="max-w-sm text-sm leading-7" style={{ color: "rgba(26,26,26,0.65)" }}>
                    Thank you for your enquiry. We will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">

                  {/* Name row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First" name="firstName" required>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                    <Field label="Last" name="lastName" required>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  {/* Organisation */}
                  <Field label="Organisation" name="organisation">
                    <input
                      type="text"
                      id="organisation"
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>

                  {/* Phone */}
                  <Field label="Phone" name="phone" required>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>

                  {/* Email */}
                  <Field label="Email" name="email" required>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>

                  {/* Enquiry type */}
                  <Field label="Enquiry Type" name="enquiryType" required>
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      required
                      value={form.enquiryType}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="" disabled>Select an option</option>
                      {ENQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label="Message" name="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                    />
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full rounded-md py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: C.brightGreen,
                      // @ts-expect-error custom property
                      "--tw-ring-color": C.brightGreen,
                    }}
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Input field styles injected as a global style block */}
      <style>{`
        .input-field {
          display: block;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #D1D5DB;
          background-color: #FFFFFF;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          line-height: 1.5rem;
          color: ${C.bodyLight};
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .input-field:focus {
          border-color: ${C.elecBlue};
          box-shadow: 0 0 0 3px rgba(26,109,181,0.15);
        }
        select.input-field {
          appearance: auto;
        }
      `}</style>
    </div>
  );
}

/* ── Field wrapper ────────────────────────────────────────────────────────── */

function Field({
  label,
  name,
  required = false,
  children,
}: {
  label:    string;
  name:     string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: C.bodyLight }}
      >
        {label}
        {required && (
          <span className="text-xs font-bold" style={{ color: C.brightGreen }}>
            (Required)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
