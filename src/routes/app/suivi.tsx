import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ResumeBanner } from "@/components/orbit/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classifiedIds, findExercise } from "@/lib/orbit/exercises";
import {
  formatDate,
  formatDateFull,
  formatDateLong,
  formatDuration,
  formatFr,
  formatVolume,
  todayKey,
} from "@/lib/orbit/format";
import { epley } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/suivi")({ component: SuiviPage });

function SuiviPage() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const [tab, setTab] = useState<"graphes" | "calendrier" | "poids">("graphes");
  if (pathname !== "/app/suivi") return <Outlet />;
  return (
    <main className="px-4 pb-36">
      <h1 className="font-display text-2xl font-semibold">Suivi</h1>
      <ResumeBanner />
      <div className="mb-4 mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
        <TabBtn active={tab === "graphes"} onClick={() => setTab("graphes")}>
          Graphes
        </TabBtn>
        <TabBtn active={tab === "calendrier"} onClick={() => setTab("calendrier")}>
          Calendrier
        </TabBtn>
        <TabBtn active={tab === "poids"} onClick={() => setTab("poids")}>
          Poids
        </TabBtn>
      </div>
      {tab === "graphes" ? <Graphs /> : tab === "calendrier" ? <Cal /> : <Poids />}
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

function Graphs() {
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const [exo, setExo] = useState<string>("volume");
  const classified = classifiedIds(pool);
  const [period, setPeriod] = useState<28 | 90 | 180>(28);
  const [kind, setKind] = useState<"max" | "rm" | "vol">("rm");

  const data = useMemo(() => {
    const from = Date.now() - period * 86400000;
    const done = store.workouts.filter(
      (w) => w.userId === user.id && w.status === "completed" && +new Date(w.startedAt) >= from,
    );
    if (kind === "vol" || exo === "volume") {
      const weeks = new Map<string, { vol: number; sort: string }>();
      for (const w of done) {
        const ss = store.sets.filter((s) => s.workoutId === w.id && (exo === "volume" || s.exerciseId === exo));
        const vol = ss.reduce((a, s) => a + s.weight * s.reps, 0);
        const [y, m, d] = w.date.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        const day = (dt.getDay() + 6) % 7;
        const mon = new Date(dt);
        mon.setDate(dt.getDate() - day);
        const key = `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, "0")}-${String(mon.getDate()).padStart(2, "0")}`;
        const prev = weeks.get(key);
        weeks.set(key, { vol: (prev?.vol ?? 0) + vol, sort: key });
      }
      return [...weeks.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, v]) => ({ d: formatDate(key), v: Math.round(v.vol) }));
    }
    const points: { d: string; v: number; t: string }[] = [];
    const sorted = [...done].sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt));
    for (const w of sorted) {
      const ss = store.sets.filter((s) => s.workoutId === w.id && s.exerciseId === exo);
      if (!ss.length) continue;
      let bestW = 0;
      let bestE = 0;
      for (const s of ss) {
        bestW = Math.max(bestW, s.weight);
        bestE = Math.max(bestE, epley(s.weight, s.reps));
      }
      points.push({
        d: formatDate(w.date),
        v: Math.round((kind === "max" ? bestW : bestE) * 10) / 10,
        t: w.date,
      });
    }
    for (const dcl of store.declaredPerfs) {
      if (dcl.userId !== user.id || dcl.exerciseId !== exo) continue;
      if (+new Date(dcl.date) < from) continue;
      points.push({
        d: formatDate(dcl.date),
        v: Math.round((kind === "max" ? dcl.weight : epley(dcl.weight, dcl.reps)) * 10) / 10,
        t: dcl.date,
      });
    }
    points.sort((a, b) => a.t.localeCompare(b.t));
    return points.map(({ d, v }) => ({ d, v }));
  }, [store.sets, store.workouts, store.declaredPerfs, user.id, exo, period, kind]);

  const tip = {
    background: "#14161c",
    border: "1px solid rgba(232,237,245,0.1)",
    borderRadius: 12,
    color: "#f3f4f7",
  };
  const unit = " kg";
  const label = kind === "vol" || exo === "volume" ? "Volume" : kind === "max" ? "Charge max" : "1RM";

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        <Chip active={exo === "volume"} onClick={() => setExo("volume")}>
          Volume total
        </Chip>
        {classified.map((id) => (
          <Chip key={id} active={exo === id} onClick={() => setExo(id)}>
            {findExercise(id, pool)?.name ?? id}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <Chip active={period === 28} onClick={() => setPeriod(28)}>
          4 sem
        </Chip>
        <Chip active={period === 90} onClick={() => setPeriod(90)}>
          3 mois
        </Chip>
        <Chip active={period === 180} onClick={() => setPeriod(180)}>
          6 mois
        </Chip>
      </div>
      {exo !== "volume" ? (
        <div className="mt-2 flex gap-1">
          <Chip active={kind === "max"} onClick={() => setKind("max")}>
            Charge max
          </Chip>
          <Chip active={kind === "rm"} onClick={() => setKind("rm")}>
            1RM
          </Chip>
          <Chip active={kind === "vol"} onClick={() => setKind("vol")}>
            Volume
          </Chip>
        </div>
      ) : null}

      <div className="mt-4 h-48">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(232,237,245,0.06)" vertical={false} />
              <XAxis dataKey="d" stroke="#8B93A7" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#8B93A7"
                fontSize={10}
                width={52}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatFr(v, 0)}
                unit={unit}
              />
              <Tooltip
                contentStyle={tip}
                formatter={(v: number) => [`${formatFr(Number(v), 0)} kg`, label]}
                labelFormatter={(l) => String(l)}
              />
              <Line type="monotone" dataKey="v" stroke="var(--color-accent)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="pt-16 text-center text-sm text-muted">Logge une séance pour voir la courbe.</p>
        )}
      </div>
    </div>
  );
}

function Cal() {
  const store = useOrbitStore();
  const pool = usePool();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const now = new Date();
  const [y, setY] = useState(now.getFullYear());
  const [m, setM] = useState(now.getMonth());
  const [picked, setPicked] = useState<string | null>(null);

  const first = new Date(y, m, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysIn = new Date(y, m + 1, 0).getDate();
  const done = store.workouts.filter((w) => w.userId === user.id && w.status === "completed");
  const byDay = new Map<string, typeof done>();
  for (const w of done) {
    const k = w.date.slice(0, 10);
    const list = byDay.get(k) ?? [];
    list.push(w);
    byDay.set(k, list);
  }

  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(first);

  function shift(dir: -1 | 1) {
    const d = new Date(y, m + dir, 1);
    setY(d.getFullYear());
    setM(d.getMonth());
    setPicked(null);
  }

  const detail = picked ? byDay.get(picked) ?? [] : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <button className="flex size-11 items-center justify-center" onClick={() => shift(-1)} aria-label="Mois précédent">
          <ChevronLeft className="size-5" />
        </button>
        <p className="text-sm font-medium capitalize">{monthLabel}</p>
        <button className="flex size-11 items-center justify-center" onClick={() => shift(1)} aria-label="Mois suivant">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-subtle">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: startPad + daysIn }, (_, i) => {
          if (i < startPad) return <div key={`p${i}`} />;
          const day = i - startPad + 1;
          const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const on = byDay.has(key);
          return (
            <button
              key={key}
              onClick={() => {
                if (!on) return;
                const list = byDay.get(key) ?? [];
                if (list.length === 1) {
                  void navigate({ to: "/app/suivi/$workoutId", params: { workoutId: list[0].id } });
                  return;
                }
                setPicked(key);
              }}
              className={cn(
                "flex h-11 flex-col items-center justify-center rounded-lg text-sm num",
                picked === key && "bg-accent text-accent-fg",
                !on && "text-muted",
              )}
            >
              {day}
              {on ? (
                <span
                  className={cn(
                    "mt-0.5 size-1 rounded-full",
                    picked === key ? "bg-accent-fg" : "bg-accent",
                  )}
                />
              ) : (
                <span className="mt-0.5 size-1" />
              )}
            </button>
          );
        })}
      </div>

      {picked && detail.length ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{formatDateLong(picked)}</p>
          {detail.map((w) => {
            const ss = store.sets.filter((s) => s.workoutId === w.id);
            const vol = ss.reduce((a, s) => a + s.weight * s.reps, 0);
            const exos = [...new Set(ss.map((s) => s.exerciseId))]
              .map((id) => findExercise(id, pool)?.name ?? id)
              .join(", ");
            return (
              <button
                key={w.id}
                className="glass w-full rounded-xl px-3 py-3 text-left"
                onClick={() => void navigate({ to: "/app/suivi/$workoutId", params: { workoutId: w.id } })}
              >
                <p className="font-medium">{w.programName}</p>
                <p className="text-sm text-muted">
                  {formatDuration(w.duration)} · {formatVolume(vol)}
                </p>
                <p className="mt-1 text-xs text-subtle">{exos}</p>
              </button>
            );
          })}
        </div>
      ) : picked ? (
        <p className="mt-4 text-sm text-muted">Pas de séance ce jour-là.</p>
      ) : null}
    </div>
  );
}

function Poids() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const logs = store.weightLogs
    .filter((l) => l.userId === user.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const current = logs[logs.length - 1]?.kg ?? user.bodyweight;
  const [open, setOpen] = useState(false);
  const [kg, setKg] = useState(String(current).replace(".", ","));
  const [date, setDate] = useState(todayKey());
  const [picked, setPicked] = useState<string | null>(null);

  function delta(days: number): number | null {
    if (!logs.length) return null;
    const latest = logs[logs.length - 1];
    const target = addDays(latest.date, -days);
    let closest = logs[0];
    for (const l of logs) {
      if (l.date <= target) closest = l;
    }
    if (latest.date === closest.date && logs.length < 2) return null;
    return Math.round((latest.kg - closest.kg) * 10) / 10;
  }

  const d7 = delta(7);
  const d30 = delta(30);
  const from90 = Date.now() - 90 * 86400000;
  const curve = logs
    .filter((l) => +new Date(l.date) >= from90)
    .map((l) => ({ d: formatDate(l.date), v: l.kg, date: l.date }));

  const tip = {
    background: "#14161c",
    border: "1px solid rgba(232,237,245,0.1)",
    borderRadius: 12,
    color: "#f3f4f7",
  };

  const pickedLog = picked ? logs.find((l) => l.date === picked) : null;

  return (
    <div>
      <p className="font-display text-5xl font-semibold leading-none num">
        {formatFr(current, 1)} <span className="text-lg text-muted">kg</span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">7 j</p>
          <p className="mt-1 text-sm font-medium num">{fmtDelta(d7)}</p>
        </div>
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">30 j</p>
          <p className="mt-1 text-sm font-medium num">{fmtDelta(d30)}</p>
        </div>
      </div>

      <div className="mt-4 h-44">
        {curve.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve}>
              <CartesianGrid stroke="rgba(232,237,245,0.06)" vertical={false} />
              <XAxis dataKey="d" stroke="#8B93A7" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#8B93A7"
                fontSize={10}
                width={48}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatFr(v, 1)}
                unit=" kg"
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={tip}
                formatter={(v: number) => [`${formatFr(Number(v), 1)} kg`, "Poids"]}
              />
              <Line type="monotone" dataKey="v" stroke="var(--color-accent)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="pt-16 text-center text-sm text-muted">Note ton poids une fois par semaine.</p>
        )}
      </div>

      <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto">
        {[...logs].reverse().slice(0, 12).map((l) => (
          <li key={l.id}>
            <button
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm",
                picked === l.date ? "bg-accent/15" : "bg-surface",
              )}
              onClick={() => setPicked(l.date)}
            >
              <span className="text-muted">{formatDateFull(l.date)}</span>
              <span className="num">{formatFr(l.kg, 1)} kg</span>
            </button>
          </li>
        ))}
      </ul>
      {pickedLog ? (
        <p className="mt-2 text-sm">
          {formatDateFull(pickedLog.date)} — {formatFr(pickedLog.kg, 1)} kg
        </p>
      ) : null}

      <Button className="sticky bottom-20 z-20 mt-4 w-full" onClick={() => setOpen(true)}>
        Noter mon poids
      </Button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
          <div className="glass-strong w-full rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Noter mon poids</h2>
            <div className="mt-3 grid gap-3">
              <div>
                <Label>Poids (kg)</Label>
                <Input className="mt-1" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
              </div>
              <div>
                <Label>Date</Label>
                <Input className="mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  const n = Number(String(kg).replace(",", "."));
                  const r = store.upsertWeight(n, date);
                  if (r.ok) setOpen(false);
                }}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function fmtDelta(n: number | null): string {
  if (n === null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${formatFr(n, 1)} kg`;
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
