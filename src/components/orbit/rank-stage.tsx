import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RankBadge } from "@/components/orbit/rank-badge";
import { formatFr } from "@/lib/orbit/format";
import { useOrbitStore } from "@/lib/orbit/store";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RankStage() {
  const event = useOrbitStore((s) => s.rankQueue[0] ?? null);
  const shift = useOrbitStore((s) => s.shiftRankEvent);
  const [skipReady, setSkipReady] = useState(false);
  const quiet = event ? reducedMotion() : false;

  useEffect(() => {
    if (!event) return;
    if (quiet) {
      toast.message(
        event.kind === "exo"
          ? `${event.name} · ${event.from} → ${event.to}`
          : `${event.to} · score ${formatFr(event.score, 1)}`,
      );
      shift();
      return;
    }
    setSkipReady(false);
    if (event.kind === "exo") {
      const t = window.setTimeout(shift, 900);
      return () => window.clearTimeout(t);
    }
    const ready = window.setTimeout(() => setSkipReady(true), 400);
    const done = window.setTimeout(shift, 2200);
    return () => {
      window.clearTimeout(ready);
      window.clearTimeout(done);
    };
  }, [event, shift, quiet]);

  if (!event || quiet) return null;

  if (event.kind === "exo") {
    return (
      <div
        className="rank-toast pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+12px)] z-50 mx-auto w-[min(100%-2rem,20rem)] px-3 py-2"
        style={{ ["--rank" as string]: event.color }}
        role="status"
      >
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{event.name}</p>
        <p className="mt-0.5 truncate text-sm">
          {event.from} <span className="text-muted">→</span>{" "}
          <span style={{ color: event.color }}>{event.to}</span>
        </p>
      </div>
    );
  }

  return (
    <div
      className="rank-global fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: `radial-gradient(520px 320px at 50% 42%, color-mix(in oklab, ${event.color} 34%, transparent), #07080c 72%)`,
        ["--rank" as string]: event.color,
      }}
      role="dialog"
      aria-label={`Rang ${event.to}`}
    >
      <p className="rank-global-from text-sm" style={{ color: event.color }}>
        {event.from}
      </p>
      <div className="rank-global-to mt-6">
        <RankBadge rank={event.rank} division={event.division} label={event.to} size="lg" />
      </div>
      <p className="mt-5 font-display text-2xl font-semibold" style={{ color: event.color }}>
        {event.to}
      </p>
      <p className="mt-2 text-sm text-muted num">score {formatFr(event.score, 1)}</p>
      <button
        type="button"
        className="mt-8 h-11 min-w-28 border px-4 text-sm disabled:opacity-30"
        style={{ borderColor: event.color, color: event.color }}
        disabled={!skipReady}
        onClick={shift}
      >
        OK
      </button>
    </div>
  );
}