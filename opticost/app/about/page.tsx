import Navbar from "../components/Navbar";

export const metadata = {
  title: "About | OptiCost Consulting",
  description:
    "OptiCost Consulting is a specialist advisory firm delivering defensible cost and financial insights across government and Defence programs.",
};

/* ── Brand tokens (inline styles where Tailwind arbitrary values are verbose) */
const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  heroDark:    "#0D0D0D",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.brandBg, color: C.bodyLight }}>
      <Navbar />

      {/* ══════════════════════════════════════════════
          1. HERO SECTION — dark background, full width
         ══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: C.heroDark }}
      >
        {/* Subtle blue glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(26,109,181,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            {/* Green accent rule */}
            <div
              className="mb-8 h-1 w-14 rounded-full"
              style={{ backgroundColor: C.brightGreen }}
            />

            <h1
              className="mb-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]"
              style={{ color: "#FFFFFF" }}
            >
              Delivering trusted cost and financial insights to support
              capability investment decisions with confidence.
            </h1>

            <p className="text-lg leading-relaxed sm:text-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
              OptiCost Consulting is a specialist advisory firm focused on
              optimising costs and maximising value across complex government and
              Defence programs. We provide defensible, audit-ready financial
              insights that enable confident decision-making across the full
              capability lifecycle.
            </p>
          </div>
        </div>

        {/* Green bottom accent line */}
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ══════════════════════════════════════════════
          2. ABOUT US — Corporate Profile (light bg)
         ══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.brandBg }}>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          {/* Section label */}
          <div className="mb-12">
            <span
              className="mb-3 inline-block text-xs font-bold uppercase tracking-widest"
              style={{ color: C.brightGreen }}
            >
              Corporate Profile
            </span>
            <h2
              className="text-3xl font-bold leading-snug sm:text-4xl"
              style={{ color: C.deepNavy }}
            >
              About Us
            </h2>
            <div
              className="mt-4 h-1 w-12 rounded-full"
              style={{ backgroundColor: C.elecBlue }}
            />
          </div>

          {/* Two-column layout */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left — body copy */}
            <div className="space-y-5 text-base leading-8" style={{ color: C.bodyLight }}>
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

            {/* Right — mission callout */}
            <div className="flex items-start">
              <div
                className="w-full rounded-2xl p-8 lg:p-10"
                style={{ backgroundColor: C.deepNavy }}
              >
                <div
                  className="mb-5 h-1 w-10 rounded-full"
                  style={{ backgroundColor: C.brightGreen }}
                />
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: C.brightGreen }}
                >
                  Our Mission
                </p>
                <blockquote
                  className="text-xl font-semibold leading-relaxed sm:text-2xl"
                  style={{ color: "#FFFFFF" }}
                >
                  Maximise value by optimising costs, strengthening financial
                  discipline, and enabling better investment decisions.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. STATS BAR — deep navy, full width
         ══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.deepNavy }}>
        {/* Top green accent */}
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-px sm:grid-cols-3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>

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

        {/* Bottom green accent */}
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

/* ── StatBlock ──────────────────────────────────────────────────────────── */

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
