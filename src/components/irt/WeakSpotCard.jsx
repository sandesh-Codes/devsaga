"use client";

import { useState } from "react";
import ConfidenceBar    from "@/components/irt/ConfidenceBar";
import ResourcesSection from "@/components/irt/ResourcesSection";
import TestSection      from "@/components/irt/test/TestSection";

// ── Chevron icon ───────────────────────────────────────────────────────────

function ChevronIcon({ open }) {
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

// ── Main component ─────────────────────────────────────────────────────────

export default function WeakSpotCard({ spot }) {
  const [open, setOpen] = useState(false);

  const resourceCount = spot.resources?.length ?? 0;
  const hasTest       = !!spot.test;

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
        {/* Dot */}
        <div
          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--ds-amber)" }}
        />

        <div className="flex-1 min-w-0">
          {/* Topic */}
          <p
            className="text-[14px] font-medium mb-2 leading-snug"
            style={{ color: "var(--ds-text)" }}
          >
            {spot.topic}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-code" style={{ color: "var(--ds-subtle)" }}>
              {spot.sessionCount} session{spot.sessionCount !== 1 ? "s" : ""} flagged
            </span>
            <span style={{ color: "var(--ds-faint)" }}>·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-code" style={{ color: "var(--ds-subtle)" }}>
                pattern strength
              </span>
              <div className="w-16">
                <ConfidenceBar value={spot.confidence} />
              </div>
            </div>

            {/* Resources indicator */}
            {resourceCount > 0 && (
              <span
                className="text-[11px] font-code px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border:     "1px solid rgba(201,168,76,0.15)",
                  color:      "var(--ds-amber)",
                }}
              >
                📚 {resourceCount} resource{resourceCount !== 1 ? "s" : ""}
              </span>
            )}

            {/* Test indicator */}
            {hasTest && (
              <span
                className="text-[11px] font-code px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(167,139,250,0.06)",
                  border:     "1px solid rgba(167,139,250,0.15)",
                  color:      "var(--ds-purple)",
                }}
              >
                ✦ test
              </span>
            )}

            {/* Resolved badge */}
            {spot.resolved && (
              <span
                className="text-[11px] font-code px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(126,200,160,0.08)",
                  border:     "1px solid rgba(126,200,160,0.2)",
                  color:      "var(--ds-green)",
                }}
              >
                ✓ resolved
              </span>
            )}
          </div>
        </div>

        {/* Expand icon */}
        <span
          className="mt-0.5 flex-shrink-0 transition-colors"
          style={{ color: open ? "var(--ds-amber)" : "var(--ds-faint)" }}
        >
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid var(--ds-border)" }}
        >
          {/* Description */}
          <p
            className="text-[13px] leading-relaxed mb-4"
            style={{ color: "var(--ds-muted)" }}
          >
            {spot.description}
          </p>

          {/* Resources */}
          <ResourcesSection
            weakSpotId={spot.id}
            initialResources={spot.resources}
          />

          {/* Divider */}
          <div
            className="my-4"
            style={{ height: "1px", background: "var(--ds-border)" }}
          />

          {/* Test */}
          <TestSection
            weakSpotId={spot.id}
            initialTest={spot.test}
          />
        </div>
      )}
    </div>
  );
}