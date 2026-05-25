"use client";
import { useState } from "react";
 
const CARDS = [
  {
    key: "explanation",
    title: "Simple Explanation",
    dot: "#60a5fa",
    color: "text-[#60a5fa]",
    border: "border-[#60a5fa]/20",
    bg: "bg-[#60a5fa]/5",
    type: "text",
  },
  {
    key: "rootCause",
    title: "Root Cause",
    dot: "#f87171",
    color: "text-[#f87171]",
    border: "border-[#f87171]/20",
    bg: "bg-[#f87171]/5",
    type: "text",
  },
  {
    key: "steps",
    title: "Step-by-step Fix",
    dot: "#34d399",
    color: "text-[#34d399]",
    border: "border-[#34d399]/20",
    bg: "bg-[#34d399]/5",
    type: "steps",
  },
  {
    key: "fixedCode",
    title: "Fixed Code",
    dot: "#a78bfa",
    color: "text-[#a78bfa]",
    border: "border-[#a78bfa]/20",
    bg: "bg-[#a78bfa]/5",
    type: "code",
  },
  {
    key: "mistakes",
    title: "Common Mistakes",
    dot: "#fb923c",
    color: "text-[#fb923c]",
    border: "border-[#fb923c]/20",
    bg: "bg-[#fb923c]/5",
    type: "mistakes",
  },
];
 
export default function OutputPanel({ data }) {
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 select-none">
      <div className="w-14 h-14 rounded-2xl bg-[#0d0d1a] border border-[#1e1e30] flex items-center justify-center text-2xl mb-4">
        ⚡
      </div>
      <p className="text-[#4a4a65] text-sm">Paste an error and hit Analyze</p>
      <p className="text-[#2a2a40] text-xs mt-1">Results will appear here</p>
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
            {/* Card header */}
            <div className={`px-4 py-3 border-b ${card.border} ${card.bg} flex items-center gap-2.5`}>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: card.dot, boxShadow: `0 0 6px ${card.dot}` }}
              />
              <span className={`text-xs font-semibold tracking-wide ${card.color}`}>
                {card.title}
              </span>
              {card.type === "code" && <CopyButton text={value} />}
            </div>
 
            {/* Card body */}
            <div className="bg-[#0d0d1a] px-4 py-3.5">
              {card.type === "text" && (
                <p className="text-[13px] text-[#c4c4d8] leading-relaxed">{value}</p>
              )}
 
              {card.type === "steps" && (
                <ol className="space-y-2.5">
                  {value.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[13px] text-[#c4c4d8] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
 
              {card.type === "code" && (
                <pre className="text-[12px] text-[#c4c4d8] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                  {value}
                </pre>
              )}
 
              {card.type === "mistakes" && (
                <ul className="space-y-2">
                  {value.map((mistake, i) => (
                    <li
                      key={i}
                      className={`flex gap-2.5 items-start text-[13px] text-[#c4c4d8] leading-relaxed ${
                        i < value.length - 1 ? "pb-2 border-b border-[#1e1e30]" : ""
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
      className="ml-auto text-[11px] px-2.5 py-1 rounded-md border border-[#a78bfa]/30 text-[#a78bfa] hover:bg-[#a78bfa]/10 transition-colors cursor-pointer"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
 