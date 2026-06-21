import { MINIMUM_SESSIONS } from "@/config/irtConstants";
import Link from "next/link";

export default function EmptyAnalysis({ sessionCount }) {
  if (sessionCount < MINIMUM_SESSIONS) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">🔍</p>
        <p className="font-medium" style={{ color: "var(--ds-text)" }}>Not enough data yet</p>
        <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
          Debug at least {MINIMUM_SESSIONS} times so AI has enough history to find your patterns
        </p>
        <Link
          href="/debug"
          className="inline-block mt-2 px-5 py-2 text-sm rounded-lg font-code transition-colors"
          style={{ border: "1px solid rgba(201,168,76,0.3)", color: "var(--ds-amber)" }}
        >
          Start debugging
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-16 space-y-3">
      <p className="text-4xl">🧠</p>
      <p className="font-medium" style={{ color: "var(--ds-text)" }}>Ready to analyse</p>
      <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
        Click the button above to identify your weak spots
      </p>
    </div>
  );
}