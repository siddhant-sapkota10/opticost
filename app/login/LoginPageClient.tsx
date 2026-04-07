"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

type Tab = "signin" | "signup";

export default function LoginPageClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;
    if (role === "user") {
      router.push("/portal");
    } else {
      router.push("/admin/jobs");
    }
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (signUpPassword !== signUpConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: { role: "user", full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/portal");
      router.refresh();
    } else {
      setMessage("Account created! Check your email to confirm, then sign in.");
      setLoading(false);
      setTab("signin");
    }
  }

  const inputBase =
    "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20";
  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    caretColor: "#4DC92F",
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(77,201,47,0.5)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(77,201,47,0.08)";
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
    e.currentTarget.style.boxShadow = "none";
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

      <div className="relative z-10 w-full max-w-[420px]">
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
          <div
            className="mb-7 flex rounded-xl p-1"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError(null);
                  setMessage(null);
                }}
                className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200"
                style={
                  tab === t
                    ? { backgroundColor: "#4DC92F", color: "#fff" }
                    : { color: "rgba(255,255,255,0.45)" }
                }
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {message && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(77,201,47,0.10)",
                border: "1px solid rgba(77,201,47,0.20)",
                color: "rgba(134,239,172,0.9)",
              }}
            >
              {message}
            </div>
          )}

          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="si-email"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Email address
                </label>
                <input
                  id="si-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="si-password"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Password
                </label>
                <input
                  id="si-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="........"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SubmitButton loading={loading}>Sign In</SubmitButton>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="su-name"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Full name
                </label>
                <input
                  id="su-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="su-email"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Email address
                </label>
                <input
                  id="su-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="su-password"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Password
                </label>
                <input
                  id="su-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="........"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="su-confirm"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Confirm password
                </label>
                <input
                  id="su-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={signUpConfirm}
                  onChange={(e) => setSignUpConfirm(e.target.value)}
                  placeholder="........"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <SubmitButton loading={loading}>Create Account</SubmitButton>

              <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Use the same email you applied with to see your applications.
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
          OptiCost Consulting - Secure Portal
        </p>
      </div>
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
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
        {children}
      </p>
    </div>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
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
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
