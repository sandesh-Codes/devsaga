"use client";
 
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
 
const CATEGORY_COLORS = {
  Bug:                   { bg: "bg-[#f87171]/10", text: "text-[#f87171]" },
  "Unexpected Behaviour": { bg: "bg-[#fb923c]/10", text: "text-[#fb923c]" },
  Performance:           { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]" },
  "API Issue":           { bg: "bg-[#a78bfa]/10", text: "text-[#a78bfa]" },
};
 
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)           return "just now";
  if (diff < 3600)         return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)   return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
 
export default function DebugHistory({ onSelect }) {
  const [history, setHistory]   = useState([]);
  const [activeId, setActiveId] = useState(null);
 
  useEffect(() => {
    async function loadHistory() {
      try {
        const res  = await fetch("/api/history");
        const data = await res.json().catch(() => []);
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("History fetch error: ", error);
      }
    }
    loadHistory();
  }, []);
 
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-2xl mb-2">🔍</span>
        <p className="text-xs text-[#4a4a65]">No history yet</p>
        <p className="text-[11px] text-[#2a2a40] mt-0.5">Debug something to get started</p>
      </div>
    );
  }
 
  return (
    <ScrollArea className="flex-1 min-h-0 h-full -mx-1">
      <div className="space-y-1 px-1">
        {history.map((item) => {
          const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["Bug"];
          const isActive = activeId === item.id;
 
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveId(item.id);
                onSelect(item.response);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer group ${
                isActive
                  ? "bg-[#7c6af7]/08 border-[#7c6af7]/25"
                  : "border-transparent hover:bg-white/[0.03] hover:border-[#1e1e30]"
              }`}
            >
              {/* Error preview */}
              <p className="text-[12.5px] text-[#e8e8f0] truncate leading-snug mb-1.5">
                {item.error?.slice(0, 48)}
                {item.error?.length > 48 ? "…" : ""}
              </p>
 
              {/* Meta row */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {item.category || "Bug"}
                </span>
                <span className="text-[10px] text-[#4a4a65] ml-auto">
                  {item.createdAt ? timeAgo(item.createdAt) : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <ScrollBar className="bg-transparent [&>div]:bg-[#2a2a40] hover:[&>div]:bg-[#7c6af7]" />
    </ScrollArea>
  );
}
 