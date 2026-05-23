"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputPanel from "@/components/OutputPanel";
import DebugHistory from "@/components/DebugHistory";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("debug");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("input"); // mobile panel toggle

  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);
    setError("");
    // on mobile, switch to output panel when submit starts
    setActivePanel("output");
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
      setActivePanel("input");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResult(null);
    setError("");
    setActivePanel("input");
  }

  return (
    <div className="flex h-screen bg-[#07070f] overflow-hidden">

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed md:static z-30 h-full
        w-64 min-w-[240px] bg-[#0d0d1a] border-r border-[#1e1e30] flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="p-5 border-b border-[#1e1e30] flex items-center justify-between">
          <img src="/devsaga-logo.svg" alt="DevSaga" className="h-16 w-auto" />
          {/* Close button mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#4a4a65] hover:text-white transition-colors p-1"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        {/* Nav */}
        <div className="p-3 border-b border-[#1e1e30]">
          <p className="text-[10px] tracking-widest text-[#4a4a65] px-2 mb-2 font-mono">MENU</p>
          <NavItem icon="🔍" label="Debug"       active={activeNav === "debug"}     onClick={() => { setActiveNav("debug"); setSidebarOpen(false); }} />
          <NavItem icon="📋" label="History"     active={activeNav === "history"}   onClick={() => { router.push("/history"); setSidebarOpen(false); }} />
          <NavItem icon="🧠" label="My Patterns" active={activeNav === "patterns"}  onClick={() => { router.push("/irt"); setSidebarOpen(false); }} />
        </div>

        {/* Recent history list */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          <p className="text-[10px] tracking-widest text-[#4a4a65] px-2 mb-2 font-mono">RECENT</p>
          {session ? (
            <DebugHistory onSelect={(r) => { setResult(r); setActivePanel("output"); setSidebarOpen(false); }} />
          ) : (
            <div className="px-2 py-3 rounded-lg border border-[#1e1e30] text-center space-y-2">
              <p className="text-xs text-[#4a4a65] font-mono">Sign in to view history</p>
              <button
                onClick={() => signIn()}
                className="w-full text-xs bg-[#7c6af7] hover:bg-[#6a59e0] text-white px-3 py-1.5 rounded-md transition-colors"
              >
                Sign in
              </button>
            </div>
          )}
        </div>

        
       {/* User */}
<div className="p-3 border-t border-[#1e1e30]">
  {session ? (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
      {session.user.image ? (
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6af7] to-[#60a5fa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {session.user.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-white font-medium truncate">{session.user.name}</p>
        <p className="text-xs text-[#6b6b8a]">Free plan</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 p-2 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-[#1e1e30] flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm text-[#4a4a65] truncate">Not signed in</p>
      </div>
    </div>
  )}
</div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <div className="h-14 border-b border-[#1e1e30] flex items-center px-4 gap-3 flex-shrink-0">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#4a4a65] hover:text-white transition-colors flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="font-serif text-base md:text-lg text-white truncate">Debug Session</h1>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {/* Hide Clear on mobile */}
            <button
              onClick={handleClear}
              className="hidden sm:block px-3 py-1.5 text-sm text-[#6b6b8a] border border-[#2a2a40] rounded-lg hover:text-white hover:border-[#4a4a65] transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs md:text-sm text-white bg-gradient-to-r from-[#7c6af7] to-[#60a5fa] rounded-lg shadow-[0_0_20px_rgba(124,106,247,0.3)] hover:shadow-[0_0_28px_rgba(124,106,247,0.5)] transition-all cursor-pointer"
            >
              ⚡ <span className="hidden sm:inline">New Debug</span>
            </button>
            {session ? (
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 text-xs md:text-sm text-[#6b6b8a] border border-[#2a2a40] rounded-lg hover:text-white hover:border-[#4a4a65] transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-3 py-1.5 text-xs md:text-sm text-[#7c6af7] border border-[#7c6af7]/40 rounded-lg hover:bg-[#7c6af7]/10 transition-colors cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* ── MOBILE PANEL TABS ── */}
        <div className="md:hidden flex border-b border-[#1e1e30] flex-shrink-0">
          <button
            onClick={() => setActivePanel("input")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${
              activePanel === "input"
                ? "text-[#7c6af7] border-b-2 border-[#7c6af7]"
                : "text-[#4a4a65]"
            }`}
          >
            INPUT
          </button>
          <button
            onClick={() => setActivePanel("output")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${
              activePanel === "output"
                ? "text-[#7c6af7] border-b-2 border-[#7c6af7]"
                : "text-[#4a4a65]"
            }`}
          >
            ANALYSIS
          </button>
        </div>

        {/* ── CONTENT ── */}
        {/* Desktop: side by side | Mobile: tabbed single panel */}
        <div className="flex-1 overflow-hidden md:grid md:grid-cols-2">

          {/* Input panel */}
          <div className={`
            h-full border-[#1e1e30] overflow-y-auto p-4 md:p-6 scrollbar-thin
            md:border-r md:block
            ${activePanel === "input" ? "block" : "hidden md:block"}
          `}>
            <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-4">INPUT</p>
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output panel */}
          <div className={`
            h-full overflow-y-auto p-4 md:p-6 scrollbar-thin
            md:block
            ${activePanel === "output" ? "block" : "hidden md:block"}
          `}>
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