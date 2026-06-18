"use client";

import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

        .font-display  { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono-jet { font-family: 'JetBrains Mono', monospace; }
        .font-body     { font-family: 'Outfit', sans-serif; }

        .amber-glow {
          box-shadow: 0 0 40px rgba(201,168,76,0.15);
        }
        .amber-glow-sm {
          box-shadow: 0 0 20px rgba(201,168,76,0.1);
        }
        .card-hover {
          transition: border-color 0.2s, transform 0.2s;
        }
        .card-hover:hover {
          border-color: rgba(201,168,76,0.2);
          transform: translateY(-2px);
        }
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .step-line {
          background: linear-gradient(to bottom, rgba(201,168,76,0.3), transparent);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.2s both; }
        .fade-up-4 { animation: fadeUp 0.6s ease 0.3s both; }
        .fade-up-5 { animation: fadeUp 0.6s ease 0.4s both; }

        .tag-pill {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.2);
          color: #c9a84c;
        }
        .btn-primary {
          background: #c9a84c;
          color: #0c0b09;
          font-weight: 600;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          background: #d4b55e;
          box-shadow: 0 0 28px rgba(201,168,76,0.3);
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(240,236,224,0.12);
          color: rgba(240,236,224,0.6);
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(240,236,224,0.3);
          color: #f0ece0;
        }
        .code-block {
          background: #0a0908;
          border: 1px solid rgba(126,200,160,0.15);
          border-radius: 8px;
        }
        .feature-card {
          background: #141310;
          border: 1px solid rgba(240,236,224,0.06);
          border-radius: 16px;
        }
        .number-badge {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.15);
          color: #c9a84c;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
        }
        .divider {
          border: none;
          border-top: 1px solid rgba(240,236,224,0.06);
        }
        .hero-code {
          background: #0a0908;
          border: 1px solid rgba(240,236,224,0.06);
          border-radius: 12px;
          padding: 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.7;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Grain overlay */}
      <div className="grain" />

      <div className="font-body min-h-screen" style={{ background: "#0c0b09", color: "#f0ece0" }}>

        {/* ── NAV ── */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "rgba(240,236,224,0.06)" }}>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold" style={{ color: "#f0ece0" }}>DevSaga</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: "rgba(240,236,224,0.4)" }}>
              Free to use
            </span>
            <button
              onClick={() => signIn()}
              className="btn-primary px-4 py-2 rounded-lg text-sm"
            >
              Sign in
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="px-6 md:px-12 pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto">

          <h1 className="font-display fade-up-2 mb-6 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "#f0ece0" }}>
            Your bugs are trying<br />
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>to teach you</span> something.
          </h1>

          <p className="fade-up-3 text-base md:text-lg mb-10 max-w-xl leading-relaxed" style={{ color: "rgba(240,236,224,0.5)" }}>
            DevSaga analyzes your debug history, identifies your weak spots as a developer,
            and builds a personalized path to make sure you never make the same mistake twice.
          </p>

          <div className="fade-up-4 flex flex-col sm:flex-row gap-3 mb-16">
            <button
              onClick={() => signIn("google")}
              className="btn-primary flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#0c0b09" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#0c0b09" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#0c0b09" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#0c0b09" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="btn-secondary flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Hero code preview */}
          <div className="fade-up-5 hero-code amber-glow-sm overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fb923c" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#7ec8a0" }} />
              <span className="ml-2 text-[11px]" style={{ color: "rgba(240,236,224,0.2)" }}>devsaga — debug session</span>
            </div>
            <div className="space-y-1 text-[12px]">
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>error     </span><span style={{ color: "#f87171" }}>ReferenceError: cartItemCount is not defined</span></p>
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>category  </span><span style={{ color: "#f0ece0" }}>Bug</span></p>
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>root      </span><span style={{ color: "#7ec8a0" }}>Variable used before declaration in function scope</span></p>
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>weak spot </span><span style={{ color: "#c9a84c" }}>Variable declaration and scope</span></p>
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>resources </span><span style={{ color: "#7ec8a0" }}>4 curated → MDN, javascript.info, The Odin Project</span></p>
              <p><span style={{ color: "rgba(240,236,224,0.25)" }}>test      </span><span style={{ color: "#c9a84c" }}>ready — 3 MCQ + 1 real-world code problem</span></p>
            </div>
          </div>
        </section>

        <hr className="divider mx-6 md:mx-12" />

        {/* ── HOW IT WORKS ── */}
        <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
          <p className="font-mono-jet text-[11px] tracking-widest mb-12" style={{ color: "rgba(240,236,224,0.3)" }}>
            HOW IT WORKS
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "Debug freely",
                body: "Paste your error and code. Get a structured AI breakdown — root cause, fix, corrected code, and what went wrong.",
                accent: "#7ec8a0",
              },
              {
                n: "02",
                title: "Find your patterns",
                body: "After enough sessions, AI analyzes your history and identifies which concepts you keep struggling with. Not one-offs — real patterns.",
                accent: "#c9a84c",
              },
              {
                n: "03",
                title: "Master the weak spot",
                body: "Get curated resources to learn the concept, then take an AI-generated real-world test scoped exactly to your failure pattern.",
                accent: "#a78bfa",
              },
            ].map((step) => (
              <div key={step.n} className="feature-card card-hover p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="number-badge" style={{ color: step.accent, borderColor: `${step.accent}30`, background: `${step.accent}10` }}>
                    {step.n}
                  </span>
                  <h3 className="font-display text-lg font-bold" style={{ color: "#f0ece0" }}>{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,236,224,0.45)" }}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider mx-6 md:mx-12" />

        {/* ── IRT FEATURE ── */}
        <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-16 items-center">
            <div>
              <p className="font-mono-jet text-[11px] tracking-widest mb-4" style={{ color: "rgba(240,236,224,0.3)" }}>
                THE TEST FEATURE
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-5 leading-tight" style={{ color: "#f0ece0" }}>
                Not a quiz.<br />
                <span style={{ color: "#c9a84c", fontStyle: "italic" }}>A real assessment.</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(240,236,224,0.45)" }}>
                Every other platform gives you generic multiple choice — "what's the output of this?" DevSaga generates scenario-based questions rooted in your actual mistakes. Real codebases. Real bugs. Real production situations.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Theory MCQ", desc: "Scenario-based — tests judgment, not memorization" },
                  { label: "Code Problem", desc: "Fix a real broken codebase scoped to your weak spot" },
                  { label: "AI Review", desc: "Honest mentor feedback — your gaps, your next step" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#c9a84c" }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#f0ece0" }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(240,236,224,0.35)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 md:mt-0">
              <div className="feature-card p-5 amber-glow-sm">
                <p className="font-mono-jet text-[10px] tracking-widest mb-4" style={{ color: "rgba(240,236,224,0.25)" }}>SAMPLE MCQ</p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#f0ece0" }}>
                  Your team's e-commerce cart sometimes shows "0 items" even when items exist. A teammate's fix works locally but crashes in production. What's the most likely root cause?
                </p>
                <div className="space-y-2">
                  {[
                    { opt: "A", label: "Network request failed silently", wrong: true },
                    { opt: "B", label: "Variable used before declaration in function scope", correct: true },
                    { opt: "C", label: "CSS display property hiding the count", wrong: true },
                    { opt: "D", label: "API returned an empty array", wrong: true },
                  ].map((o) => (
                    <div
                      key={o.opt}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs"
                      style={{
                        background: o.correct ? "rgba(126,200,160,0.08)" : "rgba(240,236,224,0.03)",
                        border: `1px solid ${o.correct ? "rgba(126,200,160,0.2)" : "rgba(240,236,224,0.06)"}`,
                        color: o.correct ? "#7ec8a0" : "rgba(240,236,224,0.4)",
                      }}
                    >
                      <span className="font-mono-jet">{o.opt}.</span>
                      <span>{o.label}</span>
                      {o.correct && <span className="ml-auto font-mono-jet text-[10px]">✓ correct</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider mx-6 md:mx-12" />


        {/* ── FINAL CTA ── */}
        <section className="px-6 md:px-12 py-24 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: "#f0ece0" }}>
            Start learning from<br />
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>every mistake.</span>
          </h2>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: "rgba(240,236,224,0.4)" }}>
            Free forever. No credit card needed. Debug your first error in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => signIn("google")} className="btn-primary px-8 py-3 rounded-xl text-sm">
              Sign in with Google
            </button>
            <button onClick={() => signIn("github")} className="btn-secondary px-8 py-3 rounded-xl text-sm">
              Sign in with GitHub
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(240,236,224,0.06)" }}>
          <span className="font-display font-bold text-sm" style={{ color: "rgba(240,236,224,0.3)" }}>DevSaga</span>
          <p className="font-mono-jet text-[11px]" style={{ color: "rgba(240,236,224,0.2)" }}>
            built by sandesh · {new Date().getFullYear()}
          </p>
          <a
            href="https://github.com/sandesh-Codes/devsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-jet text-[11px] transition-colors"
            style={{ color: "rgba(240,236,224,0.2)" }}
            onMouseOver={e => e.target.style.color = "rgba(240,236,224,0.5)"}
            onMouseOut={e => e.target.style.color = "rgba(240,236,224,0.2)"}
          >
            github ↗
          </a>
        </footer>

      </div>
    </>
  );
}