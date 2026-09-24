import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "accent" | "warn";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium tracking-wide",
        tone === "muted" && "bg-surface-2 text-muted",
        tone === "accent" && "bg-accent text-accent-fg",
        tone === "warn" && "bg-warn/20 text-warn",
        className,
      )}
    >
      {children}
    </span>
  );
}
