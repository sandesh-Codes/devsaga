"use client";

import { useState } from "react";

// ── Shared input style ─────────────────────────────────────────────────────

const INPUT_STYLE = {
  background:  "var(--ds-surface)",
  border:      "1px solid var(--ds-border)",
  borderRadius: "12px",
  color:       "var(--ds-text)",
  fontFamily:  "var(--font-jetbrains), monospace",
  fontSize:    "13px",
  padding:     "12px 16px",
  outline:     "none",
  width:       "100%",
  resize:      "none",
  transition:  "border-color 0.2s",
};

function focusStyle(e)  { e.target.style.borderColor = "rgba(201,168,76,0.4)"; }
function blurStyle(e)   { e.target.style.borderColor = "var(--ds-border)"; }

// ── Sub-components ─────────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <label
      className="block text-[10px] tracking-widest font-code mb-1.5"
      style={{ color: "var(--ds-faint)" }}
    >
      {children}
    </label>
  );
}


function SimplerToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative w-9 h-5 rounded-full transition-all cursor-pointer flex-shrink-0"
        style={{ background: value ? "var(--ds-amber)" : "rgba(240,236,224,0.08)" }}
        aria-label="Toggle simpler explanation"
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform"
          style={{
            background: "var(--ds-text)",
            transform:  value ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </button>
      <span
        className="text-xs font-code"
        style={{ color: value ? "var(--ds-amber)" : "var(--ds-subtle)" }}
      >
        Explain simpler
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function DebugInput({ onSubmit, loading, onClear, hasResult }) {
  const [form, setForm] = useState({
    error:    "",
    code:     "",
    context:  "",
    simpler:  false,
  });

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Error message */}
        <div>
          <FieldLabel>ERROR MESSAGE</FieldLabel>
          <input
            name="error"
            placeholder="Paste your error here..."
            value={form.error}
            onChange={e => set("error", e.target.value)}
            required
            style={INPUT_STYLE}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Code */}
        <div>
          <FieldLabel>CODE</FieldLabel>
          <textarea
            name="code"
            placeholder="Paste the relevant code..."
            value={form.code}
            onChange={e => set("code", e.target.value)}
            required
            rows={8}
            style={INPUT_STYLE}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Context */}
        <div>
          <FieldLabel>
            CONTEXT{" "}
            <span style={{ color: "var(--ds-faint)", opacity: 0.5 }}>— optional</span>
          </FieldLabel>
          <textarea
            name="context"
            placeholder="What were you trying to do?"
            value={form.context}
            onChange={e => set("context", e.target.value)}
            rows={3}
            style={INPUT_STYLE}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Category + Simpler toggle */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="pb-1">
            <SimplerToggle
              value={form.simpler}
              onChange={val => set("simpler", val)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                  style={{ borderColor: "rgba(12,11,9,0.3)", borderTopColor: "#0c0b09" }}
                />
                Analyzing...
              </span>
            ) : (
              "Debug →"
            )}
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-3 rounded-xl text-sm font-code transition-all"
              style={{ border: "1px solid var(--ds-border)", color: "var(--ds-subtle)" }}
              onMouseOver={e => e.currentTarget.style.color = "var(--ds-text)"}
              onMouseOut={e => e.currentTarget.style.color = "var(--ds-subtle)"}
            >
              Clear
            </button>
          )}
        </div>

      </form>
    </div>
  );
}