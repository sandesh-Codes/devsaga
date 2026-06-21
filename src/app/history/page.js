"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Topbar from "@/components/layout/Topbar";
import SessionCard from "@/components/history/SessionCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UnauthenticatedState from "@/components/UnauthenticatedState";
import Link from "next/link";


// ── Main page ──────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then(r => r.json())
        .then(data => setHistory(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") return <UnauthenticatedState title="Sign in to view your history" description="Your debug sessions are saved per account" />;

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-bg)" }}>

      <Topbar session={session} activePage="history" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="font-display text-2xl font-bold mb-1 tracking-tight"
            style={{ color: "var(--ds-text)" }}
          >
            Your Sessions
          </h1>
          <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
            {history.length} debug session{history.length !== 1 ? "s" : ""} — click any to expand
          </p>
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <p className="text-4xl">🔍</p>
            <p className="font-medium" style={{ color: "var(--ds-text)" }}>No sessions yet</p>
            <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
              Debug something to get started
            </p>
            <Link
              href="/debug"
              className="inline-block mt-2 px-5 py-2 text-sm rounded-lg font-code transition-colors"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                color:  "var(--ds-amber)",
              }}
            >
              Start debugging
            </Link>
          </div>
        )}

        {/* Session list */}
        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map(item => (
              <SessionCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}