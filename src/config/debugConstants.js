// ── Output sections config ─────────────────────────────────────────────────

export const OUTPUT_SECTIONS = [
  {
    key:   "rootCause",
    label: "ROOT CAUSE",
    dot:   "var(--ds-red)",
    type:  "text",
  },
  {
    key:   "explanation",
    label: "EXPLANATION",
    dot:   "var(--ds-green)",
    type:  "text",
  },
  {
    key:   "steps",
    label: "STEP-BY-STEP FIX",
    dot:   "var(--ds-amber)",
    type:  "steps",
  },
  {
    key:   "fixedCode",
    label: "FIXED CODE",
    dot:   "var(--ds-purple)",
    type:  "code",
  },
  {
    key:   "mistakes",
    label: "COMMON MISTAKES",
    dot:   "var(--ds-orange)",
    type:  "mistakes",
  },
];