import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { findExercise, isClassifiedLift, refForSex } from "@/lib/orbit/exercises";
import { formatDateFull, formatDuration, formatFr, formatRm, formatSet, formatVolume } from "@/lib/orbit/format";
import { epley, liftRankFor, scoreExo } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";

export const Route = createFileRoute("/app/suivi/$workoutId")({ component: WorkoutDetail });

function WorkoutDetail() {
  const { workoutId } = Route.useParams();
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const w = store.workouts.find((x) => x.id === workoutId && x.userId === user.id);

  if (!w) {
    return (
      <main className="px-4 pb-28 pt-4">
        <p className="text-sm text-muted">Séance introuvable.</p>
        <Button className="mt-4" onClick={() => void navigate({ to: "/app/suivi" })}>
          Retour
        </Button>
      </main>
    );
  }

  const planned = store.workoutExercises
    .filter((e) => e.workoutId === w.id)
    .sort((a, b) => a.order - b.order);
  const sets = store.sets.filter((s) => s.workoutId === w.id);
  const order = planned.length
    ? planned.map((p) => p.exerciseId)
    : [...new Set(sets.map((s) => s.exerciseId))];
  const vol = sets.reduce((a, s) => a + s.weight * s.reps, 0);

  return (
    <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/suivi" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">Séance du {formatDateFull(w.date)}</h1>
      </header>
      <p className="mt-1 text-sm text-muted">
        {w.programName} · {formatDuration(w.duration)} · {formatVolume(vol)}
      </p>

      <ul className="mt-5 space-y-3">
        {order.map((exerciseId) => {
          const ex = findExercise(exerciseId, pool);
          const ss = sets
            .filter((s) => s.exerciseId === exerciseId)
            .sort((a, b) => a.setNumber - b.setNumber);
          if (!ss.length) return null;
          let best = ss[0];
          let bestE = epley(best.weight, best.reps);
          for (const s of ss) {
            const e = epley(s.weight, s.reps);
            if (e > bestE) {
              best = s;
              bestE = e;
            }
          }
          const classified = isClassifiedLift(exerciseId, pool);
          const lift = classified
            ? liftRankFor(user, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool)
            : null;
          const sessionScore =
            classified && ex
              ? scoreExo({ epley1RM: bestE, refKg: refForSex(ex, user.sex), age: user.age })
              : 0;
          return (
            <li key={exerciseId} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{ex?.name ?? exerciseId}</p>
                {lift ? <RankBadge rank={lift.rank} division={lift.division} size="sm" /> : null}
              </div>
              <ul className="mt-2 space-y-1">
                {ss.map((s) => (
                  <li key={s.id} className="flex justify-between text-sm">
                    <span className="text-muted num">S{s.setNumber}</span>
                    <span className="num">{formatSet(s.weight, s.reps)}</span>
                  </li>
                ))}
              </ul>
              {classified ? (
                <p className="mt-2 text-xs text-muted">
                  1RM {formatRm(bestE)} · score {formatFr(sessionScore, 1)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
