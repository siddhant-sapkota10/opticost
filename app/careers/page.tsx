"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
} from "lucide-react";
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

type Job = {
  id: string;
  title: string;
  description: string | null;
  active: boolean;
  location: string | null;
  employment_type: string | null;
  work_arrangement: string | null;
  start_date: string | null;
  security_clearance: string | null;
};

type AppForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
};

const EMPTY_FORM: AppForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  coverLetter: "",
  resume: null,
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, description, active, location, employment_type, work_arrangement, start_date, security_clearance")
        .eq("active", true)
        .eq("archived", false)
        .order("title");

      if (error) {
        setError("Unable to load job listings. Please try again later.");
      } else {
        setJobs(data ?? []);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

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

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
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
              Careers
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Join our growing team
            </h1>

            <p
              className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              We are looking for talented finance professionals who want to help
              deliver high-impact advisory services across Defence and government.
              Join OptiCost Consulting and contribute to practical, trusted,
              and governance-aligned outcomes.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#current-opportunities"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: C.brightGreen }}
              >
                View Opportunities
                <ArrowRight size={18} />
              </a>

              <a
                href="mailto:admin@opticost.com.au"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: C.white,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* JOB LISTINGS */}
      <section id="current-opportunities">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: C.elecBlue }}
            >
              Roles
            </span>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              Current opportunities
            </h2>

            <p
              className="mt-4 max-w-3xl text-base leading-8"
              style={{ color: C.mutedText }}
            >
              Explore current openings and apply to join a team focused on
              delivering specialist financial advisory services in complex,
              high-accountability environments.
            </p>
          </div>

          {loading && <LoadingState />}

          {!loading && error && (
            <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div
              className="rounded-[26px] border border-dashed px-8 py-16 text-center"
              style={{ borderColor: "rgba(26,109,181,0.25)" }}
            >
              <p
                className="text-base font-medium"
                style={{ color: "rgba(26,26,26,0.55)" }}
              >
                No current openings. Check back soon.
              </p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: C.deepNavy }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(77,201,47,0.12), transparent 22%), radial-gradient(circle at 80% 40%, rgba(26,109,181,0.18), transparent 24%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Don’t see the right role?
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            We are always interested in hearing from exceptional finance
            professionals with Defence and government experience.
          </p>

          <div className="mt-8">
            <a
              href="mailto:admin@opticost.com.au"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: C.brightGreen }}
            >
              Email Your CV
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AppForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, resume: e.target.files?.[0] ?? null }));
  }

  function handleToggle() {
    setOpen((prev) => {
      if (!prev) {
        setTimeout(
          () =>
            formRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            }),
          50
        );
      }
      return !prev;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      let resume_url: string | null = null;

      if (form.resume) {
        const timestamp = Date.now();
        const safeName = form.resume.name.replace(/\s+/g, "_");
        const path = `${job.title}/${timestamp}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(path, form.resume, { contentType: "application/pdf" });

        if (uploadError) {
          console.error("[Resume upload error]", uploadError);
          throw new Error(`Resume upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(path);

        resume_url = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("applications").insert({
        job_id: job.id,
        job_title: job.title,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        cover_letter: form.coverLetter || null,
        resume_url,
        archived: false,
      });

      if (insertError) {
        console.error("[Application insert error]", insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      setSuccess(true);
      setForm(EMPTY_FORM);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("[Application submit error]", err);
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      setFormError(`Something went wrong: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="group overflow-hidden rounded-[26px] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(10,22,40,0.07)" }}
    >
      <div className="p-7">
        <h3
          className="mb-3 text-xl font-bold leading-snug"
          style={{ color: C.deepNavy }}
        >
          {job.title}
        </h3>

        <div className="mb-4 flex flex-wrap gap-3">
          {job.location && (
            <JobMeta icon={<MapPin size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />}>
              {job.location}
            </JobMeta>
          )}
          {job.employment_type && (
            <JobMeta icon={<Clock size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />}>
              {job.employment_type}
            </JobMeta>
          )}
          {job.work_arrangement && (
            <JobMeta icon={<Briefcase size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />}>
              {job.work_arrangement}
            </JobMeta>
          )}
          {job.start_date && (
            <JobMeta icon={<CalendarDays size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />}>
              {job.start_date}
            </JobMeta>
          )}
          {job.security_clearance && job.security_clearance !== "None" && (
            <JobMeta icon={<ShieldCheck size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />}>
              {job.security_clearance} Clearance
            </JobMeta>
          )}
        </div>

        {job.description && (
          <p
            className="mb-6 text-sm leading-relaxed"
            style={{ color: C.mutedText }}
          >
            {job.description}
          </p>
        )}

        <button
          onClick={handleToggle}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          style={{ backgroundColor: C.brightGreen }}
        >
          {open ? "Close" : "Apply Now"}
          {open ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div
          ref={formRef}
          className="border-t px-7 pb-8 pt-6"
          style={{
            borderColor: "rgba(0,0,0,0.07)",
            backgroundColor: "#F8FAFC",
          }}
        >
          <h4 className="mb-5 text-base font-bold" style={{ color: C.deepNavy }}>
            Apply for: <span style={{ color: C.elecBlue }}>{job.title}</span>
          </h4>

          {success ? (
            <div
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ backgroundColor: "rgba(77,201,47,0.1)" }}
            >
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0"
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
              <p className="text-sm font-medium" style={{ color: C.bodyLight }}>
                Thank you for your application. We will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <input type="hidden" name="job_id" value={job.id} />
              <input type="hidden" name="job_title" value={job.title} />

              <div className="grid gap-4 sm:grid-cols-2">
                <AppField label="First Name" name="firstName" required>
                  <input
                    type="text"
                    id={`firstName-${job.id}`}
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="app-input"
                  />
                </AppField>

                <AppField label="Last Name" name="lastName" required>
                  <input
                    type="text"
                    id={`lastName-${job.id}`}
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="app-input"
                  />
                </AppField>
              </div>

              <AppField label="Email" name="email" required>
                <input
                  type="email"
                  id={`email-${job.id}`}
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="app-input"
                />
              </AppField>

              <AppField label="Phone" name="phone" required>
                <input
                  type="tel"
                  id={`phone-${job.id}`}
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="app-input"
                />
              </AppField>

              <AppField label="Cover Letter" name="coverLetter">
                <textarea
                  id={`coverLetter-${job.id}`}
                  name="coverLetter"
                  rows={4}
                  value={form.coverLetter}
                  onChange={handleChange}
                  className="app-input resize-none"
                />
              </AppField>

              <AppField label="Resume" name="resume">
                <input
                  type="file"
                  id={`resume-${job.id}`}
                  name="resume"
                  accept=".pdf,application/pdf"
                  onChange={handleFile}
                  className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white file:cursor-pointer"
                  style={{ color: "rgba(26,26,26,0.6)" }}
                />
                <p className="mt-1 text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>
                  PDF only
                </p>
              </AppField>

              {formError && (
                <p className="text-sm" style={{ color: "#DC2626" }}>
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                style={{ backgroundColor: C.brightGreen }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      )}

      <style>{`
        .app-input {
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

        .app-input:focus {
          border-color: ${C.elecBlue};
          box-shadow: 0 0 0 4px rgba(26,109,181,0.12);
        }

        input[type="file"]::file-selector-button {
          background-color: ${C.elecBlue};
        }
      `}</style>
    </div>
  );
}

function JobMeta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex items-center gap-1.5 text-sm"
      style={{ color: "rgba(26,26,26,0.6)" }}
    >
      {icon}
      {children}
    </span>
  );
}

function AppField({
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

function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
      {[1, 2].map((n) => (
        <div
          key={n}
          className="animate-pulse rounded-[26px] border bg-white p-7 shadow-sm"
          style={{ borderColor: "rgba(10,22,40,0.07)" }}
        >
          <div
            className="mb-3 h-6 w-3/4 rounded"
            style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
          />
          <div className="mb-6 flex gap-4">
            <div
              className="h-4 w-28 rounded"
              style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
            />
            <div
              className="h-4 w-40 rounded"
              style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
            />
          </div>
          <div
            className="h-10 w-32 rounded-xl"
            style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
          />
        </div>
      ))}
    </div>
  );
}
