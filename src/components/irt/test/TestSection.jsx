"use client";

import { useState } from "react";
import MCQStep    from "@/components/irt/test/MCQStep";
import CodeStep   from "@/components/irt/test/CodeStep";
import ReviewStep from "@/components/irt/test/ReviewStep";

const STEPS = { IDLE: "idle", MCQ: "mcq", CODE: "code", REVIEW: "review" };

export default function TestSection({ weakSpotId, initialTest }) {
  const [test,        setTest]        = useState(initialTest || null);
  const [step,        setStep]        = useState(STEPS.IDLE);
  const [mcqAnswers,  setMcqAnswers]  = useState({});
  const [codeAnswer,  setCodeAnswer]  = useState("");
  const [review,      setReview]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  // ── Generate new test ────────────────────────────────────────────────────

  async function generateTest() {
    setLoading(true);
    try {
      const res  = await fetch("/api/irt/test/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ weakSpotId }),
      });
      const data = await res.json();
      if (data.test) { setTest(data.test); setStep(STEPS.MCQ); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  // ── Submit test ──────────────────────────────────────────────────────────

  async function submitTest() {
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
      if (data.review) { setReview(data.review); setStep(STEPS.REVIEW); }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  }

  // ── Reset for retake ─────────────────────────────────────────────────────

  function resetTest() {
    setStep(STEPS.IDLE);
    setMcqAnswers({});
    setCodeAnswer("");
    setReview(null);
  }

  // ── Idle — show start/take button ────────────────────────────────────────

  if (step === STEPS.IDLE) {
    return (
      <button
        onClick={test ? () => setStep(STEPS.MCQ) : generateTest}
        disabled={loading}
        className="w-full mt-3 py-2.5 rounded-lg text-[12px] font-code tracking-wide transition-all disabled:opacity-50"
        style={{ border: "1px dashed var(--ds-border)", color: "var(--ds-subtle)" }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)";
          e.currentTarget.style.color = "var(--ds-purple)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = "var(--ds-border)";
          e.currentTarget.style.color = "var(--ds-subtle)";
        }}
      >
        {loading
          ? "Generating test…"
          : test
            ? "🧪 Start Test"   // test exists in DB — neutral label works for first time and returning
            : "🧪 Take Test"    // no test yet — will generate on click
        }
      </button>
    );
  }

  // ── MCQ step ─────────────────────────────────────────────────────────────

  if (step === STEPS.MCQ) {
    return (
      <MCQStep
        mcq={test.mcq}
        answers={mcqAnswers}
        onAnswer={(qi, letter) => setMcqAnswers(prev => ({ ...prev, [qi]: letter }))}
        onContinue={() => setStep(STEPS.CODE)}
      />
    );
  }

  // ── Code step ────────────────────────────────────────────────────────────

  if (step === STEPS.CODE) {
    return (
      <CodeStep
        codeProblem={test.codeProblem}
        codeAnswer={codeAnswer}
        onChangeAnswer={setCodeAnswer}
        onBack={() => setStep(STEPS.MCQ)}
        onSubmit={submitTest}
        submitting={submitting}
      />
    );
  }

  // ── Review step ──────────────────────────────────────────────────────────

  if (step === STEPS.REVIEW) {
    return (
      <ReviewStep
        review={review}
        onRetake={resetTest}
      />
    );
  }

  return null;
}