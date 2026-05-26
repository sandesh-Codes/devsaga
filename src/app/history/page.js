"use client";
 
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
 
const CATEGORY_COLORS = {
  Bug:                    { bg: "bg-[#f87171]/10", text: "text-[#f87171]", dot: "#f87171" },
  "Unexpected Behaviour": { bg: "bg-[#fb923c]/10", text: "text-[#fb923c]", dot: "#fb923c" },
  Performance:            { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "#60a5fa" },
  "API Issue":            { bg: "bg-[#a78bfa]/10", text: "text-[#a78bfa]", dot: "#a78bfa" },
};
 
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)         return "just now";
  if (diff < 3600)       return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)  return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
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
 
function SessionCard({ item }) {
  const [open, setOpen] = useState(false);
  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["Bug"];
  const response = item.response || {};
 
  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
      open ? "border-[#7c6af7]/30 bg-[#0d0d1a]" : "border-[#1e1e30] bg-[#0a0a14] hover:border-[#2a2a40]"
    }`}>
 
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 group"
      >
        {/* Color dot */}
        <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: colors.dot }} />
 
        <div className="flex-1 min-w-0">
          {/* Error message */}
          <p className="text-[13.5px] text-[#e8e8f0] leading-snug mb-2 truncate font-mono">
            {item.error || "Untitled session"}
          </p>
 
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {item.category || "Bug"}
            </span>
            {item.context && (
              <span className="text-[11px] text-[#4a4a65] font-mono truncate max-w-[200px]">
                {item.context.slice(0, 40)}{item.context.length > 40 ? "…" : ""}
              </span>
            )}
            <span className="text-[11px] text-[#2a2a40] ml-auto shrink-0">
              {item.createdAt ? timeAgo(item.createdAt) : ""}
            </span>
          </div>
        </div>
 
        {/* Expand icon */}
        <span className="text-[#4a4a65] group-hover:text-[#7c6af7] transition-colors mt-0.5 shrink-0">
          <ExpandIcon open={open} />
        </span>
      </button>
 
      {/* Expanded content */}
      {open && (
        <div className="border-t border-[#1e1e30] px-5 py-4 space-y-4">
 
          {/* Code snippet */}
          {item.code && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">CODE</p>
              <pre className="text-[12px] text-[#a0a0b8] font-mono bg-[#07070f] border border-[#1e1e30] rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                {item.code.slice(0, 600)}{item.code.length > 600 ? "\n…" : ""}
              </pre>
            </div>
          )}
 
          {/* Root cause */}
          {response.rootCause && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">ROOT CAUSE</p>
              <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{response.rootCause}</p>
            </div>
          )}
 
          {/* Fix */}
          {response.fix && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">FIX</p>
              <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{response.fix}</p>
            </div>
          )}
 
          {/* Fixed code */}
          {response.fixedCode && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">FIXED CODE</p>
              <pre className="text-[12px] text-[#7c6af7] font-mono bg-[#07070f] border border-[#7c6af7]/20 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                {response.fixedCode}
              </pre>
            </div>
          )}
 
          {/* Explanation */}
          {response.explanation && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">EXPLANATION</p>
              <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{response.explanation}</p>
            </div>
          )}
 
          {/* Tips */}
          {response.tips?.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">TIPS</p>
              <ul className="space-y-1.5">
                {response.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#c8c8d8]">
                    <span className="text-[#7c6af7] mt-0.5 shrink-0">›</span>
                    {tip}
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
 
  // Not logged in
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center space-y-4">
          <p className="text-3xl">🔒</p>
          <p className="text-[#e8e8f0] font-medium">Sign in to view your history</p>
          <p className="text-sm text-[#4a4a65]">Your debug sessions are saved per account</p>
          <button
            onClick={() => signIn()}
            className="mt-2 px-5 py-2 bg-[#7c6af7] hover:bg-[#6a59e0] text-white text-sm rounded-lg transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-[#07070f] text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}>
 
      {/* Top bar */}
      <div className="border-b border-[#1e1e30] px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-[#4a4a65] hover:text-[#e8e8f0] transition-colors text-sm font-mono flex items-center gap-1.5"
        >
          ← Back
        </Link>
        <div className="h-4 w-px bg-[#1e1e30]" />
        <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono">DEBUG HISTORY</p>
      </div>
 
      <div className="max-w-3xl mx-auto px-6 py-8">
 
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#e8e8f0] tracking-tight mb-1">
            Your Sessions
          </h1>
          <p className="text-sm text-[#4a4a65]">
            Last {history.length} debug sessions — click any to expand
          </p>
        </div>
 
        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-[#0d0d1a] border border-[#1e1e30] animate-pulse" />
            ))}
          </div>
        )}
 
        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <p className="text-4xl">🔍</p>
            <p className="text-[#e8e8f0] font-medium">No sessions yet</p>
            <p className="text-sm text-[#4a4a65]">Debug something on the homepage to get started</p>
            <Link
              href="/"
              className="inline-block mt-2 px-5 py-2 border border-[#7c6af7]/40 text-[#7c6af7] text-sm rounded-lg hover:bg-[#7c6af7]/10 transition-colors"
            >
              Start debugging
            </Link>
          </div>
        )}
 
        {/* Session list */}
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
 