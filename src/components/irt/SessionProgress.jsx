"use client";

import { MINIMUM_SESSIONS } from "@/config/irtConstants";

// Shows debug session count progress toward IRT unlock threshold

export default function SessionProgress({ count }) {
  const pct       = Math.min((count / MINIMUM_SESSIONS) * 100, 100);
  const remaining = MINIMUM_SESSIONS - count;
  const unlocked  = count >= MINIMUM_SESSIONS;

  return (
    <div
      className="p-4 rounded-xl mb-6"
      style={{
        background: "var(--ds-surface)",
        border:     "1px solid var(--ds-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] tracking-widest font-code" style={{ color: "var(--ds-faint)" }}>
          DEBUG SESSIONS
        </p>
        <p className="text-[11px] font-code" style={{ color: "var(--ds-subtle)" }}>
          {count} / {MINIMUM_SESSIONS} minimum
        </p>
      </div>

      <div
        className="h-1 rounded-full overflow-hidden mb-2"
        style={{ background: "rgba(240,236,224,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${pct}%`,
            background: unlocked
              ? "var(--ds-amber)"
              : "linear-gradient(90deg, var(--ds-amber), var(--ds-green))",
          }}
        />
      </div>

      {!unlocked && (
        <p className="text-[12px] font-code" style={{ color: "var(--ds-subtle)" }}>
          Debug {remaining} more time{remaining !== 1 ? "s" : ""} to unlock pattern analysis.
        </p>
      )}
    </div>
  );
}