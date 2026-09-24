import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ResumeBanner } from "@/components/orbit/app-header";
import { RankBadge } from "@/components/orbit/rank-badge";
import { RankGateBanner } from "@/components/orbit/starter-lifts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATALOG_GROUPS, classifiedIds, findExercise } from "@/lib/orbit/exercises";
import { formatFr, formatRm, formatSet, todayKey } from "@/lib/orbit/format";
import { computeGlobalOrbit, lastSetForExercise, liftRankFor } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import type { MuscleGroup } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/perfs")({ component: PerfsPage });

function PerfsPage() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const [tab, setTab] = useState<"classements" | "exos" | "definir">("classements");
  if (pathname !== "/app/perfs") return <Outlet />;
  return (
    <main className="px-4 pb-36">
      <h1 className="font-display text-2xl font-semibold">Perfs</h1>
      <ResumeBanner />
      <RankGateBanner />
      <div className="mb-4 mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
        <TabBtn active={tab === "classements"} onClick={() => setTab("classements")}>
          Classements
        </TabBtn>
        <TabBtn active={tab === "exos"} onClick={() => setTab("exos")}>
          Mes exos
        </TabBtn>
        <TabBtn active={tab === "definir"} onClick={() => setTab("definir")}>
          Définir
        </TabBtn>
      </div>
      {tab === "classements" ? <Board /> : tab === "exos" ? <MyExos /> : <Define />}
    </main>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("h-10 rounded-lg text-sm", active ? "bg-accent text-accent-fg" : "text-muted")}
    >
      {children}
    </button>
  );
}

function Board() {
  const store = useOrbitStore();
  const pool = usePool();
  const me = useSessionUser()!;
  const navigate = useNavigate();
  const [scope, setScope] = useState<"global" | "amis">("global");
  const [metric, setMetric] = useState<"global" | string>("global");
  const friends = store.friendsByUser[me.id] ?? [];
  const classified = classifiedIds(pool);
  const picker = ["global", ...classified];

  const rows = useMemo(() => {
    const users = store.users.filter((u) => !u.isAdmin);
    const scoped =
      scope === "amis" ? users.filter((u) => u.id === me.id || friends.includes(u.id)) : users;
    return scoped
      .map((u) => {
        if (metric === "global") {
          const o = computeGlobalOrbit(u, store.sets, store.workouts, store.declaredPerfs, pool);
          return {
            id: u.id,
            pseudo: u.pseudo,
            score: o.score,
            rank: o.rank,
            division: o.division,
            label: o.label,
            classified: o.classified,
          };
        }
        const l = liftRankFor(u, metric, store.sets, store.workouts, store.declaredPerfs, pool);
        return {
          id: u.id,
          pseudo: u.pseudo,
          score: l.score,
          rank: l.rank,
          division: l.division,
          label: l.label,
          classified: l.classifiedLift && l.score > 0,
        };
      })
      .filter((r) => r.classified)
      .sort((a, b) => b.score - a.score);
  }, [store.users, store.sets, store.workouts, store.declaredPerfs, scope, metric, friends, me.id, pool]);

  const myIndex = rows.findIndex((r) => r.id === me.id);

  return (
    <div>
      <div className="flex gap-1">
        <Chip active={scope === "global"} onClick={() => setScope("global")}>
          Global
        </Chip>
        <Chip active={scope === "amis"} onClick={() => setScope("amis")}>
          Amis
        </Chip>
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
        {picker.map((id) => (
          <Chip key={id} active={metric === id} onClick={() => setMetric(id)}>
            {id === "global" ? "Rang global" : (findExercise(id, pool)?.name ?? id)}
          </Chip>
        ))}
      </div>

      {scope === "amis" && friends.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">Aucun ami pour l’instant.</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Personne n’est classé pour l’instant. Définis 3 exos classés pour apparaître.
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {rows.map((r, i) => (
            <li key={r.id}>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                  r.id === me.id ? "bg-accent/10 shadow-[var(--shadow-border)]" : "bg-surface",
                )}
                onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: r.id } })}
              >
                <span className="w-6 text-right text-xs text-muted num">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {r.pseudo}
                    {r.id === me.id ? " · toi" : ""}
                  </p>
                </div>
                <span className="text-xs text-muted num">{formatFr(r.score, 1)}</span>
                <RankBadge rank={r.rank} division={r.division} label={r.label} size="sm" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {myIndex >= 5 ? (
        <div className="sticky bottom-20 mt-3 glass-strong flex items-center gap-3 rounded-xl px-3 py-3">
          <span className="w-6 text-right text-xs text-muted num">{myIndex + 1}</span>
          <p className="flex-1 text-sm font-medium">{me.pseudo} · toi</p>
          <span className="text-xs text-muted num">{formatFr(rows[myIndex].score, 1)}</span>
          <RankBadge
            rank={rows[myIndex].rank}
            division={rows[myIndex].division}
            label={rows[myIndex].label}
            size="sm"
          />
        </div>
      ) : null}
    </div>
  );
}

function MyExos() {
  const store = useOrbitStore();
  const pool = usePool();
  const me = useSessionUser()!;
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [g, setG] = useState("all");
  const [create, setCreate] = useState(false);
  const [cname, setCname] = useState("");
  const [cgroup, setCgroup] = useState<MuscleGroup>("pectoraux");
  const list = pool
    .filter((e) => {
      if (e.custom && e.ownerId !== me.id) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (g === "all") return true;
      const grp = CATALOG_GROUPS.find((x) => x.id === g);
      return grp ? grp.match.includes(e.group) : true;
    })
    .map((e) => liftRankFor(me, e.id, store.sets, store.workouts, store.declaredPerfs, pool))
    .sort((a, b) => {
      if (a.classifiedLift !== b.classifiedLift) return a.classifiedLift ? -1 : 1;
      return a.name.localeCompare(b.name, "fr");
    });

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input className="pl-9" placeholder="Recherche" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
        <Chip active={g === "all"} onClick={() => setG("all")}>
          Tous
        </Chip>
        {CATALOG_GROUPS.map((x) => (
          <Chip key={x.id} active={g === x.id} onClick={() => setG(x.id)}>
            {x.label}
          </Chip>
        ))}
      </div>
      <Button variant="secondary" className="mt-3 w-full" onClick={() => setCreate(true)}>
        <Plus className="size-4" />
        Créer un exo perso
      </Button>
      {list.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">Aucun exo.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {list.map((l) => (
            <li key={l.exerciseId}>
              <button
                className="glass flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left"
                onClick={() =>
                  void navigate({ to: "/app/perfs/$exerciseId", params: { exerciseId: l.exerciseId } })
                }
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{l.name}</p>
                  <p className="text-xs text-muted">
                    {l.bestWeight > 0 ? formatSet(l.bestWeight, l.bestReps) : "—"}
                    {l.epley > 0 ? ` · 1RM ${formatRm(l.epley)}` : ""}
                  </p>
                </div>
                <RankBadge rank={l.rank} division={l.division} size="sm" />
                <ChevronRight className="size-4 text-subtle" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {create ? (
        <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
          <div className="glass-strong w-full rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Exo perso</h2>
            <p className="mt-1 text-xs text-muted">Privé, Non classé.</p>
            <Label className="mt-3">Nom</Label>
            <Input className="mt-1" value={cname} onChange={(e) => setCname(e.target.value)} />
            <div className="mt-2 flex flex-wrap gap-1">
              {CATALOG_GROUPS.map((x) => (
                <Chip key={x.id} active={cgroup === x.match[0]} onClick={() => setCgroup(x.match[0])}>
                  {x.label}
                </Chip>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCreate(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1"
                disabled={!cname.trim()}
                onClick={() => {
                  const id = store.addCustomExercise(cname.trim(), cgroup);
                  setCreate(false);
                  setCname("");
                  if (id) void navigate({ to: "/app/perfs/$exerciseId", params: { exerciseId: id } });
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Define() {
  const store = useOrbitStore();
  const pool = usePool();
  const me = useSessionUser()!;
  const ids = classifiedIds(pool);
  const any = ids.some((id) => {
    const l = liftRankFor(me, id, store.sets, store.workouts, store.declaredPerfs, pool);
    return l.bestWeight > 0;
  });

  return (
    <div className="space-y-3">
      {!any ? (
        <p className="text-center text-sm text-muted">Entre tes max ici pour être classé.</p>
      ) : (
        <p className="text-xs text-muted">Exos classés. Ça ne crée pas de séance au calendrier.</p>
      )}
      {ids.map((id) => (
        <DefineRow key={id} exerciseId={id} />
      ))}
    </div>
  );
}

function DefineRow({ exerciseId }: { exerciseId: string }) {
  const store = useOrbitStore();
  const pool = usePool();
  const me = useSessionUser()!;
  const ex = findExercise(exerciseId, pool);
  const last = lastSetForExercise(store.sets, store.workouts, me.id, exerciseId, store.declaredPerfs);
  const lift = liftRankFor(me, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool);
  const [kg, setKg] = useState(last ? String(last.weight).replace(".", ",") : "");
  const [reps, setReps] = useState(last ? String(last.reps) : "5");
  const [date, setDate] = useState(todayKey());
  const [err, setErr] = useState("");

  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{ex?.name ?? exerciseId}</p>
        <RankBadge rank={lift.rank} division={lift.division} size="sm" />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <label>
          <span className="text-[10px] uppercase text-muted">Charge kg</span>
          <Input
            className="mt-0.5 h-10"
            inputMode="decimal"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            aria-label={`Charge ${ex?.name ?? exerciseId}`}
          />
        </label>
        <label>
          <span className="text-[10px] uppercase text-muted">Reps</span>
          <Input
            className="mt-0.5 h-10"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            aria-label={`Reps ${ex?.name ?? exerciseId}`}
          />
        </label>
        <label>
          <span className="text-[10px] uppercase text-muted">Date</span>
          <Input className="mt-0.5 h-10" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
      <Button
        className="mt-2 w-full"
        size="sm"
        onClick={() => {
          const r = store.declarePerf({
            exerciseId,
            weight: Number(String(kg).replace(",", ".")),
            reps: Number(reps),
            date,
          });
          setErr(r.ok ? "" : r.error);
        }}
      >
        Enregistrer {ex?.name ?? ""}
      </Button>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-sm",
        active ? "bg-accent text-accent-fg" : "bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
