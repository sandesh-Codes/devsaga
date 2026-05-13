"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputPanel from "@/components/OutputPanel";
import DebugHistory from "@/components/DebugHistory";
 
export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("debug");
 
  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div className="flex h-screen bg-[#07070f] overflow-hidden">
 
      {/* ── SIDEBAR ── */}
      <aside className="w-60 min-w-[240px] bg-[#0d0d1a] border-r border-[#1e1e30] flex flex-col">
 
        {/* Logo */}
        <div className="p-5 border-b border-[#1e1e30]">
  <img src="/devsaga-logo.svg" alt="DevSaga" className="h-20 w-auto" />
</div>
 
        {/* Nav */}
        <div className="p-3 border-b border-[#1e1e30]">
          <p className="text-[10px] tracking-widest text-[#4a4a65] px-2 mb-2 font-mono">MENU</p>
          <NavItem icon="🔍" label="Debug"      active={activeNav === "debug"}    onClick={() => setActiveNav("debug")} />
          <NavItem icon="📋" label="History"    active={activeNav === "history"}  onClick={() => setActiveNav("history")} />
          <NavItem icon="🧠" label="My Patterns" active={activeNav === "patterns"} onClick={() => setActiveNav("patterns")} />
          <NavItem icon="📚" label="Resources"  active={activeNav === "resources"} onClick={() => setActiveNav("resources")} />
        </div>
 
        {/* Recent history list */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          <p className="text-[10px] tracking-widest text-[#4a4a65] px-2 mb-2 font-mono">RECENT</p>
          <DebugHistory onSelect={setResult} />
        </div>
 
        {/* User */}
        <div className="p-3 border-t border-[#1e1e30]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6af7] to-[#60a5fa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">sandesh-codes</p>
              <p className="text-xs text-[#6b6b8a]">Free plan</p>
            </div>
          </div>
        </div>
      </aside>
 
      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
 
        {/* Topbar */}
        <div className="h-14 border-b border-[#1e1e30] flex items-center px-6 gap-3 flex-shrink-0">
          <h1 className="font-serif text-lg text-white">Debug Session</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { setResult(null); setError(""); }}
              className="px-4 py-1.5 text-sm text-[#6b6b8a] border border-[#2a2a40] rounded-lg hover:text-white hover:border-[#4a4a65] transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => { setResult(null); setError(""); }}
              className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-[#7c6af7] to-[#60a5fa] rounded-lg shadow-[0_0_20px_rgba(124,106,247,0.3)] hover:shadow-[0_0_28px_rgba(124,106,247,0.5)] hover:-translate-y-px transition-all cursor-pointer"
            >
              ⚡ New Debug
            </button>
          </div>
        </div>
 
        {/* Content grid */}
        <div className="flex-1 grid grid-cols-2 overflow-hidden">
 
          {/* Input panel */}
          <div className="border-r border-[#1e1e30] overflow-y-auto p-6 scrollbar-thin">
            <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-4">INPUT</p>
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
 
          {/* Output panel */}
          <div className="overflow-y-auto p-6 scrollbar-thin">
            <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-4">ANALYSIS</p>
            {loading ? <LoadingSkeleton /> : <OutputPanel data={result} />}
          </div>
 
        </div>
      </div>
    </div>
  );
}
 
/* ── Small reusable components ── */
 
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-all cursor-pointer ${
        active
          ? "bg-[#7c6af7]/15 text-[#a78bfa] font-medium"
          : "text-[#6b6b8a] hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </button>
  );
}
 
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#0d0d1a] border border-[#1e1e30] rounded-xl p-4 animate-pulse"
        >
          <div className="h-2.5 bg-[#1e1e30] rounded w-1/3 mb-3" />
          <div className="h-2.5 bg-[#1e1e30] rounded w-full mb-2" />
          <div className="h-2.5 bg-[#1e1e30] rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}