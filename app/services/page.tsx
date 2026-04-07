import Link from "next/link";
import {
  BarChart2,
  Calculator,
  FileSearch,
  Monitor,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Services",
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

export default function ServicesPage() {
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
              Our Services
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Specialist services across the full financial lifecycle
            </h1>

            <p
              className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              OptiCost Consulting provides specialist financial advisory support
              for government and Defence programs, spanning costing, commercial
              analysis, financial control, governance, and capability uplift.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: C.brightGreen }}
              >
                Contact Us
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/people"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: C.white,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* SERVICES GRID */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: C.elecBlue }}
            >
              What We Do
            </span>

            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              Core capabilities built for complex environments
            </h2>

            <p
              className="mt-4 max-w-3xl text-base leading-8"
              style={{ color: C.mutedText }}
            >
              We combine practical financial delivery with specialist Defence
              and government expertise to help organisations improve cost
              visibility, strengthen governance, and make confident investment
              decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((svc) => (
              <ServiceCard key={svc.title} {...svc} />
            ))}
          </div>
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

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to optimise your program costs?
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Get in touch with our team of Defence and government finance
            specialists for practical, governance-aligned support.
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

function ServiceCard({
  Icon,
  title,
  bullets,
  tagline,
}: {
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  title: string;
  bullets: readonly string[];
  tagline: string;
}) {
  return (
    <div
      className="group h-full rounded-[26px] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
      style={{ borderColor: "rgba(10,22,40,0.07)" }}
    >
      <div
        className="mb-5 inline-flex rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: "rgba(26,109,181,0.08)" }}
      >
        <Icon size={22} strokeWidth={1.75} style={{ color: C.elecBlue }} />
      </div>

      <h3
        className="text-xl font-bold leading-snug"
        style={{ color: C.deepNavy }}
      >
        {title}
      </h3>

      <ul className="mt-5 mb-6 flex-1 space-y-2">
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

      <div
        className="mb-4 h-px w-full"
        style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
      />

      <p className="text-sm italic" style={{ color: "rgba(26,26,26,0.55)" }}>
        {tagline}
      </p>
    </div>
  );
}
