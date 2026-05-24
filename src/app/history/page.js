"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const CATEGORY_COLORS = {
  Bug:                    { bg: "bg-[#f87171]/10", text: "text-[#f87171]", dot: "#f87171" },
  "Unexpected Behaviour": { bg: "bg-[#fb923c]/10", text: "text-[#fb923c]", dot: "#fb923c" },
  Performance:            { bg: "bg-[#7ec8a0]/10", text: "text-[#7ec8a0]", dot: "#7ec8a0" },
  "API Issue":            { bg: "bg-[#a78bfa]/10", text: "text-[#a78bfa]", dot: "#a78bfa" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)          return "just now";
  if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)  return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ExpandIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SessionCard({ item }) {
  const [open, setOpen] = useState(false);
  const colors  = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["Bug"];
  const response = item.response || {};

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200" style={{
      border: open ? "1px solid rgba(201,168,76,0.2)" : "1px solid rgba(240,236,224,0.06)",
      background: open ? "#141310" : "#0f0e0c",
    }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
      >
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.dot }} />

        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] leading-snug mb-2 truncate font-mono" style={{ color: "#f0ece0" }}>
            {item.error || "Untitled session"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {item.category || "Bug"}
            </span>
            {item.context && (
              <span className="text-[11px] font-mono truncate max-w-[200px]" style={{ color: "#5a5448" }}>
                {item.context.slice(0, 40)}{item.context.length > 40 ? "…" : ""}
              </span>
            )}
            <span className="text-[11px] font-mono ml-auto flex-shrink-0" style={{ color: "#3a3530" }}>
              {item.createdAt ? timeAgo(item.createdAt) : ""}
            </span>
          </div>
        </div>

        <span className="mt-0.5 flex-shrink-0 transition-colors" style={{ color: open ? "#c9a84c" : "#3a3530" }}>
          <ExpandIcon open={open} />
        </span>
      </button>

      {open && (
        <div className="px-5 py-4 space-y-4" style={{ borderTop: "1px solid rgba(240,236,224,0.06)" }}>

          {item.code && (
            <div>
              <p className="text-[10px] tracking-widest font-mono mb-2" style={{ color: "#3a3530" }}>CODE</p>
              <pre className="text-[12px] font-mono rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words" style={{ color: "#8a8070", background: "#0c0b09", border: "1px solid rgba(240,236,224,0.06)" }}>
                {item.code.slice(0, 600)}{item.code.length > 600 ? "\n…" : ""}
              </pre>
            </div>
          )}

          {response.rootCause && (
            <div>
              <p className="text-[10px] tracking-widest font-mono mb-2" style={{ color: "#3a3530" }}>ROOT CAUSE</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{response.rootCause}</p>
            </div>
          )}

          {response.fixedCode && (
            <div>
              <p className="text-[10px] tracking-widest font-mono mb-2" style={{ color: "#3a3530" }}>FIXED CODE</p>
              <pre className="text-[12px] font-mono rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words" style={{ color: "#c9a84c", background: "#0c0b09", border: "1px solid rgba(201,168,76,0.12)" }}>
                {response.fixedCode}
              </pre>
            </div>
          )}

          {response.explanation && (
            <div>
              <p className="text-[10px] tracking-widest font-mono mb-2" style={{ color: "#3a3530" }}>EXPLANATION</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{response.explanation}</p>
            </div>
          )}

          {response.mistakes?.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest font-mono mb-2" style={{ color: "#3a3530" }}>MISTAKES</p>
              <ul className="space-y-1.5">
                {response.mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "#d4cfc4" }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "#fb923c" }}>⚠</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.weakArea && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c" }}>
                weak spot: {item.weakArea}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then((r) => r.json())
        .then((data) => setHistory(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0c0b09", fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center space-y-4">
          <p className="text-3xl">🔒</p>
          <p className="font-medium" style={{ color: "#f0ece0" }}>Sign in to view your history</p>
          <p className="text-sm" style={{ color: "#5a5448" }}>Your debug sessions are saved per account</p>
          <button onClick={() => signIn()} className="mt-2 px-5 py-2 text-sm rounded-lg transition-colors" style={{ background: "#c9a84c", color: "#0c0b09", fontWeight: 600 }}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0c0b09", color: "#f0ece0", fontFamily: "'Outfit', sans-serif" }}>

      <div className="px-6 py-4 flex items-center gap-4" style={{ borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
        <Link href="/" className="text-sm font-mono flex items-center gap-1.5 transition-colors" style={{ color: "#5a5448" }}
          onMouseOver={e => e.currentTarget.style.color = "#f0ece0"}
          onMouseOut={e => e.currentTarget.style.color = "#5a5448"}
        >
          ← Back
        </Link>
        <div className="h-4 w-px" style={{ background: "rgba(240,236,224,0.08)" }} />
        <p className="text-[10px] tracking-widest font-mono" style={{ color: "#3a3530" }}>DEBUG HISTORY</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f0ece0" }}>
            Your Sessions
          </h1>
          <p className="text-sm" style={{ color: "#5a5448" }}>
            Last {history.length} debug sessions — click any to expand
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "#141310", border: "1px solid rgba(240,236,224,0.06)" }} />
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <p className="text-4xl">🔍</p>
            <p className="font-medium" style={{ color: "#f0ece0" }}>No sessions yet</p>
            <p className="text-sm" style={{ color: "#5a5448" }}>Debug something on the homepage to get started</p>
            <Link href="/" className="inline-block mt-2 px-5 py-2 text-sm rounded-lg transition-colors font-mono" style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c" }}>
              Start debugging
            </Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map((item) => (
              <SessionCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}