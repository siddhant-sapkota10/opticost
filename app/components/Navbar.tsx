"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/people", label: "People" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isUserRole = user?.user_metadata?.role === "user";
  const portalHref = isUserRole ? "/portal" : "/admin/jobs";
  const portalLabel = isUserRole ? "My Portal" : "Admin";

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "rgba(10, 22, 40, 0.95)"
          : "rgba(10, 22, 40, 0.6)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[88px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="OptiCost Consulting"
              width={240}
              height={80}
              className="h-[72px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold tracking-wide transition-all duration-300 hover:text-white"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth button */}
            {user ? (
              <Link
                href={portalHref}
                className="ml-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(77,201,47,0.12)",
                  border: "1px solid rgba(77,201,47,0.30)",
                  color: "#4DC92F",
                }}
              >
                <User size={14} />
                {portalLabel}
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <User size={14} />
                Sign In
              </Link>
            )}

            {/* Get in Touch CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "#4DC92F" }}
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A1628] border-t border-white/10">
          <div className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth link mobile */}
            {user ? (
              <Link
                href={portalHref}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
                style={{
                  backgroundColor: "rgba(77,201,47,0.12)",
                  border: "1px solid rgba(77,201,47,0.25)",
                  color: "#4DC92F",
                }}
              >
                <User size={14} />
                {portalLabel}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <User size={14} />
                Sign In
              </Link>
            )}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 text-center rounded-xl px-5 py-3 font-bold text-white"
              style={{ backgroundColor: "#4DC92F" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
