"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  FileText,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";

const C = {
  deepNavy: "#0A1628",
  elecBlue: "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg: "#F5F7FA",
  bodyLight: "#1A1A1A",
  mutedText: "#556070",
  white: "#FFFFFF",
} as const;

const slides = [
  {
    eyebrow: "Defence-Focused Advisory",
    title: "Delivering trusted cost and financial insights",
    text: "Supporting capability investment decisions with confidence through defensible, audit-ready financial analysis.",
  },
  {
    eyebrow: "Whole-of-Life Costing",
    title: "Optimising costs across complex programs",
    text: "From business cases to ongoing financial control, OptiCost helps clients maximise value and strengthen investment decisions.",
  },
  {
    eyebrow: "Governance & Assurance",
    title: "Built for highly governed environments",
    text: "We provide practical, high-impact support aligned to governance, compliance, and audit-ready delivery.",
  },
] as const;

const capabilities = [
  {
    icon: DollarSign,
    title: "Financial Management & Control",
    text: "Budgeting, forecasting, reporting, accruals, reconciliations, and financial governance that strengthen integrity and compliance.",
  },
  {
    icon: BarChart3,
    title: "Capability Costing & Cost Modelling",
    text: "Whole-of-life costing, scenario modelling, sensitivity analysis, and Defence-aligned estimates using tools such as CCT, ACEIT, and ClearCost.",
  },
  {
    icon: Briefcase,
    title: "Commercial & Contract Analysis",
    text: "Tender pricing, supplier proposal evaluation, contract change analysis, and value-for-money assessments for better commercial outcomes.",
  },
  {
    icon: Zap,
    title: "ICT & Digital Cost Modelling",
    text: "Cost clarity for enterprise ICT, cloud environments, infrastructure, and digital transformation initiatives.",
  },
  {
    icon: ShieldCheck,
    title: "Governance, Compliance & Assurance",
    text: "Risk, contingency, audit support, and financial framework compliance to keep operations controlled and defensible.",
  },
  {
    icon: Users,
    title: "Transformation & Capability Uplift",
    text: "Process improvement, APS coaching, financial playbooks, and knowledge transfer that leaves organisations stronger.",
  },
] as const;

const differentiators = [
  "Specialist Defence finance expertise",
  "Lean and agile delivery model",
  "Audit-ready, defensible outputs",
  "Whole-of-life costing capability",
  "Embedded APS capability transfer",
  "Experience across multi-billion-dollar programs",
] as const;

const services = [
  "Financial Baseline Establishment",
  "Budgeting & Monthly Reporting",
  "Forecasting & Estimates",
  "Contingency & Variance Management",
  "Commitment & PO Control",
  "Capitalisation & Asset Reporting",
  "Whole-of-Life Costing",
  "Financial Closure & Evaluation",
  "Governance & Compliance",
] as const;

const team = [
  {
    name: "Shiva Sapkota",
    role: "Principal Consultant (Commercial Finance)",
    initials: "SS",
    text: "Leads complex procurement, pricing, and capability costing engagements across major government and Defence programs.",
  },
  {
    name: "Ramesh Pudasaini",
    role: "Principal Consultant (Financial Management)",
    initials: "RP",
    text: "Brings deep expertise in budgeting, audit, governance, and end-to-end financial management.",
  },
  {
    name: "Vijay Kansal",
    role: "Senior Consultant (Systems & Process)",
    initials: "VK",
    text: "Focused on transformation, systems optimisation, ERP improvement, and stronger finance operations.",
  },
  {
    name: "Anuj Joshi",
    role: "Senior Consultant (Audit & Compliance)",
    initials: "AJ",
    text: "Provides assurance across audit, compliance, reporting, and financial integrity in complex environments.",
  },
] as const;

const approach = [
  {
    step: "Month 1",
    title: "Stabilise",
    text: "Validate financial baselines, reconcile commitments, and establish control over the current state.",
  },
  {
    step: "Month 2",
    title: "Embed",
    text: "Implement forecasting models, reporting rhythms, dashboards, and governance-aligned processes.",
  },
  {
    step: "Month 3",
    title: "Optimise",
    text: "Deliver sharper insights, risk visibility, and practical improvement recommendations for decision-makers.",
  },
] as const;

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentSlide = useMemo(() => slides[activeSlide], [activeSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: C.brandBg, color: C.bodyLight }}
    >
      <Navbar />

      {/* HERO */}
      <section
        className="relative isolate overflow-hidden"
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

        {mounted ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(77, 201, 47, 0.10)" }}
            animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(77, 201, 47, 0.10)" }}
          />
        )}

        {mounted ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(26, 109, 181, 0.18)" }}
            animate={{ y: [0, 24, 0], x: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(26, 109, 181, 0.18)" }}
          />
        )}

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center"
            >
              <HeroContent
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                currentSlide={currentSlide}
                prevSlide={prevSlide}
                nextSlide={nextSlide}
                mounted={mounted}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col justify-center" style={{ opacity: 1 }}>
              <HeroContent
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                currentSlide={currentSlide}
                prevSlide={prevSlide}
                nextSlide={nextSlide}
                mounted={mounted}
              />
            </div>
          )}

          {/* SLIDESHOW */}
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="relative flex items-center"
            >
              <SlideShowPanel
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                currentSlide={currentSlide}
                prevSlide={prevSlide}
                nextSlide={nextSlide}
                mounted={mounted}
              />
            </motion.div>
          ) : (
            <div className="relative flex items-center" style={{ opacity: 1 }}>
              <SlideShowPanel
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                currentSlide={currentSlide}
                prevSlide={prevSlide}
                nextSlide={nextSlide}
                mounted={mounted}
              />
            </div>
          )}
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* ABOUT */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <AboutContent />
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]" style={{ opacity: 1 }}>
              <AboutContent />
            </div>
          )}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-12"
            >
              <CapabilitiesHeader />
            </motion.div>
          ) : (
            <div className="mb-12" style={{ opacity: 1 }}>
              <CapabilitiesHeader />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item, index) => (
              mounted ? (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <CapabilityCard {...item} />
                </motion.div>
              ) : (
                <div key={item.title} style={{ opacity: 1 }}>
                  <CapabilityCard {...item} />
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: C.deepNavy }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 50%, rgba(77,201,47,0.12), transparent 22%), radial-gradient(circle at 85% 20%, rgba(26,109,181,0.18), transparent 25%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-12"
            >
              <ApproachHeader />
            </motion.div>
          ) : (
            <div className="mb-12" style={{ opacity: 1 }}>
              <ApproachHeader />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {approach.map((item, index) => (
              mounted ? (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-[28px] border p-7"
                  style={{
                    borderColor: "rgba(255,255,255,0.10)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <ApproachCard item={item} />
                </motion.div>
              ) : (
                <div
                  key={item.step}
                  className="relative rounded-[28px] border p-7"
                  style={{
                    opacity: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <ApproachCard item={item} />
                </div>
              )
            ))}
          </div>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>

      {/* DIFFERENTIATORS + SERVICES */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-[28px] border bg-white p-8 shadow-sm"
              style={{ borderColor: "rgba(10,22,40,0.07)" }}
            >
              <DifferentiatorsContent />
            </motion.div>
          ) : (
            <div
              className="rounded-[28px] border bg-white p-8 shadow-sm"
              style={{ opacity: 1, borderColor: "rgba(10,22,40,0.07)" }}
            >
              <DifferentiatorsContent />
            </div>
          )}

          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-[28px] border p-8 shadow-sm"
              style={{
                borderColor: "rgba(10,22,40,0.07)",
                background:
                  "linear-gradient(180deg, rgba(26,109,181,0.08) 0%, rgba(255,255,255,1) 100%)",
              }}
            >
              <ServicesContent />
            </motion.div>
          ) : (
            <div
              className="rounded-[28px] border p-8 shadow-sm"
              style={{
                opacity: 1,
                borderColor: "rgba(10,22,40,0.07)",
                background:
                  "linear-gradient(180deg, rgba(26,109,181,0.08) 0%, rgba(255,255,255,1) 100%)",
              }}
            >
              <ServicesContent />
            </div>
          )}
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-12"
            >
              <TeamHeader />
            </motion.div>
          ) : (
            <div className="mb-12" style={{ opacity: 1 }}>
              <TeamHeader />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              mounted ? (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-[24px] border bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                  style={{ borderColor: "rgba(10,22,40,0.07)" }}
                >
                  <TeamMemberContent member={member} />
                </motion.div>
              ) : (
                <div
                  key={member.name}
                  className="rounded-[24px] border bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                  style={{ opacity: 1, borderColor: "rgba(10,22,40,0.07)" }}
                >
                  <TeamMemberContent member={member} />
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: C.deepNavy }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(77,201,47,0.12), transparent 22%), radial-gradient(circle at 80% 40%, rgba(26,109,181,0.18), transparent 24%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-24">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <CtaContent />
            </motion.div>
          ) : (
            <div style={{ opacity: 1 }}>
              <CtaContent />
            </div>
          )}
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: C.brightGreen }} />
      </section>
    </div>
  );
}

/* ----------------------------- sub-components ----------------------------- */

type SlideType = typeof slides[number];

function HeroContent({
  activeSlide: _activeSlide,
  setActiveSlide: _setActiveSlide,
  currentSlide: _currentSlide,
  prevSlide: _prevSlide,
  nextSlide: _nextSlide,
  mounted: _mounted,
}: {
  activeSlide: number;
  setActiveSlide: (v: number) => void;
  currentSlide: SlideType;
  prevSlide: () => void;
  nextSlide: () => void;
  mounted: boolean;
}) {
  return (
    <>
      <div
        className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{
          borderColor: "rgba(255,255,255,0.14)",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: C.brightGreen,
        }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.brightGreen }} />
        OptiCost Consulting
      </div>

      <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
        Financial clarity for complex government and Defence programs
      </h1>

      <p
        className="mt-6 max-w-2xl text-base leading-8 sm:text-lg"
        style={{ color: "rgba(255,255,255,0.76)" }}
      >
        We deliver trusted cost, commercial, and financial insights that help
        organisations optimise costs, strengthen governance, and make confident
        capability investment decisions.
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

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="100+" label="Years combined experience" />
        <StatCard value="Defence" label="Focused, specialist advisory" />
        <StatCard value="End-to-End" label="Financial lifecycle support" />
      </div>
    </>
  );
}

function SlideShowPanel({
  activeSlide,
  setActiveSlide,
  currentSlide,
  prevSlide,
  nextSlide,
  mounted,
}: {
  activeSlide: number;
  setActiveSlide: (v: number) => void;
  currentSlide: SlideType;
  prevSlide: () => void;
  nextSlide: () => void;
  mounted: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[28px] border shadow-2xl"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="border-b px-6 py-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: C.brightGreen }}
            >
              Why OptiCost
            </p>
            <p className="mt-1 text-sm text-white/70">
              Specialist, governance-driven, forecast-focused support
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={prevSlide}
              className="rounded-full border p-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: C.white }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next slide"
              onClick={nextSlide}
              className="rounded-full border p-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: C.white }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[360px] p-6 sm:min-h-[390px] sm:p-8">
        {mounted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45 }}
              className="flex h-full flex-col"
            >
              <SlideContent
                currentSlide={currentSlide}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full flex-col" style={{ opacity: 1 }}>
            <SlideContent
              currentSlide={currentSlide}
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SlideContent({
  currentSlide,
  activeSlide,
  setActiveSlide,
}: {
  currentSlide: SlideType;
  activeSlide: number;
  setActiveSlide: (v: number) => void;
}) {
  return (
    <>
      <span
        className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
        style={{
          backgroundColor: "rgba(77,201,47,0.14)",
          color: C.brightGreen,
        }}
      >
        {currentSlide.eyebrow}
      </span>

      <h2 className="mt-5 max-w-lg text-3xl font-bold leading-tight text-white sm:text-4xl">
        {currentSlide.title}
      </h2>

      <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
        {currentSlide.text}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SlideMiniCard
          icon={ClipboardCheck}
          title="Audit-Ready Outputs"
          text="Clear, defensible, and compliant financial advice."
        />
        <SlideMiniCard
          icon={Target}
          title="Outcome-Focused Delivery"
          text="Practical insights without the overhead of large firms."
        />
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: activeSlide === index ? 34 : 10,
                backgroundColor:
                  activeSlide === index
                    ? C.brightGreen
                    : "rgba(255,255,255,0.20)",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function AboutContent() {
  return (
    <>
      <div
        className="rounded-[28px] border bg-white p-8 shadow-sm"
        style={{ borderColor: "rgba(10,22,40,0.07)" }}
      >
        <SectionEyebrow>About Us</SectionEyebrow>
        <h2
          className="mt-3 text-3xl font-bold sm:text-4xl"
          style={{ color: C.deepNavy }}
        >
          Boutique advisory. Senior expertise. Practical outcomes.
        </h2>
        <p className="mt-5 text-base leading-8" style={{ color: C.mutedText }}>
          OptiCost Consulting is a specialist advisory firm founded by senior
          Defence and public sector finance professionals. We support complex
          Commonwealth programs with high-impact, practical financial advice
          tailored to highly governed environments.
        </p>
        <p className="mt-4 text-base leading-8" style={{ color: C.mutedText }}>
          Our lean structure means clients get responsive support, direct access
          to senior expertise, and solutions focused on value, discipline, and
          better investment decisions.
        </p>
      </div>

      <div
        className="rounded-[28px] p-8 shadow-sm"
        style={{
          background: `linear-gradient(180deg, ${C.deepNavy} 0%, #102340 100%)`,
        }}
      >
        <SectionEyebrow light>Our Mission</SectionEyebrow>
        <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
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
              <CheckCircle2
                size={20}
                style={{ color: C.brightGreen }}
                className="mt-0.5 shrink-0"
              />
              <p className="text-sm leading-7 text-white/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CapabilitiesHeader() {
  return (
    <>
      <SectionEyebrow>Core Capabilities</SectionEyebrow>
      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: C.deepNavy }}
          >
            Specialist services across the full financial lifecycle
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8" style={{ color: C.mutedText }}>
            We combine financial control, costing, commercial analysis, assurance,
            and transformation support to help clients stay forecast-accurate,
            compliant, and decision-ready.
          </p>
        </div>
      </div>
    </>
  );
}

function ApproachHeader() {
  return (
    <>
      <SectionEyebrow light>Delivery Approach</SectionEyebrow>
      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Governance-driven. Forecast-focused. Risk-aware.
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-white/72">
        OptiCost delivers a financial management model designed for complex
        Defence environments, with strong governance, early risk visibility,
        scalable delivery, and embedded capability uplift.
      </p>
    </>
  );
}

function ApproachCard({ item }: { item: typeof approach[number] }) {
  return (
    <>
      <div
        className="mb-5 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
        style={{
          backgroundColor: "rgba(77,201,47,0.16)",
          color: C.brightGreen,
        }}
      >
        {item.step}
      </div>
      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-white/74">{item.text}</p>
    </>
  );
}

function DifferentiatorsContent() {
  return (
    <>
      <SectionEyebrow>Why OptiCost</SectionEyebrow>
      <h2
        className="mt-3 text-3xl font-bold sm:text-4xl"
        style={{ color: C.deepNavy }}
      >
        Differentiators that matter in complex environments
      </h2>
      <div className="mt-8 grid gap-4">
        {differentiators.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <CheckCircle2
              size={20}
              style={{ color: C.brightGreen }}
              className="mt-0.5 shrink-0"
            />
            <p className="text-sm leading-7" style={{ color: C.bodyLight }}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function ServicesContent() {
  return (
    <>
      <SectionEyebrow>Services Snapshot</SectionEyebrow>
      <h2
        className="mt-3 text-3xl font-bold sm:text-4xl"
        style={{ color: C.deepNavy }}
      >
        End-to-end financial control from initiation to closure
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {services.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3"
            style={{ borderColor: "rgba(10,22,40,0.07)" }}
          >
            <FileText size={18} style={{ color: C.elecBlue }} />
            <span className="text-sm font-medium" style={{ color: C.bodyLight }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function TeamHeader() {
  return (
    <>
      <SectionEyebrow>Our People</SectionEyebrow>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: C.deepNavy }}
          >
            Senior consultants with real-world public sector experience
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8" style={{ color: C.mutedText }}>
            Our team combines technical depth, leadership experience, and
            practical delivery capability across Defence and broader government.
          </p>
        </div>

        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: C.elecBlue }}
        >
          View full team
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}

function TeamMemberContent({ member }: { member: typeof team[number] }) {
  return (
    <>
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: C.elecBlue }}
        >
          {member.initials}
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: C.deepNavy }}>
            {member.name}
          </p>
          <p className="text-sm" style={{ color: C.elecBlue }}>
            {member.role}
          </p>
        </div>
      </div>
      <p className="text-sm leading-7" style={{ color: C.mutedText }}>
        {member.text}
      </p>
    </>
  );
}

function CtaContent() {
  return (
    <>
      <SectionEyebrow light>Trusted Partner</SectionEyebrow>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        Clarity, control, and confidence in financial decision-making
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/74 sm:text-lg">
        OptiCost Consulting combines deep technical expertise, senior
        leadership, and practical delivery experience to support complex
        programs with strong governance, accurate forecasting, and sustainable
        capability uplift.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
          style={{ backgroundColor: C.brightGreen }}
        >
          Talk to Us
          <ArrowRight size={18} />
        </Link>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300 hover:bg-white/5"
          style={{
            borderColor: "rgba(255,255,255,0.16)",
            color: C.white,
          }}
        >
          Explore Services
        </Link>
      </div>
    </>
  );
}

/* ----------------------------- helpers ----------------------------- */

function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-[0.22em]"
      style={{ color: light ? C.brightGreen : C.elecBlue }}
    >
      {children}
    </span>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl border px-5 py-4"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm leading-6 text-white/68">{label}</p>
    </div>
  );
}

function SlideMiniCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  text: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="rounded-xl p-2"
          style={{ backgroundColor: "rgba(77,201,47,0.14)" }}
        >
          <Icon size={18} style={{ color: C.brightGreen }} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-white/68">{text}</p>
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  text: string;
}) {
  return (
    <div
      className="group h-full rounded-[26px] border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(10,22,40,0.07)" }}
    >
      <div
        className="mb-5 inline-flex rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: "rgba(26,109,181,0.08)" }}
      >
        <Icon size={22} style={{ color: C.elecBlue }} />
      </div>
      <h3 className="text-xl font-bold leading-snug" style={{ color: C.deepNavy }}>
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7" style={{ color: C.mutedText }}>
        {text}
      </p>
    </div>
  );
}
