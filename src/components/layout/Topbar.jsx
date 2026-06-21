"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import MobileMenu from "@/components/layout/MobileMenu";
import Logo from "@/components/layout/Logo";

// ── Desktop nav link ───────────────────────────────────────────────────────

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-code transition-all"
      style={{
        color:      active ? "var(--ds-amber)" : "var(--ds-subtle)",
        background: active ? "rgba(201,168,76,0.08)" : "transparent",
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.color = "var(--ds-text)"; }}
      onMouseOut={e => {  if (!active) e.currentTarget.style.color = "var(--ds-subtle)"; }}
    >
      {label}
    </Link>
  );
}

// ── User avatar dropdown ───────────────────────────────────────────────────

function UserMenu({ session }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg transition-colors"
        style={{ border: "1px solid var(--ds-border)" }}
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
          >
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <span
          className="text-sm max-w-30 truncate"
          style={{ color: "var(--ds-muted)" }}
        >
          {session.user.name}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{ color: "var(--ds-subtle)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 w-44 rounded-xl z-20 py-1 overflow-hidden"
            style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)" }}
          >
            <DropdownLink href="/history" label="History"     onClick={() => setOpen(false)} />
            <DropdownLink href="/irt"     label="My Patterns" onClick={() => setOpen(false)} />
            <div className="my-1 mx-3" style={{ height: "1px", background: "var(--ds-border)" }} />
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm font-code transition-colors"
              style={{ color: "var(--ds-red)" }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DropdownLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-code transition-colors"
      style={{ color: "var(--ds-muted)" }}
      onMouseOver={e => e.currentTarget.style.color = "var(--ds-text)"}
      onMouseOut={e => e.currentTarget.style.color = "var(--ds-muted)"}
    >
      {label}
    </Link>
  );
}

// ── Topbar ─────────────────────────────────────────────────────────────────

export default function Topbar({ session, activePage = "debug" }) {
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 h-14"
      style={{
        background:    "rgba(12,11,9,0.95)",
        borderBottom:  "1px solid var(--ds-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <button onClick={() => router.push("/debug")}>
        <Logo size={28} />
      </button>

      {/* Desktop nav — hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1">
        <NavLink href="/debug"   label="Debug"       active={activePage === "debug"} />
        <NavLink href="/history" label="History"     active={activePage === "history"} />
        <NavLink href="/irt"     label="My Patterns" active={activePage === "irt"} />
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {session ? (
          <UserMenu session={session} />
        ) : (
          <button
            onClick={() => signIn()}
            className="hidden md:block text-sm px-4 py-2 rounded-lg font-semibold transition-all"
            style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
          >
            Sign in
          </button>
        )}

        {/* Mobile hamburger */}
        <MobileMenu session={session} />
      </div>
    </header>
  );
}