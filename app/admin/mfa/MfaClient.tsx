"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type VerifiedFactor = {
  id: string;
  friendly_name?: string;
  factor_type: string;
};

type EnrollmentState = {
  id: string;
  qrCode: string;
  secret: string;
  uri: string;
  friendlyName?: string;
};

type Mode = "loading" | "setup" | "challenge";

export default function MfaClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("loading");
  const [verifiedFactors, setVerifiedFactors] = useState<VerifiedFactor[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState("");
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      const supabase = createClient();
      const [
        { data: userData },
        { data: aalData, error: aalError },
        { data: factorsData, error: factorsError },
      ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ]);

      if (!active) {
        return;
      }

      if (!userData.user) {
        router.replace("/login");
        router.refresh();
        return;
      }

      if (userData.user.user_metadata?.role === "user") {
        router.replace("/portal");
        router.refresh();
        return;
      }

      if (aalError || factorsError) {
        setError(aalError?.message ?? factorsError?.message ?? "Failed to load MFA status.");
        setLoading(false);
        setMode("setup");
        return;
      }

      if (aalData?.currentLevel === "aal2") {
        router.replace("/admin/jobs");
        router.refresh();
        return;
      }

      const factors = (factorsData?.all ?? []).filter(
        (factor) => factor.factor_type === "totp" && factor.status === "verified"
      );

      setVerifiedFactors(factors);
      setSelectedFactorId(factors[0]?.id ?? "");
      setMode(factors.length > 0 ? "challenge" : "setup");
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  async function startEnrollment() {
    setBusy(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();

    if (listError) {
      setError(listError.message);
      setBusy(false);
      return;
    }

    const unverifiedTotpFactors = (factorsData?.all ?? []).filter(
      (factor) => factor.factor_type === "totp" && factor.status === "unverified"
    );

    for (const factor of unverifiedTotpFactors) {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: factor.id,
      });

      if (unenrollError) {
        setError(unenrollError.message);
        setBusy(false);
        return;
      }
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "OptiCost",
      friendlyName: "OptiCost Admin",
    });

    if (enrollError || !data || data.type !== "totp") {
      setError(enrollError?.message ?? "Failed to start MFA setup.");
      setBusy(false);
      return;
    }

    setEnrollment({
      id: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
      friendlyName: data.friendly_name,
    });
    setMessage("Scan the QR code, then enter the 6-digit code from your authenticator app.");
    setBusy(false);
  }

  async function verifyEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollment || !code.trim()) return;

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: enrollment.id,
    });

    if (challengeError || !challengeData) {
      setError(challengeError?.message ?? "Failed to create MFA challenge.");
      setBusy(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollment.id,
      challengeId: challengeData.id,
      code: code.trim(),
    });

    if (verifyError) {
      setError(verifyError.message);
      setBusy(false);
      return;
    }

    router.replace("/admin/jobs");
    router.refresh();
  }

  async function verifyChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFactorId || !code.trim()) return;

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: selectedFactorId,
      code: code.trim(),
    });

    if (verifyError) {
      setError(verifyError.message);
      setBusy(false);
      return;
    }

    router.replace("/admin/jobs");
    router.refresh();
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    backdropFilter: "blur(12px)",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    caretColor: "#4DC92F",
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
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

      <div className="relative z-10 w-full max-w-[520px]">
        <div className="rounded-2xl px-8 py-8" style={cardStyle}>
          <div className="mb-7 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Admin Multi-Factor Authentication
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Admin accounts must complete MFA before accessing the internal portal.
            </p>
          </div>

          <div
            className="mb-7 h-px w-full"
            style={{ backgroundColor: "rgba(77,201,47,0.25)" }}
          />

          {loading && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Checking your admin security status...
            </p>
          )}

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

          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(220,38,38,0.10)",
                border: "1px solid rgba(220,38,38,0.18)",
                color: "rgba(252,165,165,0.9)",
              }}
            >
              {error}
            </div>
          )}

          {!loading && mode === "setup" && (
            <div className="space-y-5">
              {!enrollment ? (
                <>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
                    Set up an authenticator app on your phone before continuing. We recommend
                    Google Authenticator, Microsoft Authenticator, 1Password, or Authy.
                  </p>
                  <button
                    type="button"
                    onClick={startEnrollment}
                    disabled={busy}
                    className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: "#4DC92F" }}
                  >
                    {busy ? "Preparing setup..." : "Set up authenticator app"}
                  </button>
                </>
              ) : (
                <form onSubmit={verifyEnrollment} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                    <div className="rounded-2xl bg-white p-4">
                      <Image
                        src={enrollment.qrCode}
                        alt={enrollment.uri}
                        width={220}
                        height={220}
                        unoptimized
                        className="h-auto w-full"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                          Manual setup code
                        </p>
                        <code
                          className="mt-2 block rounded-xl px-3 py-3 text-sm break-all"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.82)",
                          }}
                        >
                          {enrollment.secret}
                        </code>
                      </div>
                      <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                        Scan the QR code in your authenticator app. If scanning is unavailable, enter
                        the setup code manually instead.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="setup-code"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Verification code
                    </label>
                    <input
                      id="setup-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\s+/g, ""))}
                      placeholder="123456"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20"
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy || code.trim().length < 6}
                    className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: "#4DC92F" }}
                  >
                    {busy ? "Verifying..." : "Verify and continue"}
                  </button>
                </form>
              )}
            </div>
          )}

          {!loading && mode === "challenge" && (
            <form onSubmit={verifyChallenge} className="space-y-5">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
                Enter the current 6-digit code from your authenticator app to continue into the
                admin panel.
              </p>

              {verifiedFactors.length > 1 && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="factor"
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Authenticator
                  </label>
                  <select
                    id="factor"
                    value={selectedFactorId}
                    onChange={(e) => setSelectedFactorId(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                    style={inputStyle}
                  >
                    {verifiedFactors.map((factor) => (
                      <option key={factor.id} value={factor.id} style={{ color: "#0A1628" }}>
                        {factor.friendly_name || `Authenticator ${factor.id.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="challenge-code"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Verification code
                </label>
                <input
                  id="challenge-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\s+/g, ""))}
                  placeholder="123456"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={busy || code.trim().length < 6 || !selectedFactorId}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#4DC92F" }}
              >
                {busy ? "Verifying..." : "Verify and continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
