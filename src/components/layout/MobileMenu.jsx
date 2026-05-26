"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

export default function MobileMenu({ session }) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">

      {/* Hamburger toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        style={{ color: "var(--ds-subtle)" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 bg-black/60"
            onClick={close}
          />

          {/* Menu panel */}
          <nav
            className="fixed top-14 left-0 right-0 z-20 py-2"
            style={{
              background:   "var(--ds-surface)",
              borderBottom: "1px solid var(--ds-border)",
            }}
          >
            <MenuItem href="/"        label="Debug"       onClick={close} />
            <MenuItem href="/history" label="History"     onClick={close} />
            <MenuItem href="/irt"     label="My Patterns" onClick={close} />

            <div
              className="my-1 mx-4"
              style={{ height: "1px", background: "var(--ds-border)" }}
            />

            {session ? (
              <button
                onClick={() => { signOut(); close(); }}
                className="w-full text-left px-6 py-3 text-sm font-code transition-colors"
                style={{ color: "var(--ds-red)" }}
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => { signIn(); close(); }}
                className="w-full text-left px-6 py-3 text-sm font-code transition-colors"
                style={{ color: "var(--ds-amber)" }}
              >
                Sign in
              </button>
            )}
          </nav>
        </>
      )}
    </div>
  );
}

function MenuItem({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-6 py-3 text-sm font-code transition-colors"
      style={{ color: "var(--ds-muted)" }}
      onMouseOver={e => e.currentTarget.style.color = "var(--ds-text)"}
      onMouseOut={e => e.currentTarget.style.color = "var(--ds-muted)"}
    >
      {label}
    </Link>
  );
}