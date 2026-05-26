"use client";

import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-auto text-[11px] px-2.5 py-1 rounded-md font-code transition-colors cursor-pointer"
      style={{
        border: "1px solid rgba(167,139,250,0.2)",
        color:  "var(--ds-purple)",
      }}
      onMouseOver={e => e.currentTarget.style.background = "rgba(167,139,250,0.06)"}
      onMouseOut={e => e.currentTarget.style.background = "transparent"}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}