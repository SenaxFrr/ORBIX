import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { classifiedExercises, findExercise, isClassifiedLift } from "@/lib/orbit/exercises";
import { formatDate, formatFr, formatRm, formatSet } from "@/lib/orbit/format";
import { historyForExercise, lastSetForExercise, liftRankFor, SCORE_FORMULA } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";

export const Route = createFileRoute("/app/perfs/$exerciseId")({ component: ExoSheet });

function ExoSheet() {
  const { exerciseId } = Route.useParams();
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const [how, setHow] = useState(false);
  const ex = findExercise(exerciseId, pool);
  const lift = liftRankFor(user, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool);
  const last = lastSetForExercise(store.sets, store.workouts, user.id, exerciseId, store.declaredPerfs);
  const hist = historyForExercise(user.id, exerciseId, store.sets, store.workouts, store.declaredPerfs, 10);
  const cutoff = Date.now() - 56 * 86400000;
  const curve = [...hist]
    .filter((h) => +new Date(h.date) >= cutoff)
    .reverse()
    .map((h) => ({
      d: formatDate(h.date),
      rm: Math.round(h.epley * 10) / 10,
      kg: h.weight,
    }));
  const classified = isClassifiedLift(exerciseId, pool);
  const mine = ex?.custom && ex.ownerId === user.id;
  const refs = classifiedExercises(pool);

  const tip = {
    background: "#14161c",
    border: "1px solid rgba(232,237,245,0.1)",
    borderRadius: 12,
    color: "#f3f4f7",
  };

  return (
    <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/perfs" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">{ex?.name ?? exerciseId}</h1>
      </header>

      <div className="mt-4 glass rounded-2xl p-4">
        <RankBadge rank={lift.rank} division={lift.division} label={lift.label} size="lg" />
        {classified ? (
          <>
            <p className="mt-3 font-display text-3xl font-semibold num">{formatFr(lift.score, 1)}</p>
            <p className="text-sm text-muted">
              score · 1RM {formatRm(lift.epley)} · réf {formatRm(lift.refKg)}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            1RM {formatRm(lift.epley)} · pas dans les classements
          </p>
        )}
        <p className="mt-3 text-sm">{lift.sentence}</p>
        {classified ? (
          <button className="mt-3 text-xs text-accent" onClick={() => setHow((v) => !v)}>
            {how ? "Masquer" : "Comment c’est calculé"}
          </button>
        ) : null}
        {how && classified ? (
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-subtle">
            <pre className="whitespace-pre-wrap">{SCORE_FORMULA}</pre>
            <p>Exemple homme, 26 kg × 8 : curl marteau 1RM 32,9 / 41 = 80,2 · tirage 32,9 / 82 = 40,1.</p>
            <ul className="space-y-0.5">
              {refs.map((r) => (
                <li key={r.id}>
                  {r.name} · H {formatRm(r.refHomme ?? 0)} · F {formatRm(r.refFemme ?? 0)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">Meilleur set</p>
          <p className="mt-1 text-sm font-medium">
            {lift.bestWeight > 0 ? formatSet(lift.bestWeight, lift.bestReps) : "—"}
          </p>
          <p className="text-xs text-subtle">{lift.at ? formatDate(lift.at) : ""}</p>
        </div>
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">Dernier set</p>
          <p className="mt-1 text-sm font-medium">{last ? formatSet(last.weight, last.reps) : "—"}</p>
          <p className="text-xs text-subtle">{last ? formatDate(last.at) : ""}</p>
        </div>
      </div>

      <section className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">1RM · 8 semaines (kg)</p>
        <div className="mt-2 h-36">
          {curve.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve}>
                <XAxis dataKey="d" stroke="#8B93A7" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#8B93A7"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(v) => formatFr(v, 0)}
                  unit=" kg"
                />
                <Tooltip
                  contentStyle={tip}
                  formatter={(v: number) => [`${formatFr(Number(v), 1)} kg`, "1RM"]}
                />
                <Line type="monotone" dataKey="rm" stroke="var(--color-accent)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="pt-8 text-center text-sm text-muted">Pas encore de courbe.</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">10 dernières séances</p>
        <ul className="mt-2 space-y-1.5">
          {hist.map((h, i) => (
            <li key={`${h.date}-${h.source}-${i}`} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
              <span className="text-muted">
                {formatDate(h.date)}
                {h.source === "declared" ? (
                  <span className="ml-2 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase text-subtle">
                    Déclaré
                  </span>
                ) : null}
              </span>
              <span className="num">
                {formatSet(h.weight, h.reps)} · 1RM {formatRm(h.epley)}
              </span>
            </li>
          ))}
          {hist.length === 0 ? <li className="text-sm text-muted">Aucune séance.</li> : null}
        </ul>
      </section>

      {mine ? (
        <Button
          variant="danger"
          className="mt-8 w-full"
          onClick={() => {
            store.deleteCustomExercise(exerciseId);
            void navigate({ to: "/app/perfs" });
          }}
        >
          Supprimer cet exo
        </Button>
      ) : null}
    </main>
  );
}
