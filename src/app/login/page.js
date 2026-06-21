"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignInButton from "@/components/login/SignInButton";
import { GoogleIcon, GitHubIcon } from "@/components/login/ProviderIcons";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState(null);

  function handleSignIn(provider) {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: "/debug" });
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