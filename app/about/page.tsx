import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";

export const metadata = {
  title: "About | OptiCost Consulting",
  description:
    "OptiCost Consulting is a specialist advisory firm delivering defensible cost and financial insights across government and Defence programs.",
};

const C = {
  deepNavy: "#0A1628",
  elecBlue: "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg: "#F5F7FA",
  bodyLight: "#1A1A1A",
  mutedText: "#556070",
  white: "#FFFFFF",
} as const;

type PersonRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin_url: string;
  photo_url: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function AboutPage() {
  const cookieStore = await cookies();
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("people")
    .select("id, name, role, bio, email, linkedin_url, photo_url")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const team: PersonRow[] = (data ?? []).map((person) => ({
    id: person.id as string,
    name: person.name as string,
    role: (person.role as string) ?? "",
    bio: (person.bio as string) ?? "",
    email: (person.email as string) ?? "",
    linkedin_url: (person.linkedin_url as string) ?? "",
    photo_url: (person.photo_url as string) ?? "",
  }));

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
          <div className="max-w-4xl">
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
              About OptiCost
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Delivering trusted cost and financial insights for complex government and Defence programs
            </h1>

            <p
              className="mt-6 max-w-3xl text-base leading-8 sm:text-lg"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              OptiCost Consulting is a specialist advisory firm focused on
              optimising costs, strengthening financial discipline, and
              supporting confident investment decisions across the full
              capability lifecycle.
            </p>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ABOUT US */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: C.elecBlue }}
            >
              Corporate Profile
            </span>

            <h2
              className="mt-3 text-3xl font-bold leading-snug sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              About us
            </h2>

            <p
              className="mt-4 max-w-3xl text-base leading-8"
              style={{ color: C.mutedText }}
            >
              A boutique advisory firm founded by senior public sector finance
              professionals, bringing practical expertise without the overheads
              of large consulting firms.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div
              className="rounded-[28px] border bg-white p-6 shadow-sm sm:p-8"
              style={{ borderColor: "rgba(10,22,40,0.07)" }}
            >
              <h3
                className="text-2xl font-bold sm:text-3xl"
                style={{ color: C.deepNavy }}
              >
                Senior expertise. Lean delivery. Practical outcomes.
              </h3>

              <div
                className="mt-6 space-y-5 text-base leading-8"
                style={{ color: C.bodyLight }}
              >
                <p>
                  OptiCost Consulting is a boutique advisory firm founded by
                  senior Defence and public sector finance professionals with
                  decades of experience across major Commonwealth programs.
                </p>
                <p>
                  We specialise in delivering high-impact, practical financial
                  advisory services without the overheads of large consulting
                  firms. Our lean structure allows us to provide personalised,
                  responsive, and outcome-focused support to clients operating in
                  complex and highly governed environments.
                </p>
                <p>
                  With over 100 years of combined experience, our team has
                  successfully supported multi-billion-dollar programs across
                  Defence, Treasury, Transport, and other APS agencies.
                </p>
              </div>
            </div>

            <div
              className="rounded-[28px] p-6 shadow-sm sm:p-8"
              style={{
                background: `linear-gradient(180deg, ${C.deepNavy} 0%, #102340 100%)`,
              }}
            >
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: C.brightGreen }}
              >
                Our Mission
              </span>

              <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                Maximise value by optimising costs and strengthening financial discipline
              </h3>

              <div className="mt-8 space-y-4">
                {[
                  "Defensible financial insight",
                  "Governance-aligned delivery",
                  "Forecast-focused decision support",
                  "Capability uplift, not dependency",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border p-4"
                    style={{
                      borderColor: "rgba(255,255,255,0.10)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <span
                      className="mt-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: C.brightGreen }}
                    />
                    <p className="text-sm leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: C.elecBlue }}
              >
                The Team
              </span>
              <h2
                className="mt-3 text-3xl font-bold leading-snug sm:text-4xl"
                style={{ color: C.deepNavy }}
              >
                Meet the people behind OptiCost
              </h2>
              <p
                className="mt-4 max-w-3xl text-base leading-8"
                style={{ color: C.mutedText }}
              >
                This section is sourced directly from our live People database, so the About page
                always reflects the current team.
              </p>
            </div>

            <Link
              href="/people"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: C.brightGreen }}
            >
              View all people
              <ArrowRight size={16} />
            </Link>
          </div>

          {team.length === 0 ? (
            <div
              className="rounded-[28px] border border-dashed px-8 py-14 text-center"
              style={{ borderColor: "rgba(26,109,181,0.25)" }}
            >
              <p className="text-sm" style={{ color: C.mutedText }}>
                Team profiles will appear here once they are added in People.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {team.map((member) => (
                <PersonCard key={member.id} {...member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS BAR */}
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

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div
            className="grid gap-px md:grid-cols-3"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <StatBlock
              value="100+"
              label="Years"
              sub="Combined Experience"
              green={C.brightGreen}
            />
            <StatBlock
              value="Multi-Billion Dollar"
              label="Programs"
              sub="Supported"
              green={C.brightGreen}
            />
            <StatBlock
              value="Defence, Treasury, Transport & APS"
              label="Agencies"
              sub="Served"
              green={C.brightGreen}
            />
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

function PersonCard({ name, role, bio, email, linkedin_url, photo_url }: PersonRow) {
  return (
    <div
      className="group h-full rounded-[26px] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
      style={{ borderColor: "rgba(10,22,40,0.07)" }}
    >
      <div className="mb-5 flex items-start gap-4">
        {photo_url ? (
          <Image
            src={photo_url}
            alt={name}
            width={56}
            height={56}
            className="rounded-full object-cover"
            style={{ width: 56, height: 56, flexShrink: 0 }}
          />
        ) : (
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
            style={{ backgroundColor: C.elecBlue }}
          >
            {initials(name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-base font-bold leading-tight" style={{ color: C.deepNavy }}>
            {name}
          </p>
          <p className="mt-0.5 text-sm font-medium" style={{ color: C.elecBlue }}>
            {role}
          </p>
        </div>
      </div>

      {bio && (
        <p className="mb-5 text-sm leading-7" style={{ color: C.bodyLight }}>
          {bio}
        </p>
      )}

      {(email || linkedin_url) && (
        <>
          <div className="mb-4 h-px w-full" style={{ backgroundColor: "rgba(0,0,0,0.07)" }} />
          <div className="flex flex-wrap items-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex max-w-full items-center gap-1.5 break-all text-xs font-medium transition-colors hover:underline"
                style={{ color: C.elecBlue }}
              >
                <Mail size={13} />
                {email}
              </a>
            )}
            {linkedin_url && (
              <a
                href={linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
                style={{ color: C.elecBlue }}
              >
                <ExternalLink size={13} />
                LinkedIn
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatBlock({
  value,
  label,
  sub,
  green,
}: {
  value: string;
  label: string;
  sub: string;
  green: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 px-8 py-12 text-center"
      style={{ backgroundColor: "#0A1628" }}
    >
      <p
        className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        style={{ color: green }}
      >
        {value}
      </p>
      <p className="text-lg font-bold text-white">{label}</p>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
        {sub}
      </p>
    </div>
  );
}
