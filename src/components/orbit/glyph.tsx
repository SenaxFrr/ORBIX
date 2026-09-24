export function OrbitGlyph({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden style={{ pointerEvents: "none" }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="32" cy="32" r="16" />
        <ellipse cx="32" cy="32" rx="24" ry="9" />
        <circle cx="52" cy="32" r="3" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
