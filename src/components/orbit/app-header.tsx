import { useNavigate } from "@tanstack/react-router";
import { RankBadge } from "@/components/orbit/rank-badge";
import { formatFr } from "@/lib/orbit/format";
import { computeGlobalOrbit, nextRankInfo } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const user = useSessionUser();
  const store = useOrbitStore();
  const pool = usePool();
  const navigate = useNavigate();
  if (!user) return null;
  const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
  const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
  return (
    <header className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-2">
      <p className="font-display text-lg font-semibold tracking-[0.2em]">ORBIT</p>
      <button
        className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold shadow-[var(--shadow-border)]"
        onClick={() => void navigate({ to: "/app/profil" })}
        aria-label="Profil"
      >
        <span
          className={cn("flex size-9 items-center justify-center rounded-full")}
          style={{
            background: `color-mix(in oklab, ${orbit.classified ? "var(--color-accent)" : "var(--color-surface-2)"} 35%, transparent)`,
          }}
        >
          {initials}
        </span>
      </button>
    </header>
  );
}

export function RankStrip() {
  const user = useSessionUser();
  const store = useOrbitStore();
  const pool = usePool();
  const navigate = useNavigate();
  if (!user) return null;
  const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
  const progress = nextRankInfo(orbit.score, orbit.classified);
  const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
  return (
    <div
      className="sticky top-0 z-20 shrink-0 overflow-hidden border-b border-border bg-bg/90 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => void navigate({ to: "/app/perfs" })}
          aria-label="Classements"
        >
          <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>
          <span className="shrink-0 text-sm text-muted num">
            {orbit.classified ? formatFr(orbit.score, 1) : "—"}
          </span>
        </button>
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold"
          onClick={() => void navigate({ to: "/app/profil" })}
          aria-label="Profil"
        >
          {initials}
        </button>
      </div>
    </div>
  );
}

export function ResumeBanner() {
  const store = useOrbitStore();
  const user = useSessionUser();
  const navigate = useNavigate();
  if (!user) return null;
  const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
  if (!active) return null;
  return (
    <button
      className="mb-3 flex w-full items-center justify-between rounded-xl bg-accent px-4 py-3 text-left text-sm font-medium text-accent-fg"
      onClick={() => void navigate({ to: "/app/seance" })}
    >
      <span>Séance en cours — {active.programName}</span>
      <span>Reprendre</span>
    </button>
  );
}
