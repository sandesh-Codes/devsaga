"use client";

// ── Inline text — handles `backtick` code spans ────────────────────────────

function InlineText({ text }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="font-code rounded"
              style={{
                fontSize:   "0.85em",
                padding:    "1px 6px",
                background: "rgba(201,168,76,0.1)",
                color:      "var(--ds-amber)",
                border:     "1px solid rgba(201,168,76,0.15)",
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── FormatText — handles ```code blocks``` and `inline code` ───────────────

export default function FormatText({ text, className = "", style = {} }) {
  if (!text) return null;

  const segments = [];
  const codeBlockRegex = /```(?:[a-zA-Z]*)?\s*([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text",  content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "block", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return (
    <span className={className} style={style}>
      {segments.map((seg, i) => {
        if (seg.type === "block") {
          return (
            <pre
              key={i}
              className="font-code rounded-lg p-3 my-2 text-[11px] overflow-x-auto leading-relaxed whitespace-pre-wrap break-words"
              style={{
                display:    "block",
                background: "rgba(201,168,76,0.04)",
                border:     "1px solid rgba(201,168,76,0.12)",
                color:      "var(--ds-text)",
              }}
            >
              {seg.content}
            </pre>
          );
        }
        return <InlineText key={i} text={seg.content} />;
      })}
    </span>
  );
}