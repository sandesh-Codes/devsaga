"use client";

import { signIn } from "next-auth/react";

export default function EmptyState({ session }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center">

      {/* Tag */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 font-code text-[11px]"
        style={{
          background: "rgba(201,168,76,0.06)",
          border:     "1px solid rgba(201,168,76,0.12)",
          color:      "var(--ds-amber)",
        }}
      >
        ✦ free to use {!session && "— sign in to save history"}
      </div>

      {/* Headline */}
      <h2
        className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight"
        style={{ color: "var(--ds-text)" }}
      >
        What broke today?
      </h2>

      {/* Subtext */}
      <p
        className="text-sm leading-relaxed max-w-sm mx-auto"
        style={{ color: "var(--ds-subtle)" }}
      >
        Paste your error above. DevSaga will find the root cause,
        explain it clearly, and show you the fix.
      </p>

      {/* Sign in nudge for unauthenticated users */}
      {!session && (
        <div
          className="mt-8 p-4 rounded-xl max-w-sm mx-auto"
          style={{
            background: "var(--ds-surface)",
            border:     "1px solid var(--ds-border)",
          }}
        >
          <p className="text-xs font-code mb-3" style={{ color: "var(--ds-subtle)" }}>
            Sign in to unlock history + IRT
          </p>
          <button
            onClick={() => signIn()}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
          >
            Sign in free
          </button>
        </div>
      )}
    </div>
  );
}