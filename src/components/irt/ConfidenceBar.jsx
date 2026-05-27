"use client";

// Displays a confidence bar for a weak spot (value out of 10)

export default function ConfidenceBar({ value }) {
  const pct   = Math.round((value / 10) * 100);
  const color = value >= 8 ? "var(--ds-red)" : value >= 5 ? "var(--ds-orange)" : "var(--ds-green)";

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(240,236,224,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-code" style={{ color: "var(--ds-subtle)" }}>
        {value}/10
      </span>
    </div>
  );
}