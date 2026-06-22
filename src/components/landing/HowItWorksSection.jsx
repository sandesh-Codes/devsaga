export default function HowItWorksSection() {
    return (
        <>
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
        </>
    )
}