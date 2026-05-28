"use client";

import FormatText from "@/components/irt/test/FormatText";

// ── MCQ step of the test flow ──────────────────────────────────────────────

export default function MCQStep({ mcq, answers, onAnswer, onContinue }) {
  const allAnswered = Object.keys(answers).length >= mcq.length;

  return (
    <div className="mt-4 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest font-code" style={{ color: "var(--ds-faint)" }}>
          THEORY — MCQ
        </p>
        <span className="text-[11px] font-code" style={{ color: "var(--ds-subtle)" }}>
          {Object.keys(answers).length}/{mcq.length} answered
        </span>
      </div>

      {/* Questions */}
      {mcq.map((q, qi) => (
        <div
          key={qi}
          className="rounded-lg p-4 space-y-3"
          style={{
            background: "var(--ds-bg)",
            border:     "1px solid var(--ds-border)",
          }}
        >
          {/* Question text */}
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--ds-text)" }}>
            <span className="font-code mr-2" style={{ color: "var(--ds-faint)" }}>
              Q{qi + 1}.
            </span>
            <FormatText text={q.question} />
          </p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const letter   = ["A", "B", "C", "D"][oi];
              const selected = answers[qi] === letter;
              // Strip leading "A. " prefix if AI included it in the option text
              const optText  = opt.replace(/^[A-D]\.\s*/, "");

              return (
                <button
                  key={oi}
                  onClick={() => onAnswer(qi, letter)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-[13px] transition-all"
                  style={{
                    background: selected ? "rgba(201,168,76,0.08)" : "transparent",
                    border:     selected
                      ? "1px solid rgba(201,168,76,0.35)"
                      : "1px solid var(--ds-border)",
                    color: selected ? "var(--ds-amber)" : "var(--ds-subtle)",
                  }}
                  onMouseOver={e => {
                    if (!selected) {
                      e.currentTarget.style.color       = "var(--ds-text)";
                      e.currentTarget.style.borderColor = "rgba(240,236,224,0.12)";
                    }
                  }}
                  onMouseOut={e => {
                    if (!selected) {
                      e.currentTarget.style.color       = "var(--ds-subtle)";
                      e.currentTarget.style.borderColor = "var(--ds-border)";
                    }
                  }}
                >
                  <span className="font-code mr-2">{letter}.</span>
                  <FormatText text={optText} />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Continue */}
      <button
        onClick={onContinue}
        disabled={!allAnswered}
        className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
      >
        Continue to Code Problem →
      </button>
    </div>
  );
}