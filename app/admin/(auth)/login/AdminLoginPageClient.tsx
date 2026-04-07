"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPageClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/jobs");
      router.refresh();
    }
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: "#0A1628" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(77,201,47,0.10), transparent 30%),
            radial-gradient(circle at 85% 15%, rgba(26,109,181,0.16), transparent 32%),
            radial-gradient(circle at 50% 80%, rgba(26,109,181,0.08), transparent 28%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-10 flex justify-center">
          <Image
            src="/logo.png"
            alt="OptiCost Consulting"
            width={200}
            height={67}
            className="h-[56px] w-auto object-contain"
            priority
          />
        </div>

        <div
          className="rounded-2xl px-8 py-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mb-7 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Admin sign in
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              OptiCost internal portal
            </p>
          </div>

          <div
            className="mb-7 h-px w-full"
            style={{ backgroundColor: "rgba(77,201,47,0.25)" }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  caretColor: "#4DC92F",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(77,201,47,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(77,201,47,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="........"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  caretColor: "#4DC92F",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(77,201,47,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(77,201,47,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: "rgba(220,38,38,0.10)",
                  border: "1px solid rgba(220,38,38,0.18)",
                }}
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                  stroke="rgba(252,165,165,0.9)"
                  strokeWidth={1.75}
                >
                  <circle cx="8" cy="8" r="7" />
                  <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(252,165,165,0.9)" }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
              style={{
                backgroundColor: "#4DC92F",
                boxShadow: loading ? "none" : "0 4px 24px rgba(77,201,47,0.25)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Restricted access - authorised personnel only
        </p>
      </div>
    </div>
  );
}
