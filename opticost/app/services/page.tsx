import Link from "next/link";
import {
  BarChart2,
  Calculator,
  FileSearch,
  Monitor,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Services | OptiCost Consulting",
  description:
    "Specialist financial advisory services for government and Defence programs — costing, financial management, commercial analysis and more.",
};

/* ── Brand tokens ─────────────────────────────────────────────────────────── */

const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

/* ── Service data ─────────────────────────────────────────────────────────── */

const services = [
  {
    Icon: BarChart2,
    title: "Financial Management & Control",
    bullets: [
      "Budgeting, forecasting, and financial reporting",
      "Financial baseline development and validation",
      "Monthly control, accruals, and reconciliation",
      "Audit-ready financial governance",
    ],
    tagline:
      "Ensuring financial integrity, transparency, and compliance at all stages.",
  },
  {
    Icon: Calculator,
    title: "Capability Costing & Cost Modelling",
    bullets: [
      "Whole-of-life cost modelling",
      "Investment and business case costing",
      "Scenario modelling and sensitivity analysis",
      "Defence-compliant costing (CCT, ACEIT, ClearCost)",
    ],
    tagline:
      "Delivering robust, defensible cost estimates for major investment decisions.",
  },
  {
    Icon: FileSearch,
    title: "Commercial & Contract Financial Analysis",
    bullets: [
      "Tender pricing (ASDEFCON-aligned)",
      "Supplier proposal evaluation",
      "Contract change and cost claim analysis",
      "Value-for-money assessments",
    ],
    tagline:
      "Supporting smarter procurement and stronger commercial outcomes.",
  },
  {
    Icon: Monitor,
    title: "ICT & Digital Cost Modelling",
    bullets: [
      "Enterprise ICT service costing",
      "Cloud and infrastructure modelling",
      "Digital transformation cost analysis",
    ],
    tagline: "Enabling cost clarity in complex technology environments.",
  },
  {
    Icon: ShieldCheck,
    title: "Governance, Compliance & Assurance",
    bullets: [
      "DPAM and Defence Financial Framework compliance",
      "Financial risk and contingency management",
      "Audit support and financial assurance",
    ],
    tagline:
      "Maintaining audit-ready and compliant financial operations.",
  },
  {
    Icon: TrendingUp,
    title: "Transformation & Capability Uplift",
    bullets: [
      "Financial process improvement",
      "APS coaching and knowledge transfer",
      "Development of financial playbooks",
    ],
    tagline: "Leaving organisations stronger, not dependent.",
  },
] as const;

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.brandBg, color: C.bodyLight }}>
      <Navbar />

      {/* ══════════════════════════════
          1. HERO
         ══════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.deepNavy }}>
        {/* Subtle blue radial glow — matches About hero */}
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
              Core Capabilities
            </h1>
            <p className="text-lg sm:text-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              Specialist financial advisory services for government and Defence
              programs.
            </p>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ══════════════════════════════
          2. SERVICES GRID
         ══════════════════════════════ */}
      <section style={{ backgroundColor: C.brandBg }}>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          {/* Section label */}
          <div className="mb-14">
            <span
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest"
              style={{ color: C.brightGreen }}
            >
              What We Do
            </span>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              Our Services
            </h2>
            <div
              className="mt-4 h-1 w-12 rounded-full"
              style={{ backgroundColor: C.elecBlue }}
            />
          </div>

          {/* 2-col grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {services.map((svc) => (
              <ServiceCard key={svc.title} {...svc} />
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
            Ready to optimise your program costs?
          </h2>
          <p
            className="mx-auto mb-10 max-w-xl text-lg"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            Get in touch with our team of Defence and government finance
            specialists.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md px-8 py-4 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: C.brightGreen }}
          >
            Contact Us
          </Link>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

/* ── ServiceCard ──────────────────────────────────────────────────────────── */

function ServiceCard({
  Icon,
  title,
  bullets,
  tagline,
}: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  title: string;
  bullets: readonly string[];
  tagline: string;
}) {
  return (
    <div
      className="flex flex-col rounded-xl bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderLeft: `4px solid ${C.brightGreen}` }}
    >
      {/* Icon */}
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ backgroundColor: "rgba(77,201,47,0.10)" }}
      >
        <Icon size={22} strokeWidth={1.75} style={{ color: C.brightGreen }} />
      </div>

      {/* Title */}
      <h3
        className="mb-4 text-lg font-bold leading-snug"
        style={{ color: C.elecBlue }}
      >
        {title}
      </h3>

      {/* Bullet list */}
      <ul className="mb-6 flex-1 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm leading-6" style={{ color: C.bodyLight }}>
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
      <p className="text-sm italic" style={{ color: "rgba(26,26,26,0.55)" }}>
        {tagline}
      </p>
    </div>
  );
}
