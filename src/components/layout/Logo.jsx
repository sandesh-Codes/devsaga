export default function Logo({ withText = true, size = 32, muted = false }) {
  const goldColor = muted ? "rgba(201,168,76,0.35)" : "#c9a84c";
  const textColor = muted ? "rgba(240,236,224,0.3)" : "var(--ds-text)";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        aria-hidden="true"
      >
        <g
          stroke={goldColor}
          strokeWidth={20}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 92 65 L 55 120 L 92 175" />
          <path d="M 148 65 L 185 120 L 148 175" />
        </g>
        <circle cx="120" cy="120" r="13" fill={goldColor} />
      </svg>

      {withText && (
        <span
          className="font-display font-bold"
          style={{ color: textColor, fontSize: size * 0.62 }}
        >
          DevSaga
        </span>
      )}
    </span>
  );
}