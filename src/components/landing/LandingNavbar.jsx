import Topbar from "@/components/layout/Topbar"
import Logo from "@/components/layout/Logo";

export default function LandingNavbar({session}) {
    return (
        <>
        {session ? (
          <Topbar session={session} activePage="" />
        ) : (
          <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "rgba(240,236,224,0.06)" }}>
            <div className="flex items-center gap-2">
              <Logo size={26} />
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
        )}
        </>
    )
}