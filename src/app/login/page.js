"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const [loadingProvider, setLoadingProvider] = useState(null)

  const handleSignIn = (provider) => {
    setLoadingProvider(provider)
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #7c6af7, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent 70%)" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#7c6af7 1px, transparent 1px), linear-gradient(90deg, #7c6af7 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }} />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm">

        {/* Top accent line */}
        <div className="h-px w-full mb-8"
          style={{ background: "linear-gradient(90deg, transparent, #7c6af7, #60a5fa, transparent)" }} />

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 border border-[#7c6af7]/20"
            style={{ background: "radial-gradient(circle at 30% 30%, #7c6af7/20, #07070f)" }}>
            <span className="text-xl">⚡</span>
          </div>

          <h1 className="text-2xl font-semibold text-[#e8e8f0] tracking-tight mb-1">
            Welcome to <span style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #7c6af7, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>DevSaga</span>
          </h1>
          <p className="text-sm text-[#4a4a65]">Learning from mistakes never been so easy</p>
        </div>

        {/* Card body */}
        <div className="rounded-2xl border border-[#1e1e30] p-6 space-y-3"
          style={{ background: "rgba(13,13,26,0.8)", backdropFilter: "blur(12px)" }}>

          <p className="text-[11px] tracking-widest text-[#4a4a65] font-mono text-center mb-4">
            CONTINUE WITH
          </p>

          {/* Google button */}
          <button
            onClick={() => handleSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1e1e30] text-[#c8c8d8] text-sm font-medium transition-all duration-200 hover:border-[#7c6af7]/40 hover:bg-white/[0.03] hover:text-[#e8e8f0] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="w-6 h-6 flex items-center justify-center">
              {loadingProvider === "google"
                ? <span className="w-4 h-4 rounded-full border-2 border-[#7c6af7] border-t-transparent animate-spin" />
                : <GoogleIcon />
              }
            </span>
            <span className="flex-1 text-left">
              {loadingProvider === "google" ? "Connecting…" : "Continue with Google"}
            </span>
            <span className="text-[#2a2a40] group-hover:text-[#4a4a65] transition-colors">→</span>
          </button>

          {/* GitHub button */}
          <button
            onClick={() => handleSignIn("github")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1e1e30] text-[#c8c8d8] text-sm font-medium transition-all duration-200 hover:border-[#60a5fa]/40 hover:bg-white/[0.03] hover:text-[#e8e8f0] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="w-6 h-6 flex items-center justify-center">
              {loadingProvider === "github"
                ? <span className="w-4 h-4 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin" />
                : <GitHubIcon />
              }
            </span>
            <span className="flex-1 text-left">
              {loadingProvider === "github" ? "Connecting…" : "Continue with GitHub"}
            </span>
            <span className="text-[#2a2a40] group-hover:text-[#4a4a65] transition-colors">→</span>
          </button>

        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#2a2a40] mt-6 font-mono">
          No password. No signup. Just code.
        </p>

        {/* Bottom accent line */}
        <div className="h-px w-full mt-8"
          style={{ background: "linear-gradient(90deg, transparent, #60a5fa, #7c6af7, transparent)" }} />

      </div>
    </div>
  )
}