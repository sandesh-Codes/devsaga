"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import OutputSection from "@/components/debug/OutputSection";
import { OUTPUT_SECTIONS } from "@/config/debugConstants";

// ── Loading skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{
            borderColor:    "rgba(201,168,76,0.2)",
            borderTopColor: "var(--ds-amber)",
          }}
        />
        <span className="text-sm font-code" style={{ color: "var(--ds-subtle)" }}>
          Analyzing your error...
        </span>
      </div>

      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-5 animate-pulse"
          style={{
            background: "var(--ds-surface)",
            border:     "1px solid var(--ds-border)",
          }}
        >
          <div className="h-2 rounded w-1/4 mb-4" style={{ background: "#2a2820" }} />
          <div className="space-y-2">
            <div className="h-2 rounded w-full"  style={{ background: "#2a2820" }} />
            <div className="h-2 rounded w-4/5"   style={{ background: "#2a2820" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Post-analysis nudge ────────────────────────────────────────────────────

function IRTNudge() {
  return (
    <div
      className="mt-8 p-4 rounded-xl flex items-center gap-3"
      style={{
        background: "rgba(201,168,76,0.04)",
        border:     "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <span>🧠</span>
      <p className="text-xs font-code" style={{ color: "var(--ds-muted)" }}>
        Session saved.{" "}
        <Link
          href="/irt"
          style={{ color: "var(--ds-amber)" }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          Check your patterns →
        </Link>
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function DebugOutput({ data, loading }) {
  const ref = useRef(null);

  // Auto-scroll to output when results arrive
  useEffect(() => {
    if (data && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  if (loading) return <LoadingSkeleton />;
  if (!data)   return null;

  // Filter sections that have data
  const visibleSections = OUTPUT_SECTIONS.filter(section => {
    const value = data[section.key];
    return value && (!Array.isArray(value) || value.length > 0);
  });

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto mt-10">

      {/* Section divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: "var(--ds-border)" }} />
        <span
          className="text-[10px] font-code tracking-widest"
          style={{ color: "var(--ds-faint)" }}
        >
          ANALYSIS
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--ds-border)" }} />
      </div>

      {/* Output sections */}
      <div className="space-y-4">
        {visibleSections.map((section, index) => (
          <OutputSection
            key={section.key}
            section={section}
            value={data[section.key]}
            index={index}
          />
        ))}
      </div>

      <IRTNudge />
    </div>
  );
}