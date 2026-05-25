"use client";
import { useState, useRef, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = ["Bug", "Unexpected Behaviour", "Performance", "API Issue"];

const OUTPUT_SECTIONS = [
  {
    key: "rootCause",
    label: "ROOT CAUSE",
    dot: "#f87171",
    type: "text",
  },
  {
    key: "explanation",
    label: "EXPLANATION",
    dot: "#7ec8a0",
    type: "text",
  },
  {
    key: "steps",
    label: "STEP-BY-STEP FIX",
    dot: "#c9a84c",
    type: "steps",
  },
  {
    key: "fixedCode",
    label: "FIXED CODE",
    dot: "#a78bfa",
    type: "code",
  },
  {
    key: "mistakes",
    label: "COMMON MISTAKES",
    dot: "#fb923c",
    type: "mistakes",
  },
];

// ── Topbar ─────────────────────────────────────────────────────────────────

function Topbar({ session, onSignOut }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 h-14"
      style={{ background: "rgba(12,11,9,0.95)", borderBottom: "1px solid rgba(240,236,224,0.06)", backdropFilter: "blur(12px)" }}
    >
      {/* Logo */}
      <span
        className="font-bold text-lg cursor-pointer"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f0ece0" }}
        onClick={() => router.push("/")}
      >
        DevSaga
      </span>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        <NavLink href="/" label="Debug" active />
        <NavLink href="/history" label="History" />
        <NavLink href="/irt" label="My Patterns" />
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/irt")}
              className="hidden md:block text-xs font-mono px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c" }}
            >
              🧠 My Patterns
            </button>
            {/* Avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg p-1 transition-colors"
                style={{ border: "1px solid rgba(240,236,224,0.06)" }}
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#c9a84c", color: "#0c0b09" }}>
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm max-w-[120px] truncate" style={{ color: "#8a8070" }}>
                  {session.user.name}
                </span>
                <svg viewBox="0 0 24 24" className="w-3 h-3 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "#5a5448" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-10 w-44 rounded-xl z-20 py-1 overflow-hidden" style={{ background: "#141310", border: "1px solid rgba(240,236,224,0.08)" }}>
                    <Link href="/history" className="block px-4 py-2.5 text-sm transition-colors font-mono" style={{ color: "#8a8070" }}
                      onMouseOver={e => e.currentTarget.style.color = "#f0ece0"}
                      onMouseOut={e => e.currentTarget.style.color = "#8a8070"}
                      onClick={() => setMenuOpen(false)}
                    >
                      History
                    </Link>
                    <Link href="/irt" className="block px-4 py-2.5 text-sm transition-colors font-mono" style={{ color: "#8a8070" }}
                      onMouseOver={e => e.currentTarget.style.color = "#f0ece0"}
                      onMouseOut={e => e.currentTarget.style.color = "#8a8070"}
                      onClick={() => setMenuOpen(false)}
                    >
                      My Patterns
                    </Link>
                    <div style={{ height: "1px", background: "rgba(240,236,224,0.06)", margin: "4px 0" }} />
                    <button
                      onClick={() => { onSignOut(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors font-mono"
                      style={{ color: "#f87171" }}
                      onMouseOver={e => e.currentTarget.style.color = "#fca5a5"}
                      onMouseOut={e => e.currentTarget.style.color = "#f87171"}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm px-4 py-2 rounded-lg font-semibold transition-all"
            style={{ background: "#c9a84c", color: "#0c0b09" }}
          >
            Sign in
          </button>
        )}

        {/* Mobile menu */}
        <MobileMenu session={session} onSignOut={onSignOut} />
      </div>
    </header>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-mono transition-all"
      style={{
        color: active ? "#c9a84c" : "#5a5448",
        background: active ? "rgba(201,168,76,0.08)" : "transparent",
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.color = "#f0ece0"; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.color = "#5a5448"; }}
    >
      {label}
    </Link>
  );
}

function MobileMenu({ session, onSignOut }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} style={{ color: "#5a5448" }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed top-14 left-0 right-0 z-20 py-2" style={{ background: "#111009", borderBottom: "1px solid rgba(240,236,224,0.06)" }}>
            <MobileNavItem label="Debug" onClick={() => { router.push("/"); setOpen(false); }} />
            <MobileNavItem label="History" onClick={() => { router.push("/history"); setOpen(false); }} />
            <MobileNavItem label="My Patterns" onClick={() => { router.push("/irt"); setOpen(false); }} />
            {session && (
              <MobileNavItem label="Sign out" onClick={() => { onSignOut(); setOpen(false); }} danger />
            )}
            {!session && (
              <MobileNavItem label="Sign in" onClick={() => { signIn(); setOpen(false); }} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MobileNavItem({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-6 py-3 text-sm font-mono transition-colors"
      style={{ color: danger ? "#f87171" : "#8a8070" }}
    >
      {label}
    </button>
  );
}

// ── Input section ──────────────────────────────────────────────────────────

function DebugInput({ onSubmit, loading, onClear, hasResult }) {
  const [form, setForm] = useState({
    error: "",
    code: "",
    context: "",
    category: "Bug",
    simpler: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputBase = {
    background: "#141310",
    border: "1px solid rgba(240,236,224,0.08)",
    borderRadius: "12px",
    color: "#f0ece0",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13px",
    padding: "12px 16px",
    outline: "none",
    width: "100%",
    resize: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Error */}
        <div className="space-y-1.5">
          <label className="text-[10px] tracking-widest font-mono" style={{ color: "#3a3530" }}>ERROR MESSAGE</label>
          <input
            name="error"
            placeholder="Paste your error here..."
            value={form.error}
            onChange={e => setForm({ ...form, error: e.target.value })}
            required
            style={inputBase}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(240,236,224,0.08)"}
          />
        </div>

        {/* Code */}
        <div className="space-y-1.5">
          <label className="text-[10px] tracking-widest font-mono" style={{ color: "#3a3530" }}>CODE</label>
          <textarea
            name="code"
            placeholder="Paste the relevant code..."
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            required
            rows={8}
            style={inputBase}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(240,236,224,0.08)"}
          />
        </div>

        {/* Context */}
        <div className="space-y-1.5">
          <label className="text-[10px] tracking-widest font-mono" style={{ color: "#3a3530" }}>
            CONTEXT <span style={{ color: "#2a2820" }}>— optional</span>
          </label>
          <textarea
            name="context"
            placeholder="What were you trying to do?"
            value={form.context}
            onChange={e => setForm({ ...form, context: e.target.value })}
            rows={3}
            style={inputBase}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(240,236,224,0.08)"}
          />
        </div>

        {/* Category + Simpler row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="space-y-1.5 flex-1">
            <label className="text-[10px] tracking-widest font-mono" style={{ color: "#3a3530" }}>CATEGORY</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer"
                  style={{
                    background: form.category === cat ? "rgba(201,168,76,0.10)" : "transparent",
                    border: form.category === cat ? "1px solid rgba(201,168,76,0.35)" : "1px solid rgba(240,236,224,0.08)",
                    color: form.category === cat ? "#c9a84c" : "#5a5448",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Simpler toggle */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setForm({ ...form, simpler: !form.simpler })}
              className="relative w-9 h-5 rounded-full transition-all cursor-pointer flex-shrink-0"
              style={{ background: form.simpler ? "#c9a84c" : "rgba(240,236,224,0.08)" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform"
                style={{ background: "#f0ece0", transform: form.simpler ? "translateX(16px)" : "translateX(0)" }}
              />
            </button>
            <span className="text-xs font-mono" style={{ color: form.simpler ? "#c9a84c" : "#5a5448" }}>
              Explain simpler
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#c9a84c", color: "#0c0b09" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(12,11,9,0.3)", borderTopColor: "#0c0b09" }} />
                Analyzing...
              </span>
            ) : "Debug →"}
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-3 rounded-xl text-sm font-mono transition-all"
              style={{ border: "1px solid rgba(240,236,224,0.08)", color: "#5a5448" }}
              onMouseOver={e => e.currentTarget.style.color = "#f0ece0"}
              onMouseOut={e => e.currentTarget.style.color = "#5a5448"}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ── Output section ─────────────────────────────────────────────────────────

function DebugOutput({ data, loading }) {
  const ref = useRef(null);

  useEffect(() => {
    if (data && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  if (loading) {
    return (
      <div ref={ref} className="w-full max-w-2xl mx-auto mt-8 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "#c9a84c" }} />
          <span className="text-sm font-mono" style={{ color: "#5a5448" }}>Analyzing your error...</span>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: "#141310", border: "1px solid rgba(240,236,224,0.06)" }}>
            <div className="h-2 rounded w-1/4 mb-4" style={{ background: "#2a2820" }} />
            <div className="space-y-2">
              <div className="h-2 rounded w-full" style={{ background: "#2a2820" }} />
              <div className="h-2 rounded w-4/5" style={{ background: "#2a2820" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto mt-10">

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: "rgba(240,236,224,0.06)" }} />
        <span className="text-[10px] font-mono tracking-widest" style={{ color: "#3a3530" }}>ANALYSIS</span>
        <div className="flex-1 h-px" style={{ background: "rgba(240,236,224,0.06)" }} />
      </div>

      <div className="space-y-4">
        {OUTPUT_SECTIONS.map((section, i) => {
          const value = data[section.key];
          if (!value || (Array.isArray(value) && value.length === 0)) return null;

          return (
            <div
              key={section.key}
              className="rounded-xl overflow-hidden"
              style={{
                background: "#141310",
                border: `1px solid rgba(240,236,224,0.06)`,
                animation: `fadeUp 0.4s ease ${i * 80}ms both`,
              }}
            >
              {/* Section header */}
              <div className="flex items-center gap-2.5 px-5 py-3" style={{ borderBottom: "1px solid rgba(240,236,224,0.05)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: section.dot }} />
                <span className="text-[10px] font-mono tracking-widest" style={{ color: section.dot, opacity: 0.8 }}>
                  {section.label}
                </span>
                {section.type === "code" && <CopyButton text={value} />}
              </div>

              {/* Section body */}
              <div className="px-5 py-4">
                {section.type === "text" && (
                  <p className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{value}</p>
                )}

                {section.type === "steps" && (
                  <ol className="space-y-3">
                    {value.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono flex-shrink-0 mt-0.5" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c" }}>
                          {i + 1}
                        </span>
                        <span className="text-[13px] leading-relaxed" style={{ color: "#d4cfc4" }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {section.type === "code" && (
                  <pre className="text-[12px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap break-words" style={{ color: "#d4cfc4" }}>
                    {value}
                  </pre>
                )}

                {section.type === "mistakes" && (
                  <ul className="space-y-2.5">
                    {value.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: "#d4cfc4" }}>
                        <span className="flex-shrink-0 mt-0.5" style={{ color: "#fb923c" }}>⚠</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-analysis nudge */}
      <div className="mt-8 p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}>
        <span>🧠</span>
        <p className="text-xs font-mono" style={{ color: "#8a8070" }}>
          This session has been saved to your history.{" "}
          <Link href="/irt" className="transition-colors" style={{ color: "#c9a84c" }}>
            Check your patterns →
          </Link>
        </p>
      </div>
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
      className="ml-auto text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer"
      style={{ border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState({ session }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 font-mono text-[11px]" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", color: "#c9a84c" }}>
        ✦ free to use {session ? "" : "— sign in to save history"}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f0ece0" }}>
        What broke today?
      </h2>
      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "#5a5448" }}>
        Paste your error above. DevSaga will find the root cause, explain it clearly, and show you the fix.
      </p>

      {!session && (
        <div className="mt-8 p-4 rounded-xl max-w-sm mx-auto" style={{ background: "#141310", border: "1px solid rgba(240,236,224,0.06)" }}>
          <p className="text-xs font-mono mb-3" style={{ color: "#5a5448" }}>Sign in to unlock history + IRT</p>
          <button
            onClick={() => signIn()}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "#c9a84c", color: "#0c0b09" }}
          >
            Sign in free
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Home() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") return <LandingPage />;
  if (status === "loading") return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#0c0b09" }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "#c9a84c" }} />
    </div>
  );

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
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResult(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "#0c0b09", color: "#f0ece0", fontFamily: "'Outfit', sans-serif" }}>

        <Topbar session={session} onSignOut={() => signOut()} />

        <main className="px-6 md:px-10 py-10 pb-24">

          {/* Input always visible */}
          <DebugInput
            onSubmit={handleSubmit}
            loading={loading}
            onClear={handleClear}
            hasResult={!!result}
          />

          {/* Error */}
          {error && (
            <div className="w-full max-w-2xl mx-auto mt-4 p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Empty state when no result and not loading */}
          {!result && !loading && !error && <EmptyState session={session} />}

          {/* Output flows in below */}
          <DebugOutput data={result} loading={loading} />

        </main>
      </div>
    </>
  );
}