import Logo from "../layout/Logo"

export default function LandingFooter() {
    return (
        <>
        <footer className="border-t px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(240,236,224,0.06)" }}>
          <Logo size={18} muted />
          <p className="font-mono-jet text-[11px]" style={{ color: "rgba(240,236,224,0.2)" }}>
            built by sandesh · {new Date().getFullYear()}
          </p>
          <a
            href="https://github.com/sandesh-Codes/devsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-jet text-[11px] transition-colors hover:text-[rgba(240,236,224,0.5)]"
          >
            github ↗
          </a>
        </footer>
        </>
    )
}