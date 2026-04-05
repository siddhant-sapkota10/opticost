"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

/* ── Brand tokens ─────────────────────────────────────────────────────────── */

const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

/* ── Types ────────────────────────────────────────────────────────────────── */

type Job = {
  id:         string;
  title:      string;
  active:     boolean;
};

type AppForm = {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  coverLetter: string;
  resume:      File | null;
};

const EMPTY_FORM: AppForm = {
  firstName:   "",
  lastName:    "",
  email:       "",
  phone:       "",
  coverLetter: "",
  resume:      null,
};

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function CareersPage() {
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      // Dynamic import keeps supabase off the SSR prerender critical path
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, active")
        .eq("active", true)
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
              Join Our Team
            </h1>
            <p className="text-lg leading-relaxed sm:text-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              We are looking for talented finance professionals to join OptiCost
              Consulting. Help us deliver world-class financial advisory services
              to Australia&rsquo;s government and Defence sector.
            </p>
          </div>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ══════════════════════════════
          2. JOB LISTINGS
         ══════════════════════════════ */}
      <section style={{ backgroundColor: C.brandBg }}>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="mb-14">
            <span
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest"
              style={{ color: C.brightGreen }}
            >
              Roles
            </span>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              Current Opportunities
            </h2>
            <div
              className="mt-4 h-1 w-12 rounded-full"
              style={{ backgroundColor: C.elecBlue }}
            />
          </div>

          {loading && <LoadingState />}

          {!loading && error && (
            <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div
              className="rounded-xl border border-dashed px-8 py-16 text-center"
              style={{ borderColor: "rgba(26,109,181,0.25)" }}
            >
              <p className="text-base font-medium" style={{ color: "rgba(26,26,26,0.55)" }}>
                No current openings. Check back soon.
              </p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          3. CALL TO ACTION
         ══════════════════════════════ */}
      <section style={{ backgroundColor: C.deepNavy }}>
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <h2
            className="mb-4 text-3xl font-bold sm:text-4xl"
            style={{ color: "#FFFFFF" }}
          >
            Don&rsquo;t see the right role?
          </h2>
          <p className="mb-6 text-lg" style={{ color: "rgba(255,255,255,0.68)" }}>
            We are always looking for exceptional finance talent. Send us your CV at
          </p>
          <a
            href="mailto:admin@opticost.com.au"
            className="text-lg font-bold transition-opacity hover:opacity-80"
            style={{ color: C.brightGreen }}
          >
            admin@opticost.com.au
          </a>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

/* ── JobCard with accordion application form ──────────────────────────────── */

function JobCard({ job }: { job: Job }) {
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState<AppForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef                   = useRef<HTMLDivElement>(null);

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
        // scroll into view after render
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
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

      // 1. Upload resume if provided
      if (form.resume) {
        const timestamp = Date.now();
        const safeName  = form.resume.name.replace(/\s+/g, "_");
        const path      = `${job.title}/${timestamp}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(path, form.resume, { contentType: "application/pdf" });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(path);

        resume_url = urlData.publicUrl;
      }

      // 2. Insert application row
      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          job_id:       job.id,
          job_title:    job.title,
          first_name:   form.firstName,
          last_name:    form.lastName,
          email:        form.email,
          phone:        form.phone,
          cover_letter: form.coverLetter || null,
          resume_url,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setForm(EMPTY_FORM);
      // Close accordion after a short delay
      setTimeout(() => { setOpen(false); setSuccess(false); }, 4000);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{ borderTop: `4px solid ${C.brightGreen}` }}
    >
      {/* Card header */}
      <div className="p-7">
        <h3
          className="mb-3 text-lg font-bold leading-snug"
          style={{ color: C.elecBlue }}
        >
          {job.title}
        </h3>

        <div className="mb-6 flex flex-wrap gap-4">
          <span
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "rgba(26,26,26,0.6)" }}
          >
            <MapPin size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />
            Canberra, ACT
          </span>
          <span
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "rgba(26,26,26,0.6)" }}
          >
            <Clock size={14} strokeWidth={1.75} style={{ color: C.brightGreen }} />
            Full Time / Part Time / Contract
          </span>
        </div>

        <button
          onClick={handleToggle}
          className="flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ backgroundColor: C.brightGreen }}
        >
          {open ? "Close" : "Apply Now"}
          {open
            ? <ChevronUp size={16} strokeWidth={2} />
            : <ChevronDown size={16} strokeWidth={2} />
          }
        </button>
      </div>

      {/* Accordion form */}
      {open && (
        <div
          ref={formRef}
          className="border-t px-7 pb-8 pt-6"
          style={{ borderColor: "rgba(0,0,0,0.07)", backgroundColor: C.brandBg }}
        >
          <h4
            className="mb-5 text-base font-bold"
            style={{ color: C.deepNavy }}
          >
            Apply for: <span style={{ color: C.elecBlue }}>{job.title}</span>
          </h4>

          {success ? (
            <div
              className="flex items-start gap-3 rounded-lg p-4"
              style={{ backgroundColor: "rgba(77,201,47,0.1)" }}
            >
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={C.brightGreen}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-sm font-medium" style={{ color: C.bodyLight }}>
                Thank you for your application. We will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Hidden fields — values passed in submit handler */}
              <input type="hidden" name="job_id"    value={job.id} />
              <input type="hidden" name="job_title" value={job.title} />

              {/* Name row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <AppField label="First Name" name="firstName" required>
                  <input type="text" id={`firstName-${job.id}`} name="firstName" required
                    value={form.firstName} onChange={handleChange} className="app-input" />
                </AppField>
                <AppField label="Last Name" name="lastName" required>
                  <input type="text" id={`lastName-${job.id}`} name="lastName" required
                    value={form.lastName} onChange={handleChange} className="app-input" />
                </AppField>
              </div>

              {/* Email */}
              <AppField label="Email" name="email" required>
                <input type="email" id={`email-${job.id}`} name="email" required
                  value={form.email} onChange={handleChange} className="app-input" />
              </AppField>

              {/* Phone */}
              <AppField label="Phone" name="phone" required>
                <input type="tel" id={`phone-${job.id}`} name="phone" required
                  value={form.phone} onChange={handleChange} className="app-input" />
              </AppField>

              {/* Cover letter */}
              <AppField label="Cover Letter" name="coverLetter">
                <textarea id={`coverLetter-${job.id}`} name="coverLetter" rows={4}
                  value={form.coverLetter} onChange={handleChange}
                  className="app-input resize-none" />
              </AppField>

              {/* Resume */}
              <AppField label="Resume" name="resume">
                <input
                  type="file"
                  id={`resume-${job.id}`}
                  name="resume"
                  accept=".pdf,application/pdf"
                  onChange={handleFile}
                  className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white file:cursor-pointer"
                  style={{
                    color: "rgba(26,26,26,0.6)",
                    // file button colour via CSS custom property isn't supported inline; use style tag below
                  }}
                />
                <p className="mt-1 text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>
                  PDF only
                </p>
              </AppField>

              {formError && (
                <p className="text-sm" style={{ color: "#DC2626" }}>{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 focus:outline-none"
                style={{ backgroundColor: C.brightGreen }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Input + file button styles */}
      <style>{`
        .app-input {
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
        .app-input:focus {
          border-color: ${C.elecBlue};
          box-shadow: 0 0 0 3px rgba(26,109,181,0.15);
        }
        input[type="file"]::file-selector-button {
          background-color: ${C.elecBlue};
        }
      `}</style>
    </div>
  );
}

/* ── AppField ─────────────────────────────────────────────────────────────── */

function AppField({
  label,
  name,
  required = false,
  children,
}: {
  label:     string;
  name:      string;
  required?: boolean;
  children:  React.ReactNode;
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

/* ── Loading skeleton ─────────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
      {[1, 2].map((n) => (
        <div key={n} className="animate-pulse rounded-xl bg-white p-7 shadow-sm">
          <div className="mb-3 h-5 w-3/4 rounded" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
          <div className="mb-6 flex gap-4">
            <div className="h-4 w-28 rounded" style={{ backgroundColor: "rgba(0,0,0,0.06)" }} />
            <div className="h-4 w-40 rounded" style={{ backgroundColor: "rgba(0,0,0,0.06)" }} />
          </div>
          <div className="h-9 w-28 rounded-md" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
        </div>
      ))}
    </div>
  );
}
