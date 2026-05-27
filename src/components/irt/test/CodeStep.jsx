"use client";

// ── Code problem step of the test flow ────────────────────────────────────

function SectionBlock({ label, children }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "var(--ds-bg)",
        border:     "1px solid var(--ds-border)",
      }}
    >
      <p className="text-[10px] tracking-widest font-code mb-2" style={{ color: "var(--ds-faint)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

export default function CodeStep({ codeProblem, codeAnswer, onChangeAnswer, onBack, onSubmit, submitting }) {
  const { scenario, task, brokenCode, hint } = codeProblem;

  return (
    <div className="mt-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest font-code" style={{ color: "var(--ds-faint)" }}>
          CODE PROBLEM
        </p>
        <button
          onClick={onBack}
          className="text-[11px] font-code transition-colors"
          style={{ color: "var(--ds-subtle)" }}
          onMouseOver={e => e.currentTarget.style.color = "var(--ds-text)"}
          onMouseOut={e => e.currentTarget.style.color = "var(--ds-subtle)"}
        >
          ← Back to MCQ
        </button>
      </div>

      {/* Scenario */}
      <SectionBlock label="SCENARIO">
        <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{scenario}</p>
      </SectionBlock>

      {/* Task */}
      <SectionBlock label="TASK">
        <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{task}</p>
      </SectionBlock>

      {/* Broken code */}
      <div>
        <p className="text-[10px] tracking-widest font-code mb-2" style={{ color: "var(--ds-faint)" }}>
          BROKEN CODE
        </p>
        <pre
          className="text-[12px] font-code rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words"
          style={{
            color:      "var(--ds-red)",
            background: "var(--ds-bg)",
            border:     "1px solid rgba(248,113,113,0.15)",
          }}
        >
          {brokenCode}
        </pre>
      </div>

      {/* Hint */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
        style={{
          background: "rgba(251,146,60,0.04)",
          border:     "1px solid rgba(251,146,60,0.15)",
        }}
      >
        <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: "var(--ds-orange)" }}>💡</span>
        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(251,146,60,0.7)" }}>{hint}</p>
      </div>

      {/* Answer */}
      <div>
        <p className="text-[10px] tracking-widest font-code mb-2" style={{ color: "var(--ds-faint)" }}>
          YOUR SOLUTION
        </p>
        <textarea
          value={codeAnswer}
          onChange={e => onChangeAnswer(e.target.value)}
          placeholder="Write your fix here — identify the bug, fix it, and explain why it was wrong..."
          rows={10}
          className="w-full rounded-lg p-4 text-[12px] font-code leading-relaxed resize-none outline-none transition-colors"
          style={{
            background:   "var(--ds-bg)",
            border:       "1px solid var(--ds-border)",
            color:        "#d4cfc4",
            placeholderColor: "var(--ds-faint)",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.3)"}
          onBlur={e => e.target.style.borderColor = "var(--ds-border)"}
        />
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!codeAnswer.trim() || submitting}
        className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span
              className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
              style={{ borderColor: "rgba(12,11,9,0.3)", borderTopColor: "#0c0b09" }}
            />
            AI is reviewing your submission…
          </span>
        ) : (
          "Submit for Review →"
        )}
      </button>
    </div>
  );
}