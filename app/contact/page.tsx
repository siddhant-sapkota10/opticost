"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

const C = {
  deepNavy: "#0A1628",
  elecBlue: "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg: "#F5F7FA",
  bodyLight: "#1A1A1A",
  mutedText: "#556070",
  white: "#FFFFFF",
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
  firstName: string;
  lastName: string;
  organisation: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  organisation: "",
  phone: "",
  email: "",
  enquiryType: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
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
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: C.brandBg, color: C.bodyLight }}
    >
      <Navbar />

      {/* HERO */}
      <section
        className="relative isolate overflow-hidden pt-24"
        style={{ backgroundColor: C.deepNavy }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 18% 25%, rgba(77,201,47,0.15), transparent 28%),
              radial-gradient(circle at 82% 20%, rgba(26,109,181,0.22), transparent 30%),
              radial-gradient(circle at 60% 75%, rgba(255,255,255,0.05), transparent 25%)
            `,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(77, 201, 47, 0.10)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(26, 109, 181, 0.18)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: C.brightGreen,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: C.brightGreen }}
              />
              Contact Us
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Get in touch with our team
            </h1>

            <p
              className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              Reach out to OptiCost Consulting for practical, governance-aligned
              support across Defence and government finance, costing, commercial
              analysis, and transformation.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:admin@opticost.com.au"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: C.brightGreen }}
              >
                Email Us
                <ArrowRight size={18} />
              </a>

              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: C.white,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                Submit an Enquiry
              </a>
            </div>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* MAIN CONTENT */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* LEFT COLUMN */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: C.elecBlue }}
              >
                Contact Details
              </span>

              <h2
                className="mt-3 text-3xl font-bold sm:text-4xl"
                style={{ color: C.deepNavy }}
              >
                Let’s start the conversation
              </h2>

              <p
                className="mt-4 max-w-md text-base leading-8"
                style={{ color: C.mutedText }}
              >
                Whether you need support with costing, financial governance,
                commercial analysis, or broader finance transformation, we’d be
                glad to hear from you.
              </p>

              <div
                className="mt-8 rounded-[26px] border bg-white p-6 shadow-sm"
                style={{ borderColor: "rgba(10,22,40,0.07)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(77,201,47,0.12)" }}
                  >
                    <Mail size={20} strokeWidth={1.8} style={{ color: C.brightGreen }} />
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color: C.brightGreen }}
                    >
                      Email
                    </p>
                    <a
                      href="mailto:admin@opticost.com.au"
                      className="mt-2 inline-block text-base font-semibold hover:underline"
                      style={{ color: C.deepNavy }}
                    >
                      admin@opticost.com.au
                    </a>
                    <p
                      className="mt-3 text-sm leading-7"
                      style={{ color: C.mutedText }}
                    >
                      We aim to respond promptly to all enquiries relating to
                      Defence and public sector financial advisory support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div
              id="contact-form"
              className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-8 lg:p-10"
              style={{ borderColor: "rgba(10,22,40,0.07)" }}
            >
              {submitted ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center sm:min-h-[360px]">
                  <div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(77,201,47,0.12)" }}
                  >
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke={C.brightGreen}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>

                  <h3
                    className="mb-3 text-2xl font-bold"
                    style={{ color: C.deepNavy }}
                  >
                    Enquiry received
                  </h3>

                  <p
                    className="max-w-md text-sm leading-7"
                    style={{ color: "rgba(26,26,26,0.65)" }}
                  >
                    Thank you for getting in touch. We’ve received your enquiry
                    and will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="mb-2">
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color: C.elecBlue }}
                    >
                      Enquiry Form
                    </span>
                    <h2
                      className="mt-3 text-2xl font-bold sm:text-3xl"
                      style={{ color: C.deepNavy }}
                    >
                      Send us a message
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First Name" name="firstName" required>
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

                    <Field label="Last Name" name="lastName" required>
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

                  <Field label="Enquiry Type" name="enquiryType" required>
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      required
                      value={form.enquiryType}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {ENQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>

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

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ backgroundColor: C.brightGreen }}
                  >
                    Submit Enquiry
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .input-field {
          display: block;
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(10,22,40,0.10);
          background-color: #FFFFFF;
          padding: 0.8rem 1rem;
          font-size: 0.95rem;
          line-height: 1.5rem;
          color: ${C.bodyLight};
          outline: none;
          transition: border-color 150ms, box-shadow 150ms, transform 150ms;
        }

        .input-field:focus {
          border-color: ${C.elecBlue};
          box-shadow: 0 0 0 4px rgba(26,109,181,0.12);
        }

        select.input-field {
          appearance: auto;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  name,
  required = false,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
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
