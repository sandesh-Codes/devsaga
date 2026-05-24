"use client";
import { useState } from "react";

const CARDS = [
  {
    key: "explanation",
    title: "Simple Explanation",
    dot: "#7ec8a0",
    color: "text-[#7ec8a0]",
    border: "border-[#7ec8a0]/15",
    bg: "bg-[#7ec8a0]/04",
    type: "text",
  },
  {
    key: "rootCause",
    title: "Root Cause",
    dot: "#f87171",
    color: "text-[#f87171]",
    border: "border-[#f87171]/15",
    bg: "bg-[#f87171]/04",
    type: "text",
  },
  {
    key: "steps",
    title: "Step-by-step Fix",
    dot: "#c9a84c",
    color: "text-[#c9a84c]",
    border: "border-[#c9a84c]/15",
    bg: "bg-[#c9a84c]/04",
    type: "steps",
  },
  {
    key: "fixedCode",
    title: "Fixed Code",
    dot: "#a78bfa",
    color: "text-[#a78bfa]",
    border: "border-[#a78bfa]/15",
    bg: "bg-[#a78bfa]/04",
    type: "code",
  },
  {
    key: "mistakes",
    title: "Common Mistakes",
    dot: "#fb923c",
    color: "text-[#fb923c]",
    border: "border-[#fb923c]/15",
    bg: "bg-[#fb923c]/04",
    type: "mistakes",
  },
];

export default function OutputPanel({ data }) {
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 select-none">
      <div className="w-14 h-14 rounded-2xl bg-[#141310] border border-[#2a2820] flex items-center justify-center text-2xl mb-4">
        🔍
      </div>
      <p className="text-[#5a5448] text-sm font-mono">Paste an error and hit Debug</p>
      <p className="text-[#3a3530] text-xs mt-1">Results will appear here</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {CARDS.map((card, i) => {
        const value = data[card.key];
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        return (
          <div
            key={card.key}
            className={`rounded-xl border ${card.border} overflow-hidden`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`px-4 py-3 border-b ${card.border} ${card.bg} flex items-center gap-2.5`}>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: card.dot }}
              />
              <span className={`text-[10px] font-mono tracking-widest ${card.color}`}>
                {card.title.toUpperCase()}
              </span>
              {card.type === "code" && <CopyButton text={value} />}
            </div>

            <div className="bg-[#141310] px-4 py-3.5">
              {card.type === "text" && (
                <p className="text-[13px] text-[#d4cfc4] leading-relaxed">{value}</p>
              )}

              {card.type === "steps" && (
                <ol className="space-y-2.5">
                  {value.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#c9a84c]/08 border border-[#c9a84c]/25 text-[#c9a84c] text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[13px] text-[#d4cfc4] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {card.type === "code" && (
                <pre className="text-[12px] text-[#d4cfc4] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                  {value}
                </pre>
              )}

              {card.type === "mistakes" && (
                <ul className="space-y-2">
                  {value.map((mistake, i) => (
                    <li
                      key={i}
                      className={`flex gap-2.5 items-start text-[13px] text-[#d4cfc4] leading-relaxed ${
                        i < value.length - 1 ? "pb-2 border-b border-[#2a2820]" : ""
                      }`}
                    >
                      <span className="text-[#fb923c] flex-shrink-0 mt-0.5">⚠</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-auto text-[11px] px-2.5 py-1 rounded-md border border-[#a78bfa]/25 text-[#a78bfa] hover:bg-[#a78bfa]/08 transition-colors cursor-pointer font-mono"
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}