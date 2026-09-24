import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computeGlobalOrbit } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import type { StarterPerf } from "@/lib/orbit/types";

function parseKg(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d)?$/.test(t)) return null;
  const n = Math.round(Number(t) * 10) / 10;
  return n > 0 ? n : null;
}

function parseReps(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = Number(raw.trim());
  if (!Number.isInteger(n) || n < 1 || n > 30) return null;
  return n;
}

export function StarterLiftsForm({
  submitLabel,
  busy,
  onSubmit,
}: {
  submitLabel: string;
  busy?: boolean;
  onSubmit: (perfs: StarterPerf[]) => { ok: boolean; error?: string };
}) {
  const pool = usePool();
  const options = useMemo(
    () =>
      pool
        .filter((e) => e.official && e.classified && (e.refHomme ?? 0) > 0 && (e.refFemme ?? 0) > 0)
        .sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [pool],
  );
  const [rows, setRows] = useState([
    { exerciseId: "", kg: "", reps: "" },
    { exerciseId: "", kg: "", reps: "" },
    { exerciseId: "", kg: "", reps: "" },
  ]);
  const [error, setError] = useState("");

  const perfs: StarterPerf[] = rows.map((r) => ({
    exerciseId: r.exerciseId,
    weight: parseKg(r.kg) ?? 0,
    reps: parseReps(r.reps) ?? 0,
  }));
  const ids = rows.map((r) => r.exerciseId).filter(Boolean);
  const valid =
    ids.length === 3 &&
    new Set(ids).size === 3 &&
    rows.every((r) => parseKg(r.kg) != null && parseReps(r.reps) != null);

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">Tes 3 perfs de départ — sans ça pas de rang.</p>
      {rows.map((row, i) => {
        const taken = new Set(rows.map((r, j) => (j === i ? "" : r.exerciseId)));
        return (
          <div key={i} className="grid gap-2 rounded-xl bg-surface p-3">
            <Label>Exo {i + 1}</Label>
            <select
              className="h-11 rounded-lg bg-surface-2 px-2 text-sm"
              value={row.exerciseId}
              onChange={(e) =>
                setRows((cur) => cur.map((r, j) => (j === i ? { ...r, exerciseId: e.target.value } : r)))
              }
            >
              <option value="">Choisir un exo classé</option>
              {options
                .filter((e) => e.id === row.exerciseId || !taken.has(e.id))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Charge (kg)</Label>
                <Input
                  className="mt-1"
                  inputMode="decimal"
                  placeholder="60,5"
                  value={row.kg}
                  onChange={(e) =>
                    setRows((cur) => cur.map((r, j) => (j === i ? { ...r, kg: e.target.value } : r)))
                  }
                />
              </div>
              <div>
                <Label>Reps</Label>
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  placeholder="5"
                  value={row.reps}
                  onChange={(e) =>
                    setRows((cur) => cur.map((r, j) => (j === i ? { ...r, reps: e.target.value } : r)))
                  }
                />
              </div>
            </div>
          </div>
        );
      })}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button
        size="lg"
        disabled={!valid || busy}
        onClick={() => {
          if (!valid) return;
          const r = onSubmit(perfs);
          if (!r.ok) setError(r.error ?? "Perfs invalides.");
          else setError("");
        }}
      >
        {submitLabel}
      </Button>
    </div>
  );
}

export function RankGateBanner() {
  const user = useSessionUser();
  const pool = usePool();
  const sets = useOrbitStore((s) => s.sets);
  const workouts = useOrbitStore((s) => s.workouts);
  const declared = useOrbitStore((s) => s.declaredPerfs);
  const declareStarter = useOrbitStore((s) => s.declareStarter);
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const orbit = computeGlobalOrbit(user, sets, workouts, declared, pool);
  if (orbit.classified) return null;
  return (
    <div className="mt-3 rounded-xl bg-warn/15 px-3 py-3">
      <p className="text-sm text-warn">Ajoute 3 exos classés pour débloquer ton rang.</p>
      {open ? (
        <div className="mt-3">
          <StarterLiftsForm
            submitLabel="Calculer mon rang"
            onSubmit={(perfs) => {
              const r = declareStarter(perfs);
              if (r.ok) setOpen(false);
              return r;
            }}
          />
        </div>
      ) : (
        <Button className="mt-3" size="sm" onClick={() => setOpen(true)}>
          Renseigner
        </Button>
      )}
    </div>
  );
}
