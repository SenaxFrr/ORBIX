import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/orbit/empty-state";
import { Button } from "@/components/ui/button";
import { findExercise } from "@/lib/orbit/exercises";
import {
  formatDuration,
  formatRest,
  formatSet,
  roundKg,
} from "@/lib/orbit/format";
import { lastSetForExercise } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/seance")({ component: SeancePage });

function SeancePage() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
  const navigate = useNavigate();

  if (!active) {
    return (
      <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
        <EmptyState
          title="Aucune séance"
          body="Choisis un programme pour commencer."
          cta="Programmes"
          onCta={() => void navigate({ to: "/app/programme" })}
        />
      </main>
    );
  }

  return <Logger workoutId={active.id} name={active.programName} />;
}

function Logger({ workoutId, name }: { workoutId: string; name: string }) {
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const planned = store.workoutExercises
    .filter((w) => w.workoutId === workoutId)
    .sort((a, b) => a.order - b.order);
  const [currentId, setCurrentId] = useState(planned[0]?.exerciseId ?? "");
  const [weight, setWeight] = useState(0);
  const [wText, setWText] = useState("0");
  const [reps, setReps] = useState(8);
  const [leave, setLeave] = useState(false);
  const [busy, setBusy] = useState(false);

  const rest = store.restByUser[user.id];
  const ex = findExercise(currentId, pool);
  const plan = planned.find((p) => p.exerciseId === currentId);
  const sets = store.sets
    .filter((s) => s.workoutId === workoutId && s.exerciseId === currentId)
    .sort((a, b) => a.setNumber - b.setNumber || a.completedAt.localeCompare(b.completedAt));
  const lastKnown = lastSetForExercise(store.sets, store.workouts, user.id, currentId, store.declaredPerfs);
  const loggedHere = store.sets.filter((s) => s.workoutId === workoutId).length;

  useEffect(() => {
    if (!currentId && planned[0]) setCurrentId(planned[0].exerciseId);
  }, [currentId, planned]);

  useEffect(() => {
    const last = sets[sets.length - 1] ?? lastKnown;
    if (last) {
      const w = roundKg(last.weight);
      setWeight(w);
      setWText(String(w).replace(".", ","));
      setReps(last.reps);
    } else if (plan?.targetKg) {
      const w = roundKg(plan.targetKg);
      setWeight(w);
      setWText(String(w).replace(".", ","));
      setReps(plan.plannedReps);
    } else {
      setWeight(0);
      setWText("0");
      setReps(plan?.plannedReps ?? 8);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  function validate() {
    if (busy || !currentId || reps <= 0) return;
    setBusy(true);
    store.addSet({ workoutId, exerciseId: currentId, weight, reps });
    window.setTimeout(() => setBusy(false), 280);
  }

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-8 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg text-muted"
          onClick={() => setLeave(true)}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{name}</p>
          <h1 className="truncate font-display text-xl font-semibold">{ex?.name ?? "Mouvement"}</h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={loggedHere === 0}
          onClick={() => {
            store.finishWorkout(workoutId);
            void navigate({ to: "/app/suivi" });
          }}
        >
          Terminer
        </Button>
      </header>

      <p className="mt-1 px-1 text-xs text-muted">
        Dernière charge : {lastKnown ? formatSet(lastKnown.weight, lastKnown.reps) : "—"}
        {plan ? ` · cible ${plan.plannedSets} × ${plan.plannedReps}` : ""}
      </p>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {planned.map((p) => {
          const e = findExercise(p.exerciseId, pool);
          const n = store.sets.filter((s) => s.workoutId === workoutId && s.exerciseId === p.exerciseId).length;
          return (
            <button
              key={p.exerciseId}
              onClick={() => setCurrentId(p.exerciseId)}
              className={cn(
                "h-10 shrink-0 rounded-full px-3 text-sm shadow-[var(--shadow-border)]",
                p.exerciseId === currentId ? "bg-accent text-accent-fg" : "bg-surface text-fg",
              )}
            >
              {e?.name ?? p.exerciseId}
              {n ? ` · ${n}` : ""}
            </button>
          );
        })}
      </div>

      <ul className="mt-3 space-y-1">
        {sets.map((s) => (
          <li key={s.id} className="flex h-10 items-center justify-between rounded-lg bg-surface-2 px-3 text-sm">
            <span className="text-muted num">S{s.setNumber}</span>
            <span className="font-medium num">{formatSet(s.weight, s.reps)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="glass rounded-2xl px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Charge</p>
          <div className="mt-1 flex items-baseline gap-1">
            <input
              className="w-full min-w-0 bg-transparent font-display text-5xl font-semibold leading-none num outline-none"
              inputMode="decimal"
              value={wText}
              onChange={(e) => {
                const t = e.target.value.replace(".", ",");
                if (!/^\d*,?\d*$/.test(t)) return;
                setWText(t);
                const n = Number(t.replace(",", "."));
                if (!Number.isNaN(n) && n <= 999) setWeight(n);
              }}
              onBlur={() => {
                const n = roundKg(Math.max(0, weight));
                setWeight(n);
                setWText(String(n).replace(".", ","));
              }}
              aria-label="Charge en kg"
            />
            <span className="text-lg text-muted">kg</span>
          </div>
        </label>
        <label className="glass rounded-2xl px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Reps</p>
          <div className="mt-1 flex items-baseline gap-1">
            <input
              className="w-full min-w-0 bg-transparent font-display text-5xl font-semibold leading-none num outline-none"
              inputMode="numeric"
              value={reps}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (!Number.isNaN(n) && n >= 0 && n <= 99) setReps(Math.round(n));
              }}
              aria-label="Répétitions"
            />
            <span className="text-lg text-muted">reps</span>
          </div>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            const n = roundKg(Math.max(0, weight - 2.5));
            setWeight(n);
            setWText(String(n).replace(".", ","));
          }}
        >
          −2,5 kg
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const n = roundKg(weight + 2.5);
            setWeight(n);
            setWText(String(n).replace(".", ","));
          }}
        >
          +2,5 kg
        </Button>
        <Button variant="secondary" onClick={() => setReps((n) => Math.max(1, n - 1))}>
          −1 rep
        </Button>
        <Button variant="secondary" onClick={() => setReps((n) => Math.min(50, n + 1))}>
          +1 rep
        </Button>
      </div>
      <Button
        variant="secondary"
        className="mt-2 w-full"
        disabled={!lastKnown}
        onClick={() => {
          if (!lastKnown) return;
          setWeight(roundKg(lastKnown.weight));
          setWText(String(roundKg(lastKnown.weight)).replace(".", ","));
          setReps(lastKnown.reps);
        }}
      >
        Reprendre la dernière charge connue
      </Button>

      <Button size="lg" className="mt-4 w-full" disabled={busy || !currentId} onClick={validate}>
        Valider la série
      </Button>

      {rest ? <RestBar /> : null}

      {leave ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/70 px-4 pb-8">
          <div className="glass-strong w-full max-w-md rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Quitter la séance ?</h2>
            <p className="mt-1 text-sm text-muted">Pause : tu reprends plus tard. Abandon : la séance est perdue.</p>
            <div className="mt-4 grid gap-2">
              <Button
                onClick={() => {
                  void navigate({ to: "/app/programme" });
                }}
              >
                Mettre en pause
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  store.abandonWorkout(workoutId);
                  void navigate({ to: "/app/programme" });
                }}
              >
                Abandonner
              </Button>
              <Button variant="ghost" onClick={() => setLeave(false)}>
                Rester
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function RestBar() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const rest = store.restByUser[user.id];
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!rest) return;
    const t = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(t);
  }, [rest?.endsAt]);
  const remaining = rest ? Math.max(0, Math.ceil((rest.endsAt - now) / 1000)) : 0;
  useEffect(() => {
    if (!rest) return;
    if (remaining <= 0) store.skipRest();
  }, [remaining, rest, store]);
  if (!rest) return null;
  return (
    <div className="mt-4 glass-strong flex items-center justify-between rounded-2xl px-4 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Repos</p>
        <p className="font-display text-2xl font-semibold num">{formatDuration(remaining)}</p>
        <p className="text-xs text-muted">{formatRest(remaining)}</p>
      </div>
      <Button variant="secondary" onClick={() => store.skipRest()}>
        Passer
      </Button>
    </div>
  );
}
