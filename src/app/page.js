"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LandingPage  from "@/components/LandingPage";
import Topbar       from "@/components/layout/Topbar";
import DebugInput   from "@/components/debug/DebugInput";
import DebugOutput  from "@/components/debug/DebugOutput";
import EmptyState   from "@/components/debug/EmptyState";

// ── Loading screen ─────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ background: "var(--ds-bg)" }}>
      <div
        className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "var(--ds-amber)" }}
      />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Home() {
  const { data: session, status } = useSession();

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Auth guards
  if (status === "unauthenticated") return <LandingPage />;
  if (status === "loading")         return <LoadingScreen />;

  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res  = await fetch("/api/debug", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResult(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showEmpty = !result && !loading && !error;

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-bg)" }}>

      <Topbar session={session} activePage="debug" />

      <main className="px-6 md:px-10 py-10 pb-24">

        {/* Input — always visible */}
        <DebugInput
          onSubmit={handleSubmit}
          loading={loading}
          onClear={handleClear}
          hasResult={!!result}
        />

        {/* Error message */}
        {error && (
          <div
            className="w-full max-w-2xl mx-auto mt-4 p-3 rounded-lg text-sm"
            style={{
              background: "rgba(248,113,113,0.08)",
              border:     "1px solid rgba(248,113,113,0.2)",
              color:      "var(--ds-red)",
            }}
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {showEmpty && <EmptyState session={session} />}

        {/* Output — flows in below input after submit */}
        <DebugOutput data={result} loading={loading} />

      </main>
    </div>
  );
}