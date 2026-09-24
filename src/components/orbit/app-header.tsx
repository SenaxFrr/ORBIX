import { useNavigate } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { formatFr } from "@/lib/orbit/format";
import { computeGlobalOrbit, nextRankInfo } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

function DmButton() {
  const me = useSessionUser();
  const dms = useOrbitStore((s) => s.dms);
  const navigate = useNavigate();
  if (!me) return null;
  const n = (dms ?? []).filter((m) => m.toId === me.id && !(m.readAt > 0)).length;
  return (
    <button
      className="relative flex size-11 items-center justify-center rounded-full"
      onClick={() => void navigate({ to: "/app/messages", search: {} })}
      aria-label={n > 0 ? `Messages, ${n} non lus` : "Messages"}
    >
      <MessageSquare className="size-5 text-accent" />
      {n > 0 ? (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
          {n > 9 ? "9+" : n}
        </span>
      ) : null}
    </button>
  );
}

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
      <div className="flex items-center">
        <DmButton />
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
      </div>
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
      className="sticky top-0 z-20 shrink-0 border-b border-border bg-bg/95 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-start gap-2 px-4 py-2">
        <button
          className="min-w-0 flex-1 text-left"
          onClick={() => void navigate({ to: "/app/perfs" })}
          aria-label={orbit.classified ? "Voir le classement" : "Débloquer mon rang"}
        >
          {orbit.classified ? (
            <>
              <div className="flex items-center gap-3">
                <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="xl" />
                <span className="font-display text-3xl font-semibold num">{formatFr(orbit.score, 1)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{progress.label}</p>
            </>
          ) : (
            <p className="font-display text-lg font-semibold leading-tight">
              3 exos types pour débloquer ton rang
            </p>
          )}
        </button>
        <DmButton />
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
