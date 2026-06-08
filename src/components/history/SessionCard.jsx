import { useState } from "react";
import { CATEGORY_COLORS } from "@/config/historyConstants";
import timeAgo from "@/utils/timeago"

const DEFAULT_COLOR = CATEGORY_COLORS["Bug"];

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

export default function SessionCard({ item }) {
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