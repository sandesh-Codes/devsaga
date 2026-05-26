"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

// ── Icons ──────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ── Sign in button ─────────────────────────────────────────────────────────

function SignInButton({ provider, label, icon, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      style={{
        background: "var(--ds-surface)",
        border:     "1px solid var(--ds-border)",
        color:      "var(--ds-muted)",
      }}
      onMouseOver={e => {
        if (!loading) {
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
          e.currentTarget.style.color = "var(--ds-text)";
        }
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = "var(--ds-border)";
        e.currentTarget.style.color = "var(--ds-muted)";
      }}
    >
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {loading ? (
          <span
            className="w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "var(--ds-amber)" }}
          />
        ) : icon}
      </span>
      <span className="flex-1 text-left font-code text-[13px]">
        {loading ? "Connecting…" : label}
      </span>
      <span
        className="text-[12px] transition-colors"
        style={{ color: "var(--ds-faint)" }}
      >
        →
      </span>
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState(null);

  function handleSignIn(provider) {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: "/" });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--ds-bg)" }}
    >
      <div className="w-full max-w-sm">

        {/* Top divider */}
        <div
          className="h-px w-full mb-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }}
        />

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <h1
            className="font-display text-3xl font-bold mb-2"
            style={{ color: "var(--ds-text)" }}
          >
            DevSaga
          </h1>
          <p
            className="text-sm font-code"
            style={{ color: "var(--ds-subtle)" }}
          >
            Learning from mistakes never been so easy.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-3"
          style={{
            background: "var(--ds-surface)",
            border:     "1px solid var(--ds-border)",
          }}
        >
          <p
            className="text-[10px] tracking-widest font-code text-center mb-5"
            style={{ color: "var(--ds-faint)" }}
          >
            CONTINUE WITH
          </p>

          <SignInButton
            provider="google"
            label="Continue with Google"
            icon={<GoogleIcon />}
            loading={loadingProvider === "google"}
            onClick={() => handleSignIn("google")}
          />

          <SignInButton
            provider="github"
            label="Continue with GitHub"
            icon={<GitHubIcon />}
            loading={loadingProvider === "github"}
            onClick={() => handleSignIn("github")}
          />
        </div>

        {/* Footer note */}
        <p
          className="text-center text-[11px] font-code mt-6"
          style={{ color: "var(--ds-faint)" }}
        >
          No password. No signup. Just code.
        </p>

        {/* Bottom divider */}
        <div
          className="h-px w-full mt-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }}
        />

      </div>
    </div>
  );
}