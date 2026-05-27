"use client";

import { useState } from "react";
import { RESOURCE_TYPES } from "@/config/irtConstants";

// ── Resource type badge ────────────────────────────────────────────────────

function ResourceBadge({ type }) {
  const config = RESOURCE_TYPES[type] || RESOURCE_TYPES.article;
  return (
    <span
      className="text-[10px] font-code px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: config.bg, color: config.color }}
    >
      {config.icon} {type}
    </span>
  );
}

// ── External link icon ─────────────────────────────────────────────────────

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3 h-3 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      style={{ color: "var(--ds-faint)" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ResourcesSection({ weakSpotId, initialResources }) {
  const [resources, setResources] = useState(initialResources || []);
  const [loading, setLoading]     = useState(false);
  const [loaded, setLoaded]       = useState((initialResources || []).length > 0);

  async function loadResources() {
    setLoading(true);
    try {
      const res  = await fetch("/api/irt/resources", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ weakSpotId }),
      });
      const data = await res.json();
      if (data.resources) {
        setResources(data.resources);
        setLoaded(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!loaded) {
    return (
      <button
        onClick={loadResources}
        disabled={loading}
        className="w-full mt-3 py-2.5 rounded-lg text-[12px] font-code tracking-wide transition-all disabled:opacity-50"
        style={{
          border: "1px dashed var(--ds-border)",
          color:  "var(--ds-subtle)",
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
          e.currentTarget.style.color = "var(--ds-amber)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = "var(--ds-border)";
          e.currentTarget.style.color = "var(--ds-subtle)";
        }}
      >
        {loading ? "Loading resources…" : "📚 Load Resources"}
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[10px] tracking-widest font-code mb-3" style={{ color: "var(--ds-faint)" }}>
        RESOURCES
      </p>
      {resources.map(r => (
        <a
          key={r.id}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg transition-all group"
          style={{
            background: "var(--ds-bg)",
            border:     "1px solid var(--ds-border)",
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
            e.currentTarget.style.background = "var(--ds-surface)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = "var(--ds-border)";
            e.currentTarget.style.background = "var(--ds-bg)";
          }}
        >
          <p
            className="flex-1 text-[13px] truncate transition-colors"
            style={{ color: "#d4cfc4" }}
          >
            {r.title}
          </p>
          <div className="flex items-center gap-2">
            <ResourceBadge type={r.type} />
            <ExternalIcon />
          </div>
        </a>
      ))}
    </div>
  );
}