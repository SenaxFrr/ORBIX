import { useEffect, useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { formatFr } from "@/lib/orbit/format";
import { useOrbitStore } from "@/lib/orbit/store";

export function RankStage() {
  const event = useOrbitStore((s) => s.rankQueue[0] ?? null);
  const shift = useOrbitStore((s) => s.shiftRankEvent);
  const [skipReady, setSkipReady] = useState(false);

  useEffect(() => {
    if (!event) return;
    setSkipReady(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (event.kind === "exo") {
      const t = window.setTimeout(shift, reduce ? 200 : 800);
      return () => window.clearTimeout(t);
    }
    const ready = window.setTimeout(() => setSkipReady(true), reduce ? 0 : 400);
    const done = window.setTimeout(shift, reduce ? 400 : 2800);
    return () => {
      window.clearTimeout(ready);
      window.clearTimeout(done);
    };
  }, [event, shift]);

  if (!event) return null;

  if (event.kind === "exo") {
    return (
      <button
        className="rank-toast pointer-events-auto fixed inset-x-0 top-[calc(env(safe-area-inset-top)+12px)] z-50 mx-auto w-[min(100%-2rem,28rem)] rounded-xl px-4 py-3 text-left shadow-[var(--shadow-glow)]"
        onClick={shift}
        aria-label="Fermer"
      >
        <p className="truncate text-sm font-medium">{event.name}</p>
        <p className="mt-0.5 text-xs text-muted">
          {event.from} → <span className="text-accent">{event.to}</span>
        </p>
      </button>
    );
  }

  return (
    <button
      className="rank-global fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: `radial-gradient(600px 380px at 50% 40%, color-mix(in oklab, ${event.color} 28%, transparent), var(--color-bg) 70%)`,
      }}
      onClick={() => {
        if (skipReady) shift();
      }}
      aria-label="Fermer"
    >
      <p className="rank-global-from text-sm text-muted">{event.from}</p>
      <div className="rank-global-to mt-6">
        <RankBadge rank={event.rank} division={event.division} label={event.to} size="lg" />
      </div>
      <p className="mt-5 font-display text-xl font-semibold">Rang global · {event.to}</p>
      <p className="mt-2 text-sm text-muted num">score {formatFr(event.score, 1)}</p>
      <p className="mt-6 text-sm text-accent">Nouveau palier.</p>
    </button>
  );
}
