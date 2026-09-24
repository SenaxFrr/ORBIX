import { OrbitGlyph } from "./glyph";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  body,
  cta,
  onCta,
}: {
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-surface text-accent shadow-[var(--shadow-border)]">
        <OrbitGlyph size={36} />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 max-w-[28ch] text-sm text-muted">{body}</p>
      </div>
      {cta && onCta ? (
        <Button onClick={onCta} size="lg">
          {cta}
        </Button>
      ) : null}
    </div>
  );
}
