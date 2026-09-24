import {
  classifiedIds,
  DEFAULT_CATALOG,
  findExercise,
  isClassifiedLift,
  refForSex,
} from "./exercises";
import { formatFr, formatRm, formatWeight } from "./format";
import type {
  DeclaredPerf,
  Division,
  Exercise,
  GlobalOrbit,
  LiftHistoryRow,
  LiftRank,
  RankDef,
  RankEvent,
  RankId,
  SetLog,
  User,
  Workout,
} from "./types";

export const RANKS: RankDef[] = [
  { id: "fer", name: "Fer", min: 0, max: 39, color: "#8A8F98" },
  { id: "bronze", name: "Bronze", min: 40, max: 54, color: "#C47A4A" },
  { id: "argent", name: "Argent", min: 55, max: 74, color: "#C5CDD8" },
  { id: "or", name: "Or", min: 75, max: 99, color: "#E4B84A" },
  { id: "platine", name: "Platine", min: 100, max: 119, color: "#B8D4E8" },
  { id: "diamant", name: "Diamant", min: 120, max: 139, color: "#5EE0F0" },
  { id: "maitre", name: "Maître", min: 140, max: 159, color: "#9B7CFF" },
  { id: "champion", name: "Champion", min: 160, max: 199, color: "#C4454A" },
];

export const UNRANKED: RankDef = {
  id: "non-classe",
  name: "Non classé",
  min: 0,
  max: 0,
  color: "#5C6478",
};

export const SCORE_FORMULA = [
  "1RM = charge × (1 + reps / 30)  ·  si 1 rep → 1RM = charge",
  "score = 100 × (1RM / réf intermédiaire Strength Level)",
  "puis × coef âge : 13–15 → 1,15 · 16–18 → 1,08 · 19–35 → 1,00 · 36–49 → 1,06 · 50+ → 1,12",
  "100 = intermédiaire Strength Level. Haltères : un haltère, pas la paire.",
].join("\n");

export function rankById(id: RankId): RankDef {
  if (id === "non-classe") return UNRANKED;
  return RANKS.find((r) => r.id === id) ?? RANKS[0];
}

export function epley(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function coefAge(age: number): number {
  if (age <= 15) return 1.15;
  if (age <= 18) return 1.08;
  if (age <= 35) return 1;
  if (age <= 49) return 1.06;
  return 1.12;
}

export function scoreExo(opts: { epley1RM: number; refKg: number; age: number }): number {
  if (opts.epley1RM <= 0 || opts.refKg <= 0) return 0;
  const rm = round1(opts.epley1RM);
  const score = round1((100 * rm) / opts.refKg);
  return round1(score * coefAge(opts.age));
}

export function divisionFor(score: number, def: RankDef): Division {
  const span = Math.max(1, def.max - def.min + 1);
  const slice = span / 3;
  const rel = score - def.min;
  if (rel < slice) return "III";
  if (rel < slice * 2) return "II";
  return "I";
}

export function rankFromScore(score: number, classified: boolean): { def: RankDef; division: Division | null } {
  if (!classified || score <= 0) return { def: UNRANKED, division: null };
  let current = RANKS[0];
  for (const r of RANKS) {
    if (score >= r.min) current = r;
  }
  return { def: current, division: divisionFor(score, current) };
}

export function rankLabel(id: RankId, division: Division | null): string {
  const name = rankById(id).name;
  if (id === "non-classe" || !division) return name;
  return `${name} ${division}`;
}

export function rankTier(rank: RankId, division: Division | null): number {
  if (rank === "non-classe") return -1;
  const i = RANKS.findIndex((r) => r.id === rank);
  const d = division === "I" ? 2 : division === "II" ? 1 : 0;
  return i * 3 + d;
}

export function rose(
  from: { rank: RankId; division: Division | null },
  to: { rank: RankId; division: Division | null },
): boolean {
  return rankTier(to.rank, to.division) > rankTier(from.rank, from.division);
}

export function nextRankInfo(score: number, classified: boolean): { pct: number; label: string; nextName: string | null } {
  if (!classified || score <= 0) {
    return { pct: 0, label: "3 exos types pour débloquer ton rang", nextName: null };
  }
  const { def, division } = rankFromScore(score, true);
  const span = Math.max(1, def.max - def.min + 1);
  const slice = span / 3;
  let nextScore = def.max + 1;
  let nextLabel = "";
  let floor = def.min;
  if (division === "III") {
    nextScore = def.min + slice;
    nextLabel = `${def.name} II`;
    floor = def.min;
  } else if (division === "II") {
    nextScore = def.min + slice * 2;
    nextLabel = `${def.name} I`;
    floor = def.min + slice;
  } else {
    const idx = RANKS.findIndex((r) => r.id === def.id);
    const next = RANKS[idx + 1];
    if (!next) return { pct: 100, label: "Palier max", nextName: null };
    nextScore = next.min;
    nextLabel = `${next.name} III`;
    floor = def.min + slice * 2;
  }
  const width = Math.max(0.1, nextScore - floor);
  const pct = Math.max(0, Math.min(100, ((score - floor) / width) * 100));
  const pts = Math.max(0, round1(nextScore - score));
  const digits = Number.isInteger(pts) ? 0 : 1;
  return { pct, label: `encore ${formatFr(pts, digits)} pts pour ${nextLabel}`, nextName: nextLabel };
}

type RawBest = { weight: number; reps: number; epley: number; at: string };

export function bestSetForExercise(
  sets: SetLog[],
  workouts: Workout[],
  userId: string,
  exerciseId: string,
  declared: DeclaredPerf[] = [],
): RawBest | null {
  const wIds = new Set(
    workouts.filter((w) => w.userId === userId && (w.status === "completed" || w.status === "in_progress")).map((w) => w.id),
  );
  let best: RawBest | null = null;
  for (const s of sets) {
    if (s.exerciseId !== exerciseId || !wIds.has(s.workoutId)) continue;
    const e = epley(s.weight, s.reps);
    if (!best || e > best.epley) best = { weight: s.weight, reps: s.reps, epley: e, at: s.completedAt };
  }
  for (const d of declared) {
    if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
    const e = epley(d.weight, d.reps);
    if (!best || e > best.epley) best = { weight: d.weight, reps: d.reps, epley: e, at: d.date };
  }
  return best;
}

export function lastSetForExercise(
  sets: SetLog[],
  workouts: Workout[],
  userId: string,
  exerciseId: string,
  declared: DeclaredPerf[] = [],
): { weight: number; reps: number; at: string } | null {
  const allowed = new Set(
    workouts.filter((w) => w.userId === userId && w.status !== "abandoned").map((w) => w.id),
  );
  const mine = sets
    .filter((s) => s.exerciseId === exerciseId && allowed.has(s.workoutId))
    .map((s) => ({ weight: s.weight, reps: s.reps, at: s.completedAt }));
  for (const d of declared) {
    if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
    mine.push({ weight: d.weight, reps: d.reps, at: d.updatedAt || d.date });
  }
  mine.sort((a, b) => +new Date(b.at) - +new Date(a.at));
  return mine[0] ?? null;
}

export function liftRankFor(
  user: User,
  exerciseId: string,
  sets: SetLog[],
  workouts: Workout[],
  declared: DeclaredPerf[] = [],
  pool: Exercise[] = DEFAULT_CATALOG,
): LiftRank {
  const ex = findExercise(exerciseId, pool);
  const classifiedLift = isClassifiedLift(exerciseId, pool);
  const refKg = ex && classifiedLift ? refForSex(ex, user.sex) : 0;
  const raw = bestSetForExercise(sets, workouts, user.id, exerciseId, declared);
  const rm = raw?.epley ?? 0;
  const rawScore = classifiedLift ? scoreExo({ epley1RM: rm, refKg, age: user.age }) : 0;
  const ranked = classifiedLift && rawScore > 0;
  const score = ranked ? rawScore : 0;
  const { def, division } = rankFromScore(score, ranked);
  const label = rankLabel(def.id, division);
  const name = ex?.name ?? exerciseId;
  const sentence =
    raw && raw.weight > 0
      ? classifiedLift
        ? `${name} ${formatWeight(raw.weight)} × ${raw.reps} · 1RM ${formatRm(rm)} · réf intermédiaire ${formatRm(refKg)} · score ${formatFr(score, 1)} · ${label}`
        : `${name} ${formatWeight(raw.weight)} × ${raw.reps} · 1RM ${formatRm(rm)} · Non classé`
      : `${name} — pas encore de série.`;
  return {
    exerciseId,
    name,
    classifiedLift,
    score,
    rank: def.id,
    division,
    label,
    epley: rm,
    refKg,
    bestWeight: raw?.weight ?? 0,
    bestReps: raw?.reps ?? 0,
    at: raw?.at ?? null,
    sentence,
  };
}

export function loggedExerciseIds(
  user: User,
  sets: SetLog[],
  workouts: Workout[],
  declared: DeclaredPerf[] = [],
): string[] {
  const wIds = new Set(
    workouts.filter((w) => w.userId === user.id && w.status === "completed").map((w) => w.id),
  );
  const fromSets = sets.filter((s) => wIds.has(s.workoutId)).map((s) => s.exerciseId);
  const fromDecl = declared.filter((d) => d.userId === user.id).map((d) => d.exerciseId);
  return [...new Set([...fromSets, ...fromDecl])];
}

export function classifiedLoggedIds(
  user: User,
  sets: SetLog[],
  workouts: Workout[],
  declared: DeclaredPerf[] = [],
  pool: Exercise[] = DEFAULT_CATALOG,
): string[] {
  return classifiedIds(pool).filter((id) => {
    const lift = liftRankFor(user, id, sets, workouts, declared, pool);
    return lift.bestWeight > 0 || lift.epley > 0;
  });
}

export function computeGlobalOrbit(
  user: User,
  sets: SetLog[],
  workouts: Workout[],
  declared: DeclaredPerf[] = [],
  pool: Exercise[] = DEFAULT_CATALOG,
): GlobalOrbit {
  const ids = classifiedLoggedIds(user, sets, workouts, declared, pool);
  const lifts = ids
    .map((id) => liftRankFor(user, id, sets, workouts, declared, pool))
    .filter((l) => l.classifiedLift && l.score > 0);
  lifts.sort((a, b) => b.score - a.score);
  if (lifts.length < 3) {
    return {
      score: 0,
      rank: "non-classe",
      division: null,
      label: "Non classé",
      classified: false,
      reason: "Renseigne au moins 3 exos classés pour un rang global.",
      top: lifts,
    };
  }
  const score = round1(lifts.reduce((a, l) => a + l.score, 0) / lifts.length);
  const { def, division } = rankFromScore(score, true);
  return {
    score,
    rank: def.id,
    division,
    label: rankLabel(def.id, division),
    classified: true,
    reason: null,
    top: lifts,
  };
}

export function historyForExercise(
  userId: string,
  exerciseId: string,
  sets: SetLog[],
  workouts: Workout[],
  declared: DeclaredPerf[] = [],
  limit = 10,
): LiftHistoryRow[] {
  const done = workouts
    .filter((w) => w.userId === userId && w.status === "completed")
    .sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
  const out: LiftHistoryRow[] = [];
  for (const w of done) {
    const ss = sets.filter((s) => s.workoutId === w.id && s.exerciseId === exerciseId);
    if (!ss.length) continue;
    let best = ss[0];
    let bestE = epley(best.weight, best.reps);
    for (const s of ss) {
      const e = epley(s.weight, s.reps);
      if (e > bestE) {
        best = s;
        bestE = e;
      }
    }
    out.push({ date: w.date, weight: best.weight, reps: best.reps, epley: bestE, source: "session" });
  }
  for (const d of declared) {
    if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
    out.push({
      date: d.date,
      weight: d.weight,
      reps: d.reps,
      epley: epley(d.weight, d.reps),
      source: "declared",
    });
  }
  out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return out.slice(0, limit);
}

export function diffRankEvents(
  before: { global: GlobalOrbit; lifts: LiftRank[] },
  after: { global: GlobalOrbit; lifts: LiftRank[] },
  focusId?: string,
): RankEvent[] {
  const events: RankEvent[] = [];
  const ids = focusId ? [focusId] : [...new Set([...before.lifts, ...after.lifts].map((l) => l.exerciseId))];
  for (const id of ids) {
    const b = before.lifts.find((l) => l.exerciseId === id);
    const a = after.lifts.find((l) => l.exerciseId === id);
    if (!a || !b) continue;
    if (rose(b, a)) {
      events.push({ kind: "exo", name: a.name, from: b.label, to: a.label, color: rankById(a.rank).color });
    }
  }
  if (rose(before.global, after.global)) {
    events.push({
      kind: "global",
      from: before.global.label,
      to: after.global.label,
      score: after.global.score,
      rank: after.global.rank,
      division: after.global.division,
      color: rankById(after.global.rank).color,
    });
  }
  return events;
}
