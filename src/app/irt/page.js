"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Topbar          from "@/components/layout/Topbar";
import WeakSpotCard    from "@/components/irt/WeakSpotCard";
import SessionProgress from "@/components/irt/SessionProgress";
import EmptyAnalysis from "@/components/irt/EmptyAnalysis";
import { MINIMUM_SESSIONS } from "@/config/irtConstants";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import UnauthenticatedState from "@/components/UnauthenticatedState";


// ── Main page ──────────────────────────────────────────────────────────────

export default function IRTPage() {
  const { data: session, status } = useSession();

  const [sessionCount, setSessionCount] = useState(0);
  const [weakSpots,    setWeakSpots]    = useState([]);
  const [analysing,    setAnalysing]    = useState(false);
  const [loadingInit,  setLoadingInit]  = useState(true);
  const [analysed,     setAnalysed]     = useState(false);

  // ── Load initial data ────────────────────────────────────────────────────

  useEffect(() => {
    if (status !== "authenticated") { setLoadingInit(false); return; }

    async function init() {
      try {
        const [hRes, wRes] = await Promise.all([
          fetch("/api/history"),
          fetch("/api/irt/weakspots"),
        ]);

        const hData = await hRes.json();
        const wData = await wRes.json();

        setSessionCount(Array.isArray(hData) ? hData.length : 0);

        if (wData.weakSpots?.length > 0) {
          setWeakSpots(wData.weakSpots);
          setAnalysed(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInit(false);
      }
    }

    init();
  }, [status]);

  // ── Analyse patterns ─────────────────────────────────────────────────────

  async function analysePatterns() {
    setAnalysing(true);
    try {
      const res  = await fetch("/api/irt/analyze", { method: "POST" });
      const data = await res.json();
      if (data.weakSpots) {
        setWeakSpots(data.weakSpots);
        setAnalysed(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalysing(false);
    }
  }

  if (status === "unauthenticated") return <UnauthenticatedState title="Sign in to access Insights" description="IRT is available on the free plan" />;

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-bg)" }}>

      <Topbar session={session} activePage="irt" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="font-display text-2xl font-bold mb-1 tracking-tight"
            style={{ color: "var(--ds-text)" }}
          >
            Your Learning Insights
          </h1>
          <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
            AI identifies your weak spots from debug history, then helps you master them.
          </p>
        </div>

        {/* Loading */}
        {loadingInit && <LoadingSkeleton />}

        {!loadingInit && (
          <>
            {/* Session progress */}
            <SessionProgress count={sessionCount} />

            {/* Analyse button */}
            {sessionCount >= MINIMUM_SESSIONS && (
              <button
                onClick={analysePatterns}
                disabled={analysing}
                className="w-full mb-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
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
                <p
                  className="text-[10px] tracking-widest font-code mb-4"
                  style={{ color: "var(--ds-faint)" }}
                >
                  WEAK SPOTS — {weakSpots.length} identified
                </p>
                {weakSpots.map(spot => (
                  <WeakSpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            )}

            {/* Analysed but no weak spots */}
            {analysed && weakSpots.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <p className="text-4xl">🎯</p>
                <p className="font-medium" style={{ color: "var(--ds-text)" }}>No clear patterns yet</p>
                <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
                  Keep debugging — patterns emerge with more varied sessions
                </p>
              </div>
            )}

            {/* Not yet analysed */}
            {!analysed && <EmptyAnalysis sessionCount={sessionCount} />}
          </>
        )}
      </div>
    </div>
  );
}