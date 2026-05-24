"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputPanel from "@/components/OutputPanel";
import DebugHistory from "@/components/DebugHistory";
import LandingPage from "@/components/LandingPage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("debug");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("input");

  if (status === "unauthenticated") return <LandingPage />;
  if (status === "loading") return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#0c0b09" }}>
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.3)", borderTopColor: "#c9a84c" }} />
    </div>
  );

  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);
    setError("");
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
    <div className="flex h-screen overflow-hidden" style={{ background: "#0c0b09", fontFamily: "'Outfit', sans-serif" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-30 h-full
        w-64 min-w-[240px] flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
        style={{ background: "#111009", borderRight: "1px solid rgba(240,236,224,0.06)" }}
      >

        {/* Logo */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#f0ece0" }}>
              DevSaga
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c" }}>
              beta
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden transition-colors p-1"
            style={{ color: "#5a5448" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <div className="p-3" style={{ borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
          <p className="text-[10px] tracking-widest px-2 mb-2 font-mono" style={{ color: "#3a3530" }}>MENU</p>
          <NavItem icon="🔍" label="Debug"       active={activeNav === "debug"}    onClick={() => { setActiveNav("debug"); setSidebarOpen(false); }} />
          <NavItem icon="📋" label="History"     active={activeNav === "history"}  onClick={() => { router.push("/history"); setSidebarOpen(false); }} />
          <NavItem icon="🧠" label="My Patterns" active={activeNav === "patterns"} onClick={() => { router.push("/irt"); setSidebarOpen(false); }} />
        </div>

        {/* Recent history */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          <p className="text-[10px] tracking-widest px-2 mb-2 font-mono" style={{ color: "#3a3530" }}>RECENT</p>
          {session ? (
            <DebugHistory onSelect={(r) => { setResult(r); setActivePanel("output"); setSidebarOpen(false); }} />
          ) : (
            <div className="px-2 py-3 rounded-lg text-center space-y-2" style={{ border: "1px solid rgba(240,236,224,0.06)" }}>
              <p className="text-xs font-mono" style={{ color: "#5a5448" }}>Sign in to view history</p>
              <button
                onClick={() => signIn()}
                className="w-full text-xs px-3 py-1.5 rounded-md transition-colors"
                style={{ background: "#c9a84c", color: "#0c0b09", fontWeight: 600 }}
              >
                Sign in
              </button>
            </div>
          )}
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(240,236,224,0.06)" }}>
          {session ? (
            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.02]">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#c9a84c", color: "#0c0b09" }}>
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: "#f0ece0" }}>{session.user.name}</p>
                <p className="text-xs" style={{ color: "#5a5448" }}>Free plan</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-[11px] font-mono transition-colors flex-shrink-0"
                style={{ color: "#5a5448" }}
                onMouseOver={e => e.target.style.color = "#f0ece0"}
                onMouseOut={e => e.target.style.color = "#5a5448"}
              >
                out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: "#1a1916" }} />
              <p className="text-sm truncate" style={{ color: "#5a5448" }}>Not signed in</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <div className="h-14 flex items-center px-4 gap-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden transition-colors flex-shrink-0"
            style={{ color: "#5a5448" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-base md:text-lg truncate" style={{ color: "#f0ece0", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
            Debug Session
          </h1>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleClear}
              className="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{ color: "#5a5448", border: "1px solid rgba(240,236,224,0.08)" }}
              onMouseOver={e => e.currentTarget.style.color = "#f0ece0"}
              onMouseOut={e => e.currentTarget.style.color = "#5a5448"}
            >
              Clear
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all cursor-pointer"
              style={{ background: "#c9a84c", color: "#0c0b09", fontWeight: 600 }}
            >
              + <span className="hidden sm:inline">New Debug</span>
            </button>
            {!session && (
              <button
                onClick={() => signIn()}
                className="px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors cursor-pointer font-mono"
                style={{ color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Mobile panel tabs */}
        <div className="md:hidden flex flex-shrink-0" style={{ borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
          <button
            onClick={() => setActivePanel("input")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${
              activePanel === "input" ? "border-b-2" : ""
            }`}
            style={{
              color: activePanel === "input" ? "#c9a84c" : "#5a5448",
              borderBottomColor: activePanel === "input" ? "#c9a84c" : "transparent",
            }}
          >
            INPUT
          </button>
          <button
            onClick={() => setActivePanel("output")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${
              activePanel === "output" ? "border-b-2" : ""
            }`}
            style={{
              color: activePanel === "output" ? "#c9a84c" : "#5a5448",
              borderBottomColor: activePanel === "output" ? "#c9a84c" : "transparent",
            }}
          >
            ANALYSIS
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden md:grid md:grid-cols-2">

          {/* Input panel */}
          <div className={`
            h-full overflow-y-auto p-4 md:p-6 scrollbar-thin
            md:block
            ${activePanel === "input" ? "block" : "hidden md:block"}
          `}
            style={{ borderRight: "1px solid rgba(240,236,224,0.06)" }}
          >
            <p className="text-[10px] tracking-widest font-mono mb-4" style={{ color: "#3a3530" }}>INPUT</p>
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
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
            <p className="text-[10px] tracking-widest font-mono mb-4" style={{ color: "#3a3530" }}>ANALYSIS</p>
            {loading ? <LoadingSkeleton /> : <OutputPanel data={result} />}
          </div>

        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-all cursor-pointer font-mono"
      style={{
        background: active ? "rgba(201,168,76,0.08)" : "transparent",
        color: active ? "#c9a84c" : "#5a5448",
        border: active ? "1px solid rgba(201,168,76,0.15)" : "1px solid transparent",
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.color = "#f0ece0"; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.color = "#5a5448"; }}
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
          className="rounded-xl p-4 animate-pulse"
          style={{ background: "#141310", border: "1px solid rgba(240,236,224,0.06)" }}
        >
          <div className="h-2 rounded w-1/3 mb-3" style={{ background: "#2a2820" }} />
          <div className="h-2 rounded w-full mb-2" style={{ background: "#2a2820" }} />
          <div className="h-2 rounded w-4/5" style={{ background: "#2a2820" }} />
        </div>
      ))}
    </div>
  );
}