export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl animate-pulse"
          style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)" }}
        />
      ))}
    </div>
  );
}
