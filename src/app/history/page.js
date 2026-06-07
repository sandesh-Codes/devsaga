"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Topbar from "@/components/layout/Topbar";
import { CATEGORY_COLORS } from "@/config/historyConstants"
import Link from "next/link";

const DEFAULT_COLOR = CATEGORY_COLORS["Bug"];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)         return "just now";
  if (diff < 3600)       return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)  return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <p className="text-[10px] tracking-widest font-code mb-2" style={{ color: "var(--ds-faint)" }}>
      {children}
    </p>
  );
}

function ExpandIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── Session card ───────────────────────────────────────────────────────────

function SessionCard({ item }) {
  const [open, setOpen]   = useState(false);
  const colors            = CATEGORY_COLORS[item.category] || DEFAULT_COLOR;
  const response          = item.response || {};

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: open ? "var(--ds-surface)" : "#0f0e0c",
        border:     open
          ? "1px solid rgba(201,168,76,0.15)"
          : "1px solid var(--ds-border)",
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
      >
        {/* Category dot */}
        <span
          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: colors.dot }}
        />

        <div className="flex-1 min-w-0">
          {/* Error preview */}
          <p
            className="text-[13.5px] leading-snug mb-2 truncate font-code"
            style={{ color: "var(--ds-text)" }}
          >
            {item.error || "Untitled session"}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            {item.category && (
              <span
                className="text-[11px] font-code px-2 py-0.5 rounded-full"
                style={{ background: colors.bg, color: colors.text }}
              >
                {item.category}
              </span>
            )}
            {item.weakArea && (
              <span
                className="text-[11px] font-code px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border:     "1px solid rgba(201,168,76,0.15)",
                  color:      "var(--ds-amber)",
                }}
              >
                {item.weakArea}
              </span>
            )}
            {item.context && (
              <span
                className="text-[11px] font-code truncate max-w-45"
                style={{ color: "var(--ds-subtle)" }}
              >
                {item.context.slice(0, 40)}{item.context.length > 40 ? "…" : ""}
              </span>
            )}
            <span
              className="text-[11px] font-code ml-auto shrink-0"
              style={{ color: "var(--ds-faint)" }}
            >
              {item.createdAt ? timeAgo(item.createdAt) : ""}
            </span>
          </div>
        </div>

        {/* Expand icon */}
        <span
          className="mt-0.5 shrink-0 transition-colors"
          style={{ color: open ? "var(--ds-amber)" : "var(--ds-faint)" }}
        >
          <ExpandIcon open={open} />
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div
          className="px-5 py-4 space-y-5"
          style={{ borderTop: "1px solid var(--ds-border)" }}
        >
          {/* Code */}
          {item.code && (
            <div>
              <FieldLabel>CODE</FieldLabel>
              <pre
                className="text-[12px] font-code rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap wrap-break-word"
                style={{
                  color:      "var(--ds-muted)",
                  background: "var(--ds-bg)",
                  border:     "1px solid var(--ds-border)",
                }}
              >
                {item.code.slice(0, 600)}{item.code.length > 600 ? "\n…" : ""}
              </pre>
            </div>
          )}

          {/* Root cause */}
          {response.rootCause && (
            <div>
              <FieldLabel>ROOT CAUSE</FieldLabel>
              <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
                {response.rootCause}
              </p>
            </div>
          )}

          {/* Fixed code */}
          {response.fixedCode && (
            <div>
              <FieldLabel>FIXED CODE</FieldLabel>
              <pre
                className="text-[12px] font-code rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap wrap-break-word"
                style={{
                  color:      "var(--ds-amber)",
                  background: "var(--ds-bg)",
                  border:     "1px solid rgba(201,168,76,0.12)",
                }}
              >
                {response.fixedCode}
              </pre>
            </div>
          )}

          {/* Explanation */}
          {response.explanation && (
            <div>
              <FieldLabel>EXPLANATION</FieldLabel>
              <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
                {response.explanation}
              </p>
            </div>
          )}

          {/* Mistakes */}
          {response.mistakes?.length > 0 && (
            <div>
              <FieldLabel>MISTAKES</FieldLabel>
              <ul className="space-y-1.5">
                {response.mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "#d4cfc4" }}>
                    <span className="shrink-0 mt-0.5" style={{ color: "var(--ds-orange)" }}>⚠</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl animate-pulse"
          style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)" }}
        />
      ))}
    </div>
  );
}

// ── Unauthenticated state ──────────────────────────────────────────────────

function UnauthenticatedState() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--ds-bg)" }}
    >
      <div className="text-center space-y-4">
        <p className="text-3xl">🔒</p>
        <p className="font-medium" style={{ color: "var(--ds-text)" }}>
          Sign in to view your history
        </p>
        <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
          Your debug sessions are saved per account
        </p>
        <button
          onClick={() => signIn()}
          className="mt-2 px-5 py-2 text-sm rounded-lg font-semibold transition-colors"
          style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

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

  if (status === "unauthenticated") return <UnauthenticatedState />;

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
              href="/"
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