import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Our People | OptiCost Consulting",
  description:
    "Senior Defence and public sector finance professionals with decades of real-world experience.",
};

const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

/* ── Team data ────────────────────────────────────────────────────────────── */

const team = [
  {
    name:     "Shiva Sapkota",
    initials: "SS",
    title:    "Principal Consultant (Commercial Finance)",
    bio:      "A senior commercial finance leader with 20+ years of experience across Defence, ATO, NSW Transport, and Treasury.",
    bullets:  [
      "Expert in costing, pricing, and financial modelling for multi-billion-dollar programs",
      "Proven leadership in commercial reform and operating model transformation",
      "Deep expertise in Defence tools: ACEIT, CCT, ClearCost, SAP, Oracle",
    ],
    tagline: "Leads complex procurement and capability costing engagements.",
  },
  {
    name:     "Ramesh Pudasaini",
    initials: "RP",
    title:    "Principal Consultant (Financial Management)",
    bio:      "A highly experienced financial management specialist with over 25 years across public sector and Big4 consulting.",
    bullets:  [
      "Expertise in budgeting, audit, and financial operations",
      "Strong track record supporting Defence and Home Affairs programs",
      "Experience in end-to-end financial management and governance",
    ],
    tagline: "Drives financial discipline and operational excellence.",
  },
  {
    name:     "Vijay Kansal",
    initials: "VK",
    title:    "Senior Consultant (Systems & Process)",
    bio:      "A transformation-focused finance professional with deep experience in systems and process optimisation.",
    bullets:  [
      "Specialist in business transformation and finance operations",
      "Strong capability in ERP systems and process improvement",
      "Experience across APS and private sector",
    ],
    tagline: "Enhances efficiency and financial system performance.",
  },
  {
    name:     "Anuj Joshi",
    initials: "AJ",
    title:    "Senior Consultant (Audit & Compliance)",
    bio:      "A strategic finance and audit professional with experience across ANAO, NACC, and international organisations.",
    bullets:  [
      "Expertise in audit, compliance, and PGPA framework",
      "Strong experience in executive financial reporting and analysis",
      "Proven leadership in complex audit engagements",
    ],
    tagline: "Ensures compliance, assurance, and financial integrity.",
  },
] as const;

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PeoplePage() {
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
              Our People
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              Senior Defence and public sector finance professionals with decades
              of real-world experience.
            </p>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ══════════════════════════════
          2. TEAM CARDS
         ══════════════════════════════ */}
      <section style={{ backgroundColor: C.brandBg }}>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="mb-14">
            <span
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest"
              style={{ color: C.brightGreen }}
            >
              The Team
            </span>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              Meet Our Consultants
            </h2>
            <div
              className="mt-4 h-1 w-12 rounded-full"
              style={{ backgroundColor: C.elecBlue }}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {team.map((member) => (
              <PersonCard key={member.name} {...member} />
            ))}
          </div>
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
            Work with Australia&rsquo;s leading Defence finance specialists.
          </h2>
          <p
            className="mx-auto mb-10 max-w-xl text-lg"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            Our team brings unmatched depth across government, Defence, and
            public sector finance.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md px-8 py-4 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.brightGreen }}
          >
            Get in Touch
          </Link>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

/* ── PersonCard ───────────────────────────────────────────────────────────── */

function PersonCard({
  name,
  initials,
  title,
  bio,
  bullets,
  tagline,
}: {
  name:     string;
  initials: string;
  title:    string;
  bio:      string;
  bullets:  readonly string[];
  tagline:  string;
}) {
  return (
    <div
      className="flex flex-col rounded-xl bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderTop: `4px solid ${C.brightGreen}` }}
    >
      {/* Avatar + name/title row */}
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ backgroundColor: C.elecBlue }}
        >
          {initials}
        </div>
        <div>
          <p
            className="text-base font-bold leading-tight"
            style={{ color: C.deepNavy }}
          >
            {name}
          </p>
          <p
            className="mt-0.5 text-sm font-medium"
            style={{ color: C.elecBlue }}
          >
            {title}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p
        className="mb-5 text-sm leading-7"
        style={{ color: C.bodyLight }}
      >
        {bio}
      </p>

      {/* Bullets */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-sm leading-6"
            style={{ color: C.bodyLight }}
          >
            <span
              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: C.brightGreen }}
            />
            {b}
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div
        className="mb-4 h-px w-full"
        style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
      />

      {/* Tagline */}
      <p
        className="text-sm font-medium italic"
        style={{ color: C.brightGreen }}
      >
        {tagline}
      </p>
    </div>
  );
}
