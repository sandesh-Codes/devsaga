export default function CallToActionSection({session}) {
    return (
        <>
                <section className="px-6 md:px-12 py-24 text-center max-w-3xl mx-auto">
                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: "#f0ece0" }}>
                    Start learning from<br />
                    <span style={{ color: "#c9a84c", fontStyle: "italic" }}>every mistake.</span>
                  </h2>
                  <p className="text-sm mb-10 leading-relaxed" style={{ color: "rgba(240,236,224,0.4)" }}>
                    Free forever. No credit card needed. Debug your first error in 30 seconds.
                  </p>
                  {session ? (
                    <a
                      href="/debug"
                      className="btn-primary inline-block px-8 py-3 rounded-xl text-sm"
                    >
                      Go to your dashboard
                    </a>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={() => signIn("google")} className="btn-primary px-8 py-3 rounded-xl text-sm">
                        Sign in with Google
                      </button>
                      <button onClick={() => signIn("github")} className="btn-secondary px-8 py-3 rounded-xl text-sm">
                        Sign in with GitHub
                      </button>
                    </div>
                  )}
                </section>
        </>
    )
}