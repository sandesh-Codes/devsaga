export default function IrtFeature() {
    return (
        <>
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
        </>
    )
}