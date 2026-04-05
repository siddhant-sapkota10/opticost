"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "./components/Navbar";

/* ── Brand ───────────────────────────────────────────────────────────────── */

const C = {
  deepNavy:    "#0A1628",
  elecBlue:    "#1A6DB5",
  brightGreen: "#4DC92F",
  brandBg:     "#F5F7FA",
  bodyLight:   "#1A1A1A",
} as const;

/* ── Slides ───────────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    headline: "Optimising Costs. Maximising Value.",
    sub:      "Delivering trusted financial insights to support capability investment decisions with confidence.",
    cta:      "Our Services →",
    href:     "/services",
    bg:       "slide-bg-1",
  },
  {
    headline: "Defence & Government Finance Specialists.",
    sub:      "Audit-ready, defensible financial advisory across the full capability lifecycle.",
    cta:      "About Us →",
    href:     "/about",
    bg:       "slide-bg-2",
  },
  {
    headline: "Join Australia's Leading Finance Advisory Team.",
    sub:      "We are always looking for exceptional finance talent to help us deliver world-class results.",
    cta:      "View Opportunities →",
    href:     "/careers",
    bg:       "slide-bg-3",
  },
] as const;

/* ── Capabilities ─────────────────────────────────────────────────────────── */

const CAPS = [
  "Financial Management & Control",
  "Capability Costing & Cost Modelling",
  "Commercial & Contract Financial Analysis",
  "ICT & Digital Cost Modelling",
  "Governance, Compliance & Assurance",
  "Transformation & Capability Uplift",
] as const;

/* ── Team ─────────────────────────────────────────────────────────────────── */

const TEAM = [
  { name: "Shiva Sapkota",    initials: "SS", title: "Principal Consultant (Commercial Finance)" },
  { name: "Ramesh Pudasaini", initials: "RP", title: "Principal Consultant (Financial Management)" },
  { name: "Vijay Kansal",     initials: "VK", title: "Senior Consultant (Systems & Process)" },
  { name: "Anuj Joshi",       initials: "AJ", title: "Senior Consultant (Audit & Compliance)" },
] as const;

/* ── Hook: scroll reveal ──────────────────────────────────────────────────── */

function useReveal(threshold = 0.12) {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Hook: count-up ──────────────────────────────────────────────────────── */

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  /* Scroll progress */
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setScrollPct(d.scrollTop / (d.scrollHeight - d.clientHeight) || 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Slideshow */
  const [slide,    setSlide]    = useState(0);
  const [entering, setEntering] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    setEntering(false);
    setTimeout(() => {
      setSlide(idx);
      setEntering(true);
    }, 80);
  }, []);

  const next = useCallback(() => goTo((slide + 1) % SLIDES.length), [slide, goTo]);
  const prev = useCallback(() => goTo((slide - 1 + SLIDES.length) % SLIDES.length), [slide, goTo]);

  useEffect(() => {
    timerRef.current = setTimeout(next, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [slide, next]);

  /* Sections */
  const splitRef = useReveal();
  const capsRef  = useReveal();
  const statsRef = useReveal();
  const teamRef  = useReveal();
  const ctaRef   = useReveal();
  const finalRef = useReveal();

  return (
    <>
      <div id="scroll-progress" style={{ transform: `scaleX(${scrollPct})` }} />

      <div className="min-h-screen" style={{ color: C.bodyLight }}>
        <Navbar />

        {/* ════════════════════════════════════════════════════
            SECTION 1 — HERO SLIDESHOW
           ════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ backgroundColor: C.deepNavy }}>

          {/* Slide backgrounds — stacked, current one visible */}
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 ${s.bg}`}
              style={{
                opacity:    i === slide ? 1 : 0,
                transition: "opacity 0.8s ease",
                zIndex:     0,
              }}
            >
              {/* Slide 2 geometric diamonds */}
              {i === 1 && (
                <div className="geo-wrap">
                  <div className="geo-diamond" />
                  <div className="geo-diamond" />
                  <div className="geo-diamond" />
                  <div className="geo-diamond" />
                </div>
              )}
            </div>
          ))}

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 z-[1]" style={{ background: "rgba(10,22,40,0.45)" }} />

          {/* Slide content */}
          <div className="relative z-[2] flex flex-1 items-center">
            <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-16">
              <div className={entering ? "slide-content-enter" : ""} key={slide}>
                <p
                  className="slide-headline mb-2 text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: C.brightGreen }}
                >
                  OptiCost Consulting
                </p>
                <h1
                  className="slide-headline mb-6 max-w-3xl leading-[1.07] tracking-[-0.025em]"
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize:   "clamp(2.2rem, 4.5vw, 3.8rem)",
                    fontWeight: 800,
                    color:      "#FFFFFF",
                  }}
                >
                  {SLIDES[slide].headline}
                </h1>
                <p
                  className="slide-sub mb-10 max-w-xl text-base leading-7 sm:text-lg"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {SLIDES[slide].sub}
                </p>
                <Link
                  href={SLIDES[slide].href}
                  className="slide-btn pill-btn pill-btn-white"
                >
                  {SLIDES[slide].cta}
                </Link>
              </div>
            </div>
          </div>

          {/* Arrow + dot controls */}
          <div className="relative z-[2] mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-10 lg:px-16">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`slide-dot ${i === slide ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            {/* Arrows */}
            <div className="flex gap-3">
              <button className="slide-arrow" onClick={prev} aria-label="Previous slide">
                <ChevronLeft size={20} />
              </button>
              <button className="slide-arrow" onClick={next} aria-label="Next slide">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 2 — SPLIT PANEL
           ════════════════════════════════════════════════════ */}
        <div ref={splitRef.ref} className="grid lg:grid-cols-2">

          {/* LEFT — Electric Blue */}
          <div
            className="flex flex-col justify-center px-10 py-20 lg:px-16 lg:py-28"
            style={{ backgroundColor: C.elecBlue }}
          >
            <div
              className={`reveal-left ${splitRef.visible ? "visible" : ""}`}
              style={{ transitionDelay: "0s" }}
            >
              <div className="mb-3 h-[3px] w-10 rounded-full bg-white/50" />
              <h2
                className="mb-8 text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Smart Advisory.{" "}
                <span style={{ color: "rgba(255,255,255,0.75)" }}>Driven by Results.</span>
              </h2>
              <Link href="/about" className="pill-btn pill-btn-white">
                GET TO KNOW US <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* RIGHT — Deep Navy + geo lines */}
          <div
            className="relative flex flex-col justify-center overflow-hidden px-10 py-20 lg:px-16 lg:py-28"
            style={{ backgroundColor: C.deepNavy }}
          >
            <div className="geo-lines">
              <div className="geo-line" />
              <div className="geo-line" />
              <div className="geo-line" />
            </div>
            <div
              className={`reveal relative z-10 space-y-5 text-base leading-8 ${splitRef.visible ? "visible" : ""}`}
              style={{ color: "rgba(255,255,255,0.72)", transitionDelay: "0.15s" }}
            >
              <p>
                OptiCost Consulting is a boutique advisory firm founded by senior Defence and
                public sector finance professionals with decades of experience across major
                Commonwealth programs.
              </p>
              <p>
                We deliver high-impact, practical financial advisory services without the overheads
                of large consulting firms. Our lean structure allows us to provide personalised,
                responsive, and outcome-focused support.
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>
                Our services focus on government, Defence, and regulated industries.
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — CORE CAPABILITIES
           ════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: C.brandBg }}>
          <div ref={capsRef.ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

            <div className={`reveal mb-2 ${capsRef.visible ? "visible" : ""}`}>
              <span
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: C.brightGreen }}
              >
                What We Do
              </span>
            </div>
            <h2
              className={`reveal mb-12 text-3xl font-bold sm:text-4xl ${capsRef.visible ? "visible" : ""}`}
              style={{ fontFamily: "var(--font-syne)", color: C.deepNavy, transitionDelay: "0.08s" }}
            >
              Core Capabilities
            </h2>

            <div>
              {CAPS.map((cap, i) => (
                <Link
                  key={cap}
                  href="/services"
                  className={`cap-row reveal ${capsRef.visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${0.1 + i * 0.07}s` }}
                >
                  <span className="cap-row-title">{cap}</span>
                  <span className="cap-arrow">
                    <ArrowRight size={16} style={{ color: C.brightGreen }} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 4 — STATS BAR
           ════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: C.deepNavy }}>
          <div className="h-[2px]" style={{ backgroundColor: C.brightGreen }} />
          <div ref={statsRef.ref} className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              style={{ "--tw-divide-opacity": "0.08", borderColor: "rgba(255,255,255,0.08)" } as React.CSSProperties}
            >
              <StatBlock num={100}  suffix="+" label="Combined Years of Experience" active={statsRef.visible} delay={0}    />
              <StatBlock text="$Bn+"             label="Programs Supported"           active={statsRef.visible} delay={150}  />
              <StatBlock num={6}    suffix=""  label="Core Service Capabilities"     active={statsRef.visible} delay={300}  />
            </div>
          </div>
          <div className="h-[2px]" style={{ backgroundColor: C.brightGreen }} />
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 5 — MEET THE TEAM
           ════════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div ref={teamRef.ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

            <div className={`reveal mb-2 text-center ${teamRef.visible ? "visible" : ""}`}>
              <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: C.brightGreen }}>
                Our People
              </span>
            </div>
            <h2
              className={`reveal mb-14 text-center text-3xl font-bold sm:text-4xl ${teamRef.visible ? "visible" : ""}`}
              style={{ fontFamily: "var(--font-syne)", color: C.deepNavy, transitionDelay: "0.08s" }}
            >
              Meet the Team
            </h2>

            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map(({ name, initials, title }, i) => (
                <div
                  key={name}
                  className={`team-card reveal flex flex-col items-center rounded-xl bg-white p-7 text-center shadow-sm ${teamRef.visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="avatar-ring mb-4">
                    <div
                      className="avatar-inner flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{ backgroundColor: C.elecBlue }}
                    >
                      {initials}
                    </div>
                  </div>
                  <p className="mb-1 text-base font-bold" style={{ fontFamily: "var(--font-syne)", color: C.deepNavy }}>
                    {name}
                  </p>
                  <p className="text-sm leading-snug" style={{ color: C.elecBlue }}>{title}</p>
                </div>
              ))}
            </div>

            <div className={`reveal text-center ${teamRef.visible ? "visible" : ""}`} style={{ transitionDelay: "0.5s" }}>
              <Link href="/people" className="pill-btn pill-btn-navy">
                MEET THE FULL TEAM <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 6 — CAREERS CTA PANEL
           ════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: C.deepNavy, minHeight: "480px" }}
        >
          {/* Animated diamond shapes */}
          <div className="pointer-events-none absolute inset-0">
            <div className="careers-diamond" />
            <div className="careers-diamond" />
            <div className="careers-diamond" />
            <div className="careers-diamond" />
            <div className="careers-diamond" />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(10,22,40,0.55)" }} />

          <div ref={ctaRef.ref} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-28 text-center lg:px-8">
            <h2
              className={`reveal mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl ${ctaRef.visible ? "visible" : ""}`}
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Together, the possibilities are endless.
            </h2>
            <p
              className={`reveal mb-10 text-base leading-7 sm:text-lg ${ctaRef.visible ? "visible" : ""}`}
              style={{ color: "rgba(255,255,255,0.68)", transitionDelay: "0.12s" }}
            >
              Does OptiCost sound like the right fit? View our current opportunities to learn more.
            </p>
            <div className={`reveal ${ctaRef.visible ? "visible" : ""}`} style={{ transitionDelay: "0.24s" }}>
              <Link href="/careers" className="pill-btn pill-btn-white">
                VIEW CURRENT OPPORTUNITIES <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 7 — FINAL CTA
           ════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: C.elecBlue }}>
          <div ref={finalRef.ref} className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24">
            <h2
              className={`reveal mb-4 text-3xl font-bold text-white sm:text-4xl ${finalRef.visible ? "visible" : ""}`}
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Ready to optimise your program costs?
            </h2>
            <p
              className={`reveal mx-auto mb-10 max-w-xl text-base leading-7 sm:text-lg ${finalRef.visible ? "visible" : ""}`}
              style={{ color: "rgba(255,255,255,0.78)", transitionDelay: "0.1s" }}
            >
              Get in touch with our team of Defence and government finance specialists.
            </p>
            <div className={`reveal ${finalRef.visible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <Link href="/contact" className="pill-btn pill-btn-white">
                CONTACT US <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

/* ── StatBlock ───────────────────────────────────────────────────────────── */

function StatBlock({
  num, suffix, text, label, active, delay,
}: {
  num?:    number;
  suffix?: string;
  text?:   string;
  label:   string;
  active:  boolean;
  delay:   number;
}) {
  const counted = useCountUp(num ?? 0, active);
  const display = text ?? `${counted}${suffix ?? ""}`;
  return (
    <div
      className="flex flex-col items-center py-12 text-center"
      style={{
        opacity:    active ? 1 : 0,
        transform:  active ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <span
        className="mb-3 text-5xl font-extrabold text-white sm:text-6xl"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        {display}
      </span>
      <span className="stat-label-shimmer text-xs font-bold uppercase tracking-[0.18em]" style={{ color: C.brightGreen }}>
        {label}
      </span>
    </div>
  );
}
