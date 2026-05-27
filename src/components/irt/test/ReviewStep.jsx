"use client";

// ── Review block ───────────────────────────────────────────────────────────

function ReviewBlock({ label, children, accent }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: accent ? `${accent}05` : "var(--ds-bg)",
        border:     accent ? `1px solid ${accent}20` : "1px solid var(--ds-border)",
      }}
    >
      <p
        className="text-[10px] tracking-widest font-code mb-2"
        style={{ color: accent ? `${accent}80` : "var(--ds-faint)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ReviewStep({ review, onRetake }) {
  const { feedback: fb, score } = review;

  const scoreColor = score >= 80
    ? "var(--ds-green)"
    : score >= 60
    ? "var(--ds-orange)"
    : "var(--ds-red)";

  const scoreLabel = score >= 80
    ? "Strong understanding demonstrated"
    : score >= 60
    ? "Good progress, some gaps remain"
    : "Needs more practice — review resources";

  return (
    <div className="mt-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest font-code" style={{ color: "var(--ds-faint)" }}>
          AI REVIEW
        </p>
        <button
          onClick={onRetake}
          className="text-[11px] font-code transition-colors"
          style={{ color: "var(--ds-subtle)" }}
          onMouseOver={e => e.currentTarget.style.color = "var(--ds-text)"}
          onMouseOut={e => e.currentTarget.style.color = "var(--ds-subtle)"}
        >
          Retake →
        </button>
      </div>

      {/* Score */}
      <div
        className="flex items-center gap-4 p-4 rounded-lg"
        style={{
          background: "var(--ds-bg)",
          border:     `1px solid ${scoreColor}25`,
        }}
      >
        <div className="text-4xl font-bold font-code" style={{ color: scoreColor }}>
          {score}
        </div>
        <div>
          <p className="text-[10px] font-code mb-0.5" style={{ color: "var(--ds-faint)" }}>SCORE</p>
          <p className="text-[13px]" style={{ color: "#d4cfc4" }}>{scoreLabel}</p>
        </div>
      </div>

      {/* MCQ summary */}
      {fb.mcqSummary && (
        <ReviewBlock label="MCQ PERFORMANCE">
          <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
            {fb.mcqSummary}
          </p>
          {fb.mcqDetails?.length > 0 && (
            <div className="mt-3 space-y-2">
              {fb.mcqDetails.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: d.wasCorrect ? "var(--ds-green)" : "var(--ds-red)" }}
                  >
                    {d.wasCorrect ? "✓" : "✗"}
                  </span>
                  <p className="leading-relaxed" style={{ color: "var(--ds-muted)" }}>
                    {d.insight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReviewBlock>
      )}

      {/* Code feedback */}
      {fb.codeFeedback && (
        <ReviewBlock label="CODE REVIEW">
          <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "#d4cfc4" }}>
            {fb.codeFeedback}
          </p>
        </ReviewBlock>
      )}

      {/* Overall insight */}
      {fb.overallInsight && (
        <ReviewBlock label="OVERALL INSIGHT" accent="#c9a84c">
          <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
            {fb.overallInsight}
          </p>
        </ReviewBlock>
      )}

      {/* Next step */}
      {fb.nextStep && (
        <ReviewBlock label="NEXT STEP" accent="#7ec8a0">
          <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
            {fb.nextStep}
          </p>
        </ReviewBlock>
      )}
    </div>
  );
}