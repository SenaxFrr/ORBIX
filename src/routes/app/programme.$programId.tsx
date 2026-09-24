import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExercisePicker } from "@/components/orbit/exercise-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findExercise } from "@/lib/orbit/exercises";
import { formatRest, formatSeries, formatWeight } from "@/lib/orbit/format";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";

export const Route = createFileRoute("/app/programme/$programId")({ component: ProgramDetail });

function ProgramDetail() {
  const { programId } = Route.useParams();
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const program = store.programs.find((p) => p.id === programId);
  const canEdit = !!program && !program.builtin && program.ownerId === user.id;
  const [pick, setPick] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");

  if (!program) {
    return (
      <main className="px-4 pb-28 pt-4">
        <p className="text-sm text-muted">Programme introuvable.</p>
        <Button className="mt-4" onClick={() => void navigate({ to: "/app/programme" })}>
          Retour
        </Button>
      </main>
    );
  }

  return (
    <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/programme" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        {canEdit ? (
          <Input
            className="h-11 flex-1"
            defaultValue={program.name}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v) store.updateProgram(program.id, { name: v });
            }}
          />
        ) : (
          <h1 className="font-display text-xl font-semibold">{program.name}</h1>
        )}
      </header>
      {program.description ? <p className="mt-1 px-1 text-sm text-muted">{program.description}</p> : null}

      <ul className="mt-4 space-y-2">
        {program.exercises.map((row, i) => {
          const ex = findExercise(row.exerciseId, pool);
          return (
            <li key={row.exerciseId} className="glass rounded-2xl px-3 py-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{ex?.name ?? row.exerciseId}</p>
                  <p className="text-xs text-muted">
                    {formatSeries(row.sets)} · {row.reps} reps · repos {formatRest(row.restSeconds)}
                    {row.targetKg ? ` · ${formatWeight(row.targetKg)}` : ""}
                  </p>
                </div>
                {canEdit ? (
                  <div className="flex shrink-0">
                    <button
                      className="flex size-10 items-center justify-center text-muted"
                      onClick={() => store.moveProgramExercise(program.id, row.exerciseId, -1)}
                      disabled={i === 0}
                      aria-label="Monter"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      className="flex size-10 items-center justify-center text-muted"
                      onClick={() => store.moveProgramExercise(program.id, row.exerciseId, 1)}
                      disabled={i === program.exercises.length - 1}
                      aria-label="Descendre"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      className="flex size-10 items-center justify-center text-danger"
                      onClick={() => store.removeExerciseFromProgram(program.id, row.exerciseId)}
                      aria-label="Retirer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ) : null}
              </div>
              {canEdit ? (
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  <Num
                    label="Séries"
                    value={row.sets}
                    onChange={(n) =>
                      store.updateProgram(program.id, {
                        exercises: program.exercises.map((e) =>
                          e.exerciseId === row.exerciseId ? { ...e, sets: n } : e,
                        ),
                      })
                    }
                  />
                  <Num
                    label="Reps"
                    value={row.reps}
                    onChange={(n) =>
                      store.updateProgram(program.id, {
                        exercises: program.exercises.map((e) =>
                          e.exerciseId === row.exerciseId ? { ...e, reps: n } : e,
                        ),
                      })
                    }
                  />
                  <Num
                    label="Repos s"
                    value={row.restSeconds}
                    onChange={(n) =>
                      store.updateProgram(program.id, {
                        exercises: program.exercises.map((e) =>
                          e.exerciseId === row.exerciseId ? { ...e, restSeconds: n } : e,
                        ),
                      })
                    }
                  />
                  <Num
                    label="kg"
                    value={row.targetKg ?? 0}
                    onChange={(n) =>
                      store.updateProgram(program.id, {
                        exercises: program.exercises.map((e) =>
                          e.exerciseId === row.exerciseId ? { ...e, targetKg: n || null } : e,
                        ),
                      })
                    }
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {canEdit ? (
        <Button variant="secondary" className="mt-3 w-full" onClick={() => setPick(true)}>
          <Plus className="size-4" />
          Ajouter un exo
        </Button>
      ) : null}

      <div className="mt-6 grid gap-2">
        <Button
          size="lg"
          className="w-full"
          disabled={!active && program.exercises.length === 0}
          onClick={() => {
            if (active) {
              void navigate({ to: "/app/seance" });
              return;
            }
            store.startWorkout(program.id);
            void navigate({ to: "/app/seance" });
          }}
        >
          {active ? "Reprendre la séance" : "Commencer la séance"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const id = store.duplicateProgram(program.id);
            if (id) void navigate({ to: "/app/programme/$programId", params: { programId: id } });
          }}
        >
          Dupliquer
        </Button>
        {canEdit ? (
          <Button variant="danger" onClick={() => setConfirmDel(true)}>
            Supprimer
          </Button>
        ) : null}
      </div>

      {pick ? (
        <ExercisePicker
          exclude={program.exercises.map((e) => e.exerciseId)}
          onClose={() => setPick(false)}
          onPick={(id) => {
            store.addExerciseToProgram(program.id, id);
            setPick(false);
          }}
        />
      ) : null}

      {confirmDel ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Supprimer ce programme ?</h2>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmDel(false)}>
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  store.deleteProgram(program.id);
                  void navigate({ to: "/app/programme" });
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase text-muted">{label}</span>
      <Input
        className="mt-0.5 h-10 px-2 text-center"
        inputMode="decimal"
        defaultValue={value}
        onBlur={(e) => onChange(Number(String(e.target.value).replace(",", ".")) || 0)}
      />
    </label>
  );
}
