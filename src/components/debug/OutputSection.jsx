"use client";

import CopyButton from "@/components/debug/CopyButton";

export default function OutputSection({ section, value, index }) {
  return (
    <div
      className="rounded-xl overflow-hidden animate-fade-up"
      style={{
        background:        "var(--ds-surface)",
        border:            "1px solid var(--ds-border)",
        animationDelay:    `${index * 80}ms`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: "1px solid var(--ds-border)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: section.dot }}
        />
        <span
          className="text-[10px] font-code tracking-widest"
          style={{ color: section.dot, opacity: 0.8 }}
        >
          {section.label}
        </span>

        {section.type === "code" && <CopyButton text={value} />}
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {section.type === "text" && (
          <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
            {value}
          </p>
        )}

        {section.type === "steps" && (
          <ol className="space-y-3">
            {value.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-code flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    border:     "1px solid rgba(201,168,76,0.2)",
                    color:      "var(--ds-amber)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        )}

        {section.type === "code" && (
          <pre
            className="text-[12px] font-code overflow-x-auto leading-relaxed whitespace-pre-wrap break-words"
            style={{ color: "#d4cfc4" }}
          >
            {value}
          </pre>
        )}

        {section.type === "mistakes" && (
          <ul className="space-y-2.5">
            {value.map((mistake, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13px]"
                style={{ color: "#d4cfc4" }}
              >
                <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--ds-orange)" }}>
                  ⚠
                </span>
                {mistake}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}