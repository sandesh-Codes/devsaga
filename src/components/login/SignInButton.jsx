export default function SignInButton({ provider, label, icon, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      style={{
        background: "var(--ds-surface)",
        border:     "1px solid var(--ds-border)",
        color:      "var(--ds-muted)",
      }}
      onMouseOver={e => {
        if (!loading) {
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
          e.currentTarget.style.color = "var(--ds-text)";
        }
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = "var(--ds-border)";
        e.currentTarget.style.color = "var(--ds-muted)";
      }}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {loading ? (
          <span
            className="w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "var(--ds-amber)" }}
          />
        ) : icon}
      </span>
      <span className="flex-1 text-left font-code text-[13px]">
        {loading ? "Connecting…" : label}
      </span>
      <span
        className="text-[12px] transition-colors"
        style={{ color: "var(--ds-faint)" }}
      >
        →
      </span>
    </button>
  );
}