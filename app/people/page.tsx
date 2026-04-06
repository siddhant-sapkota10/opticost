import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, ExternalLink } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Navbar from "../components/Navbar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our People | OptiCost Consulting",
  description:
    "Senior Defence and public sector finance professionals with decades of real-world experience.",
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

export default async function PeoplePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("people")
    .select("id, name, role, bio, email, linkedin_url, photo_url")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const team: PersonRow[] = (data ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    role: (p.role as string) ?? "",
    bio: (p.bio as string) ?? "",
    email: (p.email as string) ?? "",
    linkedin_url: (p.linkedin_url as string) ?? "",
    photo_url: (p.photo_url as string) ?? "",
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
          <div className="max-w-3xl">
            <div
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: C.brightGreen,
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.brightGreen }} />
              Our People
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Senior consultants with real-world public sector experience
            </h1>

            <p
              className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              Our team brings deep expertise across Defence, government, audit,
              commercial finance, financial management, and transformation —
              delivering practical advice grounded in real-world experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: C.brightGreen }}
              >
                Get in Touch
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: C.white,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* TEAM CARDS */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: C.elecBlue }}
            >
              The Team
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: C.deepNavy }}>
              Meet our consultants
            </h2>
            <p
              className="mt-4 max-w-3xl text-base leading-8"
              style={{ color: C.mutedText }}
            >
              OptiCost Consulting is built around senior practitioners who bring
              commercial judgement, technical depth, and practical delivery
              capability across complex public sector and Defence environments.
            </p>
          </div>

          {team.length === 0 ? (
            <p className="text-sm" style={{ color: C.mutedText }}>
              Team profiles coming soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {team.map((member) => (
                <PersonCard key={member.id} {...member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.deepNavy }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(77,201,47,0.12), transparent 22%), radial-gradient(circle at 80% 40%, rgba(26,109,181,0.18), transparent 24%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Work with Australia's leading Defence finance specialists
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Our team combines technical expertise, leadership experience, and
            strong public sector understanding to support high-stakes programs
            with clarity and confidence.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: C.brightGreen }}
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
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
