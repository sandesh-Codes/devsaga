"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

// ── Icons ──────────────────────────────────────────────────────────────────

function ChevronIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ResourceIcon({ type }) {
  const icons = {
    article:       { icon: "📄", color: "text-[#60a5fa]",  bg: "bg-[#60a5fa]/10"  },
    video:         { icon: "▶️",  color: "text-[#f87171]",  bg: "bg-[#f87171]/10"  },
    documentation: { icon: "📚", color: "text-[#a78bfa]",  bg: "bg-[#a78bfa]/10"  },
    exercise:      { icon: "⚡", color: "text-[#34d399]",  bg: "bg-[#34d399]/10"  },
  };
  const t = icons[type] || icons.article;
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${t.bg} ${t.color}`}>
      {t.icon} {type}
    </span>
  );
}

// ── Confidence bar ─────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  const pct = Math.round((value / 10) * 100);
  const color = value >= 8 ? "#f87171" : value >= 5 ? "#fb923c" : "#34d399";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-[#1e1e30] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-mono text-[#4a4a65]">{value}/10</span>
    </div>
  );
}

// ── Resources section ──────────────────────────────────────────────────────

function ResourcesSection({ weakSpotId, initialResources }) {
  const [resources, setResources]   = useState(initialResources || []);
  const [loading, setLoading]       = useState(false);
  const [loaded, setLoaded]         = useState((initialResources || []).length > 0);

  async function loadResources() {
    setLoading(true);
    try {
      const res  = await fetch("/api/irt/resources", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ weakSpotId }),
      });
      const data = await res.json();
      if (data.resources) { setResources(data.resources); setLoaded(true); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (!loaded) {
    return (
      <button
        onClick={loadResources}
        disabled={loading}
        className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-[#2a2a40] text-[12px] text-[#4a4a65] hover:border-[#7c6af7]/50 hover:text-[#7c6af7] transition-all font-mono tracking-wide disabled:opacity-50"
      >
        {loading ? "Loading resources…" : "📚 Load Resources"}
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-3">RESOURCES</p>
      {resources.map((r) => (
        <a
          key={r.id}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg bg-[#07070f] border border-[#1e1e30] hover:border-[#7c6af7]/30 hover:bg-[#0d0d1a] transition-all group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#c8c8d8] group-hover:text-[#e8e8f0] transition-colors truncate">
              {r.title}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ResourceIcon type={r.type} />
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#2a2a40] group-hover:text-[#7c6af7] transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}

// ── Test section ───────────────────────────────────────────────────────────

function TestSection({ weakSpotId, initialTest }) {
  const [test, setTest]             = useState(initialTest || null);
  const [loading, setLoading]       = useState(false);
  const [step, setStep]             = useState("idle"); // idle | mcq | code | review
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [codeAnswer, setCodeAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview]         = useState(null);

  async function generateTest() {
    setLoading(true);
    try {
      const res  = await fetch("/api/irt/test/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ weakSpotId }),
      });
      const data = await res.json();
      if (data.test) { setTest(data.test); setStep("mcq"); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function startExistingTest() {
    setStep("mcq");
    setMcqAnswers({});
    setCodeAnswer("");
    setReview(null);
  }

  async function submitTest() {
    if (Object.keys(mcqAnswers).length < test.mcq.length) {
      alert("Please answer all MCQ questions before continuing.");
      return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch("/api/irt/test/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          testId:     test.id,
          mcqAnswers: test.mcq.map((_, i) => mcqAnswers[i] || ""),
          codeAnswer,
        }),
      });
      const data = await res.json();
      if (data.review) { setReview(data.review); setStep("review"); }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  }

  // ── Idle: no test yet
  if (step === "idle" && !test) {
    return (
      <button
        onClick={generateTest}
        disabled={loading}
        className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-[#2a2a40] text-[12px] text-[#4a4a65] hover:border-[#a78bfa]/50 hover:text-[#a78bfa] transition-all font-mono tracking-wide disabled:opacity-50"
      >
        {loading ? "Generating test…" : "🧪 Take Test"}
      </button>
    );
  }

  // ── Test exists but not started
  if (step === "idle" && test) {
    return (
      <button
        onClick={startExistingTest}
        className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-[#2a2a40] text-[12px] text-[#4a4a65] hover:border-[#a78bfa]/50 hover:text-[#a78bfa] transition-all font-mono tracking-wide"
      >
        🧪 Retake Test
      </button>
    );
  }

  // ── MCQ step
  if (step === "mcq" && test) {
    return (
      <div className="mt-4 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono">THEORY TEST — MCQ</p>
          <span className="text-[11px] font-mono text-[#4a4a65]">{Object.keys(mcqAnswers).length}/{test.mcq.length} answered</span>
        </div>

        {test.mcq.map((q, qi) => (
          <div key={qi} className="rounded-lg border border-[#1e1e30] bg-[#07070f] p-4 space-y-3">
            <p className="text-[13px] text-[#e8e8f0] leading-relaxed">
              <span className="text-[#4a4a65] font-mono mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const letter = ["A", "B", "C", "D"][oi];
                const selected = mcqAnswers[qi] === letter;
                return (
                  <button
                    key={oi}
                    onClick={() => setMcqAnswers(prev => ({ ...prev, [qi]: letter }))}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-[13px] transition-all border ${
                      selected
                        ? "border-[#7c6af7]/60 bg-[#7c6af7]/10 text-[#a78bfa]"
                        : "border-[#1e1e30] text-[#6b6b8a] hover:border-[#2a2a40] hover:text-[#c8c8d8]"
                    }`}
                  >
                    <span className="font-mono mr-2">{letter}.</span>
                    {opt.replace(/^[A-D]\.\s*/, "")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={() => setStep("code")}
          disabled={Object.keys(mcqAnswers).length < test.mcq.length}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#7c6af7] to-[#60a5fa] text-white text-[13px] font-medium disabled:opacity-40 hover:shadow-[0_0_20px_rgba(124,106,247,0.3)] transition-all"
        >
          Continue to Code Problem →
        </button>
      </div>
    );
  }

  // ── Code problem step
  if (step === "code" && test) {
    const cp = test.codeProblem;
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono">CODE PROBLEM</p>
          <button onClick={() => setStep("mcq")} className="text-[11px] font-mono text-[#4a4a65] hover:text-[#e8e8f0] transition-colors">
            ← Back to MCQ
          </button>
        </div>

        {/* Scenario */}
        <div className="rounded-lg border border-[#1e1e30] bg-[#07070f] p-4">
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">SCENARIO</p>
          <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{cp.scenario}</p>
        </div>

        {/* Task */}
        <div className="rounded-lg border border-[#1e1e30] bg-[#07070f] p-4">
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">TASK</p>
          <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{cp.task}</p>
        </div>

        {/* Broken code */}
        <div>
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">BROKEN CODE</p>
          <pre className="text-[12px] text-[#f87171] font-mono bg-[#07070f] border border-[#f87171]/20 rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
            {cp.brokenCode}
          </pre>
        </div>

        {/* Hint */}
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#fb923c]/5 border border-[#fb923c]/20">
          <span className="text-[#fb923c] text-xs shrink-0 mt-0.5">💡</span>
          <p className="text-[12px] text-[#fb923c]/80 leading-relaxed">{cp.hint}</p>
        </div>

        {/* Answer area */}
        <div>
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">YOUR SOLUTION</p>
          <textarea
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            placeholder="Write your fix here — identify the bug, fix it, and explain why it was wrong..."
            rows={10}
            className="w-full bg-[#07070f] border border-[#1e1e30] rounded-lg p-4 text-[12px] text-[#c8c8d8] font-mono placeholder-[#2a2a40] focus:outline-none focus:border-[#7c6af7]/50 resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={submitTest}
          disabled={!codeAnswer.trim() || submitting}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#7c6af7] to-[#60a5fa] text-white text-[13px] font-medium disabled:opacity-40 hover:shadow-[0_0_20px_rgba(124,106,247,0.3)] transition-all"
        >
          {submitting ? "AI is reviewing your submission…" : "Submit for Review →"}
        </button>
      </div>
    );
  }

  // ── Review step
  if (step === "review" && review) {
    const fb = review.feedback;
    const score = review.score;
    const scoreColor = score >= 80 ? "#34d399" : score >= 60 ? "#fb923c" : "#f87171";

    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono">AI REVIEW</p>
          <button
            onClick={() => { setStep("idle"); setMcqAnswers({}); setCodeAnswer(""); setReview(null); }}
            className="text-[11px] font-mono text-[#4a4a65] hover:text-[#e8e8f0] transition-colors"
          >
            Retake →
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-[#07070f]" style={{ borderColor: `${scoreColor}30` }}>
          <div className="text-4xl font-bold font-mono" style={{ color: scoreColor }}>{score}</div>
          <div>
            <p className="text-[11px] font-mono text-[#4a4a65] mb-0.5">SCORE</p>
            <p className="text-[13px] text-[#c8c8d8]">
              {score >= 80 ? "Strong understanding demonstrated" : score >= 60 ? "Good progress, some gaps remain" : "Needs more practice — review resources"}
            </p>
          </div>
        </div>

        {/* MCQ summary */}
        {fb.mcqSummary && (
          <div className="rounded-lg border border-[#1e1e30] bg-[#07070f] p-4">
            <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">MCQ PERFORMANCE</p>
            <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{fb.mcqSummary}</p>

            {fb.mcqDetails?.length > 0 && (
              <div className="mt-3 space-y-2">
                {fb.mcqDetails.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px]">
                    <span className={`shrink-0 mt-0.5 ${d.wasCorrect ? "text-[#34d399]" : "text-[#f87171]"}`}>
                      {d.wasCorrect ? "✓" : "✗"}
                    </span>
                    <p className="text-[#6b6b8a] leading-relaxed">{d.insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Code feedback */}
        {fb.codeFeedback && (
          <div className="rounded-lg border border-[#1e1e30] bg-[#07070f] p-4">
            <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-2">CODE REVIEW</p>
            <p className="text-[13px] text-[#c8c8d8] leading-relaxed whitespace-pre-line">{fb.codeFeedback}</p>
          </div>
        )}

        {/* Overall insight */}
        {fb.overallInsight && (
          <div className="rounded-lg border border-[#7c6af7]/20 bg-[#7c6af7]/5 p-4">
            <p className="text-[10px] tracking-widest text-[#7c6af7]/60 font-mono mb-2">OVERALL INSIGHT</p>
            <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{fb.overallInsight}</p>
          </div>
        )}

        {/* Next step */}
        {fb.nextStep && (
          <div className="rounded-lg border border-[#34d399]/20 bg-[#34d399]/5 p-4">
            <p className="text-[10px] tracking-widest text-[#34d399]/60 font-mono mb-2">NEXT STEP</p>
            <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{fb.nextStep}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ── Weak spot card ─────────────────────────────────────────────────────────

function WeakSpotCard({ spot }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
      open ? "border-[#7c6af7]/30 bg-[#0d0d1a]" : "border-[#1e1e30] bg-[#0a0a14] hover:border-[#2a2a40]"
    }`}>

      {/* Header */}
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-start gap-4 group">
        <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-gradient-to-br from-[#7c6af7] to-[#60a5fa]" />

        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#e8e8f0] font-medium mb-2 leading-snug">{spot.topic}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-mono text-[#4a4a65]">
              {spot.sessionCount} session{spot.sessionCount !== 1 ? "s" : ""} flagged
            </span>
            <span className="text-[11px] text-[#2a2a40]">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#4a4a65]">pattern strength</span>
              <div className="w-16">
                <ConfidenceBar value={spot.confidence} />
              </div>
            </div>
            {spot.resolved && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#34d399]/10 text-[#34d399]">
                ✓ resolved
              </span>
            )}
          </div>
        </div>

        <span className="text-[#4a4a65] group-hover:text-[#7c6af7] transition-colors mt-0.5 shrink-0">
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-[#1e1e30] px-5 py-4">
          {/* Description */}
          <p className="text-[13px] text-[#6b6b8a] leading-relaxed mb-4">{spot.description}</p>

          {/* Resources */}
          <ResourcesSection weakSpotId={spot.id} initialResources={spot.resources} />

          {/* Divider */}
          <div className="h-px bg-[#1e1e30] my-4" />

          {/* Test */}
          <TestSection weakSpotId={spot.id} initialTest={spot.test} />
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function IRTPage() {
  const { data: session, status } = useSession();
  const [sessionCount, setSessionCount]   = useState(0);
  const [weakSpots, setWeakSpots]         = useState([]);
  const [analysing, setAnalysing]         = useState(false);
  const [loadingInit, setLoadingInit]     = useState(true);
  const [analysed, setAnalysed]           = useState(false);

  const MINIMUM = 5;

  // On load: fetch session count + existing weak spots
  useEffect(() => {
    if (status !== "authenticated") { setLoadingInit(false); return; }

    async function init() {
      try {
        // Get session count
        const hRes  = await fetch("/api/history");
        const hData = await hRes.json();
        setSessionCount(Array.isArray(hData) ? hData.length : 0);

        // Get existing weak spots
        const wRes  = await fetch("/api/irt/weakspots");
        const wData = await wRes.json();
        if (wData.weakSpots?.length > 0) {
          setWeakSpots(wData.weakSpots);
          setAnalysed(true);
        }
      } catch (e) { console.error(e); }
      finally { setLoadingInit(false); }
    }

    init();
  }, [status]);

  async function analysePatterns() {
    setAnalysing(true);
    try {
      const res  = await fetch("/api/irt/analyze", { method: "POST" });
      const data = await res.json();
      if (data.weakSpots) { setWeakSpots(data.weakSpots); setAnalysed(true); }
    } catch (e) { console.error(e); }
    finally { setAnalysing(false); }
  }

  // ── Not signed in
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-center space-y-4">
          <p className="text-3xl">🔒</p>
          <p className="text-[#e8e8f0] font-medium">Sign in to access Insights</p>
          <p className="text-sm text-[#4a4a65]">IRT is available on the free plan</p>
          <button onClick={() => signIn()} className="mt-2 px-5 py-2 bg-[#7c6af7] hover:bg-[#6a59e0] text-white text-sm rounded-lg transition-colors">
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Topbar */}
      <div className="border-b border-[#1e1e30] px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-[#4a4a65] hover:text-[#e8e8f0] transition-colors text-sm font-mono flex items-center gap-1.5">
          ← Back
        </Link>
        <div className="h-4 w-px bg-[#1e1e30]" />
        <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono">INSIGHTS · RESOURCES · TESTS</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#e8e8f0] tracking-tight mb-1">
            Your Learning Insights
          </h1>
          <p className="text-sm text-[#4a4a65]">
            AI identifies your weak spots from debug history, then helps you master them.
          </p>
        </div>

        {/* Loading */}
        {loadingInit && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-[#0d0d1a] border border-[#1e1e30] animate-pulse" />
            ))}
          </div>
        )}

        {!loadingInit && (
          <>
            {/* Session count bar */}
            <div className="mb-6 p-4 rounded-xl border border-[#1e1e30] bg-[#0a0a14]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-mono text-[#4a4a65] tracking-widest">DEBUG SESSIONS</p>
                <p className="text-[11px] font-mono text-[#4a4a65]">{sessionCount} / {MINIMUM} minimum</p>
              </div>
              <div className="h-1 bg-[#1e1e30] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#7c6af7] to-[#60a5fa]"
                  style={{ width: `${Math.min((sessionCount / MINIMUM) * 100, 100)}%` }}
                />
              </div>
              {sessionCount < MINIMUM && (
                <p className="text-[12px] text-[#4a4a65] mt-2">
                  Debug {MINIMUM - sessionCount} more time{MINIMUM - sessionCount !== 1 ? "s" : ""} to unlock pattern analysis.
                </p>
              )}
            </div>

            {/* Analyse button */}
            {sessionCount >= MINIMUM && (
              <button
                onClick={analysePatterns}
                disabled={analysing}
                className="w-full mb-6 py-3 rounded-xl bg-gradient-to-r from-[#7c6af7] to-[#60a5fa] text-white text-sm font-medium hover:shadow-[0_0_28px_rgba(124,106,247,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {analysing
                  ? "🧠 Analysing your patterns…"
                  : analysed
                  ? "🔄 Re-analyse Patterns"
                  : "🧠 Analyse My Patterns"}
              </button>
            )}

            {/* Weak spots list */}
            {analysed && weakSpots.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] tracking-widest text-[#4a4a65] font-mono mb-4">
                  WEAK SPOTS — {weakSpots.length} identified
                </p>
                {weakSpots.map((spot) => (
                  <WeakSpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            )}

            {/* Analysed but no weak spots */}
            {analysed && weakSpots.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <p className="text-4xl">🎯</p>
                <p className="text-[#e8e8f0] font-medium">No clear patterns yet</p>
                <p className="text-sm text-[#4a4a65]">Keep debugging — patterns emerge with more varied sessions</p>
              </div>
            )}

            {/* Not yet analysed + enough sessions */}
            {!analysed && sessionCount >= MINIMUM && (
              <div className="text-center py-16 space-y-3">
                <p className="text-4xl">🧠</p>
                <p className="text-[#e8e8f0] font-medium">Ready to analyse</p>
                <p className="text-sm text-[#4a4a65]">Click the button above to identify your weak spots</p>
              </div>
            )}

            {/* Not enough sessions */}
            {!analysed && sessionCount < MINIMUM && (
              <div className="text-center py-16 space-y-3">
                <p className="text-4xl">🔍</p>
                <p className="text-[#e8e8f0] font-medium">Not enough data yet</p>
                <p className="text-sm text-[#4a4a65]">
                  Debug at least {MINIMUM} times so AI has enough history to find your patterns
                </p>
                <Link href="/" className="inline-block mt-2 px-5 py-2 border border-[#7c6af7]/40 text-[#7c6af7] text-sm rounded-lg hover:bg-[#7c6af7]/10 transition-colors">
                  Start debugging
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}