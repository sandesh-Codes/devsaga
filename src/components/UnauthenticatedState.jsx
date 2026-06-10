import { signIn } from "next-auth/react";

export default function UnauthenticatedState({title, description}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--ds-bg)" }}
    >
      <div className="text-center space-y-4">
        <p className="text-3xl">🔒</p>
        <p className="font-medium" style={{ color: "var(--ds-text)" }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: "var(--ds-subtle)" }}>
          {description}
        </p>
        <button
          onClick={() => signIn()}
          className="mt-2 px-5 py-2 text-sm rounded-lg font-semibold transition-colors"
          style={{ background: "var(--ds-amber)", color: "#0c0b09" }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}