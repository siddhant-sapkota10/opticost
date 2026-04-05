"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* 🔥 slightly taller navbar */}
        <div className="flex h-[88px] items-center justify-between">

          {/* 🔥 LOGO (PERFECT SIZE NOW) */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="OptiCost Consulting"
              width={240}
              height={80}
              className="h-[72px] w-auto object-contain" // 👈 THIS IS THE SWEET SPOT
              priority
            />
          </Link>

          {/* 💻 DESKTOP */}
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

            {/* CTA */}
            <Link
              href="/contact"
              className="ml-2 inline-flex items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "#4DC92F" }}
            >
              Get in Touch
            </Link>
          </div>

          {/* 📱 MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
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

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 text-center rounded-xl px-5 py-3 font-bold text-white"
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