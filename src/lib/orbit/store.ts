import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { hashPassword, uid } from "@/lib/utils";
import { cloneCatalog, findExercise, INTERMEDIATE_REFS, isClassifiedLift, poolFrom } from "./exercises";
import { todayKey } from "./format";
import { BUILTIN_PROGRAMS } from "./programs";
import { computeGlobalOrbit, diffRankEvents, lastSetForExercise, liftRankFor } from "./ranks";
import { ADMIN_ID, buildBaseWorld, makeAdmin } from "./seed";
import type {
  ChatMessage,
  DeclaredPerf,
  Exercise,
  Goal,
  HoldUntil,
  Level,
  MuscleGroup,
  Post,
  PostTag,
  Program,
  ProgramExercise,
  RankEvent,
  RestState,
  SetLog,
  Sex,
  User,
  WeightLog,
  Workout,
  WorkoutExercise,
} from "./types";

interface OrbitData {
  users: User[];
  sessionUserId: string | null;
  workouts: Workout[];
  sets: SetLog[];
  workoutExercises: WorkoutExercise[];
  programs: Program[];
  customExercises: Exercise[];
  posts: Post[];
  likes: Record<string, string[]>;
  friendsByUser: Record<string, string[]>;
  restByUser: Record<string, RestState | null>;
  declaredPerfs: DeclaredPerf[];
  weightLogs: WeightLog[];
  catalog: Exercise[];
  messages: ChatMessage[];
  mutedUntil: Record<string, HoldUntil>;
  chatClosedUntil: HoldUntil | null;
  lastSentAt: Record<string, number>;
  lastText: Record<string, string>;
  floodUntil: Record<string, number>;
}

type ProfilePatch = Partial<
  Pick<User, "bodyweight" | "height" | "sex" | "age" | "firstName" | "level" | "goal">
>;

interface OrbitState extends OrbitData {
  hydrated: boolean;
  notice: string | null;
  rankQueue: RankEvent[];
  markHydrated: () => void;
  ensureSeed: () => void;
  register: (opts: {
    pseudo: string;
    password: string;
    sex: Sex;
    age: number;
    bodyweight: number;
    height: number;
  }) => { ok: true; user: User } | { ok: false; error: string };
  login: (pseudo: string, password: string) => { ok: true; user: User } | { ok: false; error: string };
  logout: () => void;
  updateProfile: (patch: ProfilePatch) => void;
  changePassword: (current: string, next: string) => { ok: true } | { ok: false; error: string };
  addFriend: (pseudo: string) => { ok: true } | { ok: false; error: string };
  removeFriend: (id: string) => void;
  createProgram: (name: string, from?: Program) => string;
  createOfficialProgram: (name: string, description?: string) => string;
  updateProgram: (id: string, patch: Partial<Pick<Program, "name" | "description" | "exercises">>) => void;
  deleteProgram: (id: string) => void;
  duplicateProgram: (id: string) => string;
  addExerciseToProgram: (programId: string, exerciseId: string) => void;
  removeExerciseFromProgram: (programId: string, exerciseId: string) => void;
  moveProgramExercise: (programId: string, exerciseId: string, dir: -1 | 1) => void;
  addCustomExercise: (name: string, group: MuscleGroup) => string;
  deleteCustomExercise: (id: string) => void;
  createOfficialExercise: (opts: {
    name: string;
    group: MuscleGroup;
    classified: boolean;
    refHomme?: number;
    refFemme?: number;
  }) => { ok: true; id: string } | { ok: false; error: string };
  updateOfficialExercise: (
    id: string,
    patch: Partial<Pick<Exercise, "name" | "group" | "classified" | "refHomme" | "refFemme">>,
  ) => { ok: true } | { ok: false; error: string };
  deleteOfficialExercise: (id: string) => { ok: true } | { ok: false; error: string };
  startWorkout: (programId: string) => string;
  addSet: (opts: { workoutId: string; exerciseId: string; weight: number; reps: number }) => void;
  finishWorkout: (workoutId: string) => void;
  abandonWorkout: (id: string) => void;
  skipRest: () => void;
  createPost: (opts: { title: string; body: string; tag: PostTag | null }) => void;
  updatePost: (id: string, patch: Partial<Pick<Post, "title" | "body" | "tag">>) => void;
  deletePost: (id: string) => void;
  toggleLike: (postId: string) => void;
  declarePerf: (opts: {
    exerciseId: string;
    weight: number;
    reps: number;
    date: string;
  }) => { ok: true; label: string } | { ok: false; error: string };
  upsertWeight: (kg: number, date: string) => { ok: true } | { ok: false; error: string };
  sendMessage: (text: string) => { ok: true } | { ok: false; error: string };
  deleteMessage: (id: string) => void;
  muteUser: (userId: string, minutes: 15 | 60 | 1440 | "manual") => void;
  unmuteUser: (userId: string) => void;
  closeChat: (minutes: 15 | 60 | "manual") => void;
  openChat: () => void;
  deleteAccount: (userId: string) => { ok: true } | { ok: false; error: string };
  dismissNotice: () => void;
  shiftRankEvent: () => void;
}

const empty: OrbitData = {
  users: [],
  sessionUserId: null,
  workouts: [],
  sets: [],
  workoutExercises: [],
  programs: [],
  customExercises: [],
  posts: [],
  likes: {},
  friendsByUser: {},
  restByUser: {},
  declaredPerfs: [],
  weightLogs: [],
  catalog: [],
  messages: [],
  mutedUntil: {},
  chatClosedUntil: null,
  lastSentAt: {},
  lastText: {},
  floodUntil: {},
};

export function isHeld(until: HoldUntil | null | undefined, now = Date.now()): boolean {
  if (until == null) return false;
  if (until === "manual") return true;
  return until > now;
}

function toHold(minutes: 15 | 60 | 1440 | "manual"): HoldUntil {
  if (minutes === "manual") return "manual";
  return Date.now() + minutes * 60_000;
}

function sessionUser(s: OrbitData): User | undefined {
  return s.users.find((u) => u.id === s.sessionUserId && !u.isNpc);
}

function canMutateProgram(s: OrbitData, programId: string): Program | null {
  const user = sessionUser(s);
  const p = s.programs.find((x) => x.id === programId);
  if (!user || !p) return null;
  if (p.builtin) return user.isAdmin ? p : null;
  return p.ownerId === user.id ? p : null;
}

function applyBodyweight(s: OrbitData, userId: string, kg: number, date: string): Partial<OrbitData> {
  const exists = s.weightLogs.some((l) => l.userId === userId && l.date === date);
  const logs = exists
    ? s.weightLogs.map((l) => (l.userId === userId && l.date === date ? { ...l, kg } : l))
    : [...s.weightLogs, { id: uid(), userId, kg, date }];
  const mine = logs.filter((l) => l.userId === userId).sort((a, b) => a.date.localeCompare(b.date));
  const latest = mine[mine.length - 1];
  const users = s.users.map((u) => (u.id === userId && latest ? { ...u, bodyweight: latest.kg } : u));
  return { weightLogs: logs, users };
}

function classifiedCount(catalog: Exercise[]): number {
  return catalog.filter((e) => e.classified && (e.refHomme ?? 0) > 0 && (e.refFemme ?? 0) > 0).length;
}

function migrateCatalog(catalog: Exercise[] | undefined): Exercise[] {
  if (!Array.isArray(catalog) || catalog.length === 0) return cloneCatalog();
  let changed = false;
  const next = catalog.map((e) => {
    const r = INTERMEDIATE_REFS[e.id];
    if (!r) return e;
    const missingRefs = !(e.refHomme! > 0) || !(e.refFemme! > 0);
    const classifiedUnset = e.classified == null;
    if (!missingRefs && !classifiedUnset) {
      if (e.official) return e;
      changed = true;
      return { ...e, official: true };
    }
    changed = true;
    return {
      ...e,
      official: true,
      classified: classifiedUnset ? true : !!e.classified,
      refHomme: e.refHomme! > 0 ? e.refHomme : r.homme,
      refFemme: e.refFemme! > 0 ? e.refFemme : r.femme,
    };
  });
  const have = new Set(next.map((e) => e.id));
  for (const e of cloneCatalog()) {
    if (!have.has(e.id)) {
      next.push(e);
      changed = true;
    }
  }
  if (classifiedCount(next) < 1) {
    for (let i = 0; i < next.length; i++) {
      const r = INTERMEDIATE_REFS[next[i].id];
      if (!r) continue;
      next[i] = { ...next[i], classified: true, official: true, refHomme: r.homme, refFemme: r.femme };
      changed = true;
    }
  }
  return changed ? next : catalog;
}

function purgeUserFrom(s: OrbitData, userId: string): Partial<OrbitData> {
  const workouts = s.workouts.filter((w) => w.userId !== userId);
  const wids = new Set(workouts.map((w) => w.id));
  const friendsByUser: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(s.friendsByUser)) {
    if (k === userId) continue;
    friendsByUser[k] = v.filter((id) => id !== userId);
  }
  const restByUser = { ...s.restByUser };
  delete restByUser[userId];
  const mutedUntil = { ...s.mutedUntil };
  delete mutedUntil[userId];
  const lastSentAt = { ...s.lastSentAt };
  delete lastSentAt[userId];
  const lastText = { ...s.lastText };
  delete lastText[userId];
  const floodUntil = { ...s.floodUntil };
  delete floodUntil[userId];
  const likes: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(s.likes)) likes[k] = v.filter((id) => id !== userId);
  return {
    users: s.users.filter((u) => u.id !== userId),
    workouts,
    sets: s.sets.filter((x) => wids.has(x.workoutId)),
    workoutExercises: s.workoutExercises.filter((x) => wids.has(x.workoutId)),
    programs: s.programs.filter((p) => p.builtin || p.ownerId !== userId),
    customExercises: s.customExercises.filter((e) => e.ownerId !== userId),
    posts: s.posts.filter((p) => p.authorId !== userId),
    likes,
    friendsByUser,
    restByUser,
    declaredPerfs: s.declaredPerfs.filter((d) => d.userId !== userId),
    weightLogs: s.weightLogs.filter((l) => l.userId !== userId),
    messages: s.messages.filter((m) => m.userId !== userId),
    mutedUntil,
    lastSentAt,
    lastText,
    floodUntil,
    sessionUserId: s.sessionUserId === userId ? null : s.sessionUserId,
  };
}

function snap(s: OrbitData, user: User) {
  const pool = poolFrom(s);
  const lifts = pool
    .filter((e) => e.classified)
    .map((e) => liftRankFor(user, e.id, s.sets, s.workouts, s.declaredPerfs, pool));
  return {
    global: computeGlobalOrbit(user, s.sets, s.workouts, s.declaredPerfs, pool),
    lifts,
  };
}

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      ...empty,
      hydrated: false,
      notice: null,
      rankQueue: [],
      markHydrated: () => set({ hydrated: true }),
      ensureSeed: () => {
        const s = get();
        const world = buildBaseWorld();
        const kept = (s.users ?? [])
          .filter((u) => !u.isNpc && u.pseudo.toLowerCase() !== "demo" && u.id !== "user_demo")
          .map((u) => {
            if (!u.npcLifts && !u.firstName) return u;
            const next = { ...u };
            delete next.npcLifts;
            if (next.isAdmin) delete next.firstName;
            return next;
          });
        const foundAdmin = kept.find((u) => u.isAdmin && u.pseudo === "admin");
        const admin = foundAdmin ?? makeAdmin();
        const users = [admin, ...kept.filter((u) => u.id !== admin.id && u.pseudo.toLowerCase() !== "admin")];
        const keep = new Set(users.map((u) => u.id));
        const workouts = (s.workouts ?? []).filter((w) => keep.has(w.userId));
        const wids = new Set(workouts.map((w) => w.id));
        const haveBuiltin = BUILTIN_PROGRAMS.every((b) => (s.programs ?? []).some((p) => p.id === b.id));
        const extras = haveBuiltin ? [] : BUILTIN_PROGRAMS.filter((b) => !(s.programs ?? []).some((p) => p.id === b.id));
        const programs = [...extras, ...(s.programs ?? []).filter((p) => p.builtin || (p.ownerId && keep.has(p.ownerId)))];
        const friendsByUser: Record<string, string[]> = {};
        for (const u of users) {
          friendsByUser[u.id] = (s.friendsByUser?.[u.id] ?? []).filter((id) => keep.has(id));
        }
        const restByUser: Record<string, RestState | null> = {};
        for (const u of users) restByUser[u.id] = s.restByUser?.[u.id] ?? null;
        set({
          users,
          sessionUserId: s.sessionUserId && keep.has(s.sessionUserId) ? s.sessionUserId : null,
          workouts,
          sets: (s.sets ?? []).filter((x) => wids.has(x.workoutId)),
          workoutExercises: (s.workoutExercises ?? []).filter((x) => wids.has(x.workoutId)),
          programs: programs.length ? programs : world.programs,
          customExercises: (s.customExercises ?? []).filter((e) => !e.ownerId || keep.has(e.ownerId)),
          posts: (s.posts ?? []).filter((p) => keep.has(p.authorId)),
          likes: Object.fromEntries(
            Object.entries(s.likes ?? {}).map(([k, v]) => [k, v.filter((id) => keep.has(id))]),
          ),
          friendsByUser,
          restByUser,
          declaredPerfs: (s.declaredPerfs ?? []).filter((d) => keep.has(d.userId)),
          weightLogs: (s.weightLogs ?? []).filter((l) => keep.has(l.userId)),
          catalog: migrateCatalog(s.catalog),
          messages: (s.messages ?? []).filter((m) => keep.has(m.userId)),
          mutedUntil: s.mutedUntil ?? {},
          chatClosedUntil: s.chatClosedUntil ?? null,
          lastSentAt: s.lastSentAt ?? {},
          lastText: s.lastText ?? {},
          floodUntil: s.floodUntil ?? {},
        });
      },
      register: (opts) => {
        const p = opts.pseudo.trim().toLowerCase();
        if (p.length < 2) return { ok: false, error: "Pseudo trop court." };
        if (p === "admin" || p === "demo") return { ok: false, error: "Ce pseudo est réservé." };
        if (get().users.some((u) => u.pseudo.toLowerCase() === p)) {
          return { ok: false, error: "Ce pseudo est déjà pris." };
        }
        if (opts.password.length < 4) return { ok: false, error: "Mot de passe trop court." };
        if (!opts.sex || opts.age < 13 || opts.age > 80 || opts.height < 120 || opts.bodyweight < 30) {
          return { ok: false, error: "Profil incomplet." };
        }
        const user: User = {
          id: uid(),
          pseudo: opts.pseudo.trim(),
          passwordHash: hashPassword(opts.password),
          sex: opts.sex,
          age: opts.age,
          bodyweight: opts.bodyweight,
          height: opts.height,
          level: "debutant",
          goal: "force",
          createdAt: new Date().toISOString(),
        };
        const today = todayKey();
        set((s) => ({
          users: [...s.users, user],
          sessionUserId: user.id,
          friendsByUser: { ...s.friendsByUser, [user.id]: [] },
          weightLogs: [...s.weightLogs, { id: uid(), userId: user.id, kg: opts.bodyweight, date: today }],
        }));
        return { ok: true, user };
      },
      login: (pseudo, password) => {
        const p = pseudo.trim().toLowerCase();
        const user = get().users.find((u) => u.pseudo.toLowerCase() === p && !u.isNpc);
        if (!user || user.passwordHash !== hashPassword(password)) {
          return { ok: false, error: "Pseudo ou mot de passe incorrect." };
        }
        set({ sessionUserId: user.id });
        return { ok: true, user };
      },
      logout: () => set({ sessionUserId: null }),
      updateProfile: (patch) => {
        const id = get().sessionUserId;
        if (!id) return;
        const today = todayKey();
        set((s) => {
          let extra: Partial<OrbitData> = {};
          if (typeof patch.bodyweight === "number") {
            extra = applyBodyweight(s, id, Math.round(patch.bodyweight * 10) / 10, today);
          }
          const users = (extra.users ?? s.users).map((u) => (u.id === id ? { ...u, ...patch } : u));
          return {
            ...extra,
            users,
            notice: typeof patch.bodyweight === "number" ? "Poids mis à jour" : "Profil mis à jour",
          };
        });
      },
      changePassword: (current, next) => {
        const user = sessionUser(get());
        if (!user) return { ok: false, error: "Pas de session." };
        if (user.passwordHash !== hashPassword(current)) {
          return { ok: false, error: "Mot de passe actuel incorrect." };
        }
        if (next.length < 4) return { ok: false, error: "Nouveau mot de passe trop court." };
        set((s) => ({
          users: s.users.map((u) => (u.id === user.id ? { ...u, passwordHash: hashPassword(next) } : u)),
          notice: "Mot de passe mis à jour",
        }));
        return { ok: true };
      },
      addFriend: (pseudo) => {
        const id = get().sessionUserId;
        if (!id) return { ok: false, error: "Pas de session." };
        const p = pseudo.trim().toLowerCase();
        const other = get().users.find((u) => u.pseudo.toLowerCase() === p && !u.isNpc);
        if (!other) return { ok: false, error: "Aucun compte avec ce pseudo." };
        if (other.id === id) return { ok: false, error: "C’est toi." };
        const cur = get().friendsByUser[id] ?? [];
        if (cur.includes(other.id)) return { ok: false, error: "Déjà dans tes amis." };
        set((s) => ({
          friendsByUser: { ...s.friendsByUser, [id]: [...(s.friendsByUser[id] ?? []), other.id] },
        }));
        return { ok: true };
      },
      removeFriend: (fid) => {
        const id = get().sessionUserId;
        if (!id) return;
        set((s) => ({
          friendsByUser: {
            ...s.friendsByUser,
            [id]: (s.friendsByUser[id] ?? []).filter((x) => x !== fid),
          },
        }));
      },
      createProgram: (name, from) => {
        const userId = get().sessionUserId;
        if (!userId) return "";
        const id = uid();
        const program: Program = {
          id,
          name: name.trim() || "Sans nom",
          description: from?.description,
          ownerId: userId,
          builtin: false,
          exercises: from ? from.exercises.map((e) => ({ ...e })) : [],
        };
        set((s) => ({ programs: [...s.programs, program] }));
        return id;
      },
      createOfficialProgram: (name, description) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return "";
        const id = uid();
        const program: Program = {
          id,
          name: name.trim() || "Sans nom",
          description: description?.trim() || "",
          ownerId: null,
          builtin: true,
          exercises: [],
        };
        set((s) => ({ programs: [...s.programs, program] }));
        return id;
      },
      updateProgram: (id, patch) => {
        set((s) => {
          if (!canMutateProgram(s, id)) return s;
          return { programs: s.programs.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
        });
      },
      deleteProgram: (id) => {
        set((s) => {
          const p = s.programs.find((x) => x.id === id);
          if (!p) return s;
          const user = sessionUser(s);
          if (!user) return s;
          if (p.builtin && !user.isAdmin) return s;
          if (!p.builtin && p.ownerId !== user.id) return s;
          return { programs: s.programs.filter((x) => x.id !== id) };
        });
      },
      duplicateProgram: (id) => {
        const src = get().programs.find((p) => p.id === id);
        if (!src) return "";
        return get().createProgram(`${src.name} (copie)`, src);
      },
      addExerciseToProgram: (programId, exerciseId) => {
        set((s) => {
          const p = canMutateProgram(s, programId);
          if (!p) return s;
          if (p.exercises.some((e) => e.exerciseId === exerciseId)) return s;
          const ex = findExercise(exerciseId, poolFrom(s));
          const row: ProgramExercise = {
            exerciseId,
            sets: 3,
            reps: 8,
            restSeconds: ex?.defaultRest ?? 90,
            targetKg: null,
          };
          return {
            programs: s.programs.map((x) =>
              x.id === programId ? { ...x, exercises: [...x.exercises, row] } : x,
            ),
          };
        });
      },
      removeExerciseFromProgram: (programId, exerciseId) => {
        set((s) => {
          if (!canMutateProgram(s, programId)) return s;
          return {
            programs: s.programs.map((p) =>
              p.id === programId ? { ...p, exercises: p.exercises.filter((e) => e.exerciseId !== exerciseId) } : p,
            ),
          };
        });
      },
      moveProgramExercise: (programId, exerciseId, dir) => {
        set((s) => {
          const p = canMutateProgram(s, programId);
          if (!p) return s;
          const i = p.exercises.findIndex((e) => e.exerciseId === exerciseId);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= p.exercises.length) return s;
          const next = [...p.exercises];
          const tmp = next[i];
          next[i] = next[j];
          next[j] = tmp;
          return { programs: s.programs.map((x) => (x.id === programId ? { ...x, exercises: next } : x)) };
        });
      },
      addCustomExercise: (name, group) => {
        const id = `c_${uid()}`;
        const userId = get().sessionUserId ?? undefined;
        set((s) => ({
          customExercises: [
            ...s.customExercises,
            {
              id,
              name: name.trim(),
              group,
              primary: group,
              secondary: [],
              equipment: [],
              defaultRest: 90,
              instructions: "",
              difficulty: 2,
              elite1RM: 0,
              aliases: [],
              custom: true,
              official: false,
              classified: false,
              ownerId: userId,
            },
          ],
        }));
        return id;
      },
      deleteCustomExercise: (id) => {
        const user = sessionUser(get());
        if (!user) return;
        set((s) => ({
          customExercises: s.customExercises.filter((e) => !(e.id === id && e.ownerId === user.id)),
        }));
      },
      createOfficialExercise: (opts) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return { ok: false, error: "Admin seulement." };
        if (!opts.name.trim()) return { ok: false, error: "Nom requis." };
        if (opts.classified && (!(opts.refHomme! > 0) || !(opts.refFemme! > 0))) {
          return { ok: false, error: "Réf homme et femme obligatoires." };
        }
        const id = `ex_${uid()}`;
        const row: Exercise = {
          id,
          name: opts.name.trim(),
          group: opts.group,
          primary: opts.group,
          secondary: [],
          equipment: [],
          defaultRest: 90,
          instructions: "",
          difficulty: 2,
          elite1RM: 0,
          aliases: [],
          official: true,
          classified: opts.classified,
          refHomme: opts.classified ? opts.refHomme : undefined,
          refFemme: opts.classified ? opts.refFemme : undefined,
        };
        set((s) => ({ catalog: [...(s.catalog.length ? s.catalog : cloneCatalog()), row] }));
        return { ok: true, id };
      },
      updateOfficialExercise: (id, patch) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return { ok: false, error: "Admin seulement." };
        const s = get();
        const catalog = s.catalog.length ? s.catalog : cloneCatalog();
        const cur = catalog.find((e) => e.id === id);
        if (!cur || cur.custom) return { ok: false, error: "Exo introuvable." };
        const next: Exercise = { ...cur, ...patch };
        if (next.classified && (!(next.refHomme! > 0) || !(next.refFemme! > 0))) {
          return { ok: false, error: "Réf homme et femme obligatoires." };
        }
        const would = catalog.map((e) => (e.id === id ? next : e));
        if (classifiedCount(would) < 1) return { ok: false, error: "Il doit rester 1 exo classé." };
        set({ catalog: would });
        return { ok: true };
      },
      deleteOfficialExercise: (id) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return { ok: false, error: "Admin seulement." };
        const s = get();
        const catalog = s.catalog.length ? s.catalog : cloneCatalog();
        const would = catalog.filter((e) => e.id !== id);
        if (classifiedCount(would) < 1) return { ok: false, error: "Il doit rester 1 exo classé." };
        set({ catalog: would });
        return { ok: true };
      },
      startWorkout: (programId) => {
        const userId = get().sessionUserId;
        if (!userId) return "";
        const existing = get().workouts.find((w) => w.userId === userId && w.status === "in_progress");
        if (existing) return existing.id;
        const program = get().programs.find((p) => p.id === programId);
        if (!program) return "";
        const id = uid();
        const now = new Date();
        const workout: Workout = {
          id,
          userId,
          date: todayKey(now),
          startedAt: now.toISOString(),
          duration: 0,
          status: "in_progress",
          programId: program.id,
          programName: program.name,
        };
        const we: WorkoutExercise[] = program.exercises.map((e, order) => ({
          workoutId: id,
          exerciseId: e.exerciseId,
          order,
          plannedSets: e.sets,
          plannedReps: e.reps,
          restSeconds: e.restSeconds,
          targetKg: e.targetKg,
        }));
        set((s) => ({
          workouts: [...s.workouts, workout],
          workoutExercises: [...s.workoutExercises, ...we],
        }));
        return id;
      },
      addSet: ({ workoutId, exerciseId, weight, reps }) => {
        const s = get();
        const userId = s.sessionUserId;
        if (!userId) return;
        const planned = s.workoutExercises.find((w) => w.workoutId === workoutId && w.exerciseId === exerciseId);
        const existing = s.sets.filter((x) => x.workoutId === workoutId && x.exerciseId === exerciseId);
        const rest = planned?.restSeconds ?? findExercise(exerciseId, poolFrom(s))?.defaultRest ?? 90;
        const log: SetLog = {
          id: uid(),
          workoutId,
          exerciseId,
          setNumber: existing.length + 1,
          weight,
          reps,
          restSeconds: rest,
          completedAt: new Date().toISOString(),
        };
        set({
          sets: [...s.sets, log],
          restByUser: {
            ...s.restByUser,
            [userId]: rest > 0 ? { endsAt: Date.now() + rest * 1000, duration: rest, exerciseId } : null,
          },
        });
      },
      finishWorkout: (workoutId) => {
        const s = get();
        const workout = s.workouts.find((w) => w.id === workoutId);
        if (!workout) return;
        const duration = Math.max(60, Math.round((Date.now() - new Date(workout.startedAt).getTime()) / 1000));
        const userId = s.sessionUserId;
        const user = sessionUser(s);
        const before = user ? snap(s, user) : null;
        const workouts = s.workouts.map((w) =>
          w.id === workoutId
            ? { ...w, status: "completed" as const, finishedAt: new Date().toISOString(), duration }
            : w,
        );
        const restByUser = userId ? { ...s.restByUser, [userId]: null } : s.restByUser;
        const afterState = { ...s, workouts, restByUser };
        const events = user ? diffRankEvents(before!, snap(afterState, user)) : [];
        set({ workouts, restByUser, rankQueue: events.length ? [...s.rankQueue, ...events] : s.rankQueue });
      },
      abandonWorkout: (id) => {
        const userId = get().sessionUserId;
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === id ? { ...w, status: "abandoned" as const, finishedAt: new Date().toISOString() } : w,
          ),
          restByUser: userId ? { ...s.restByUser, [userId]: null } : s.restByUser,
        }));
      },
      skipRest: () => {
        const id = get().sessionUserId;
        if (!id) return;
        set((s) => ({ restByUser: { ...s.restByUser, [id]: null } }));
      },
      createPost: ({ title, body, tag }) => {
        const s = get();
        const user = sessionUser(s);
        if (!user?.isAdmin) return;
        const post: Post = {
          id: uid(),
          authorId: user.id,
          title: title.trim(),
          body: body.trim(),
          tag,
          createdAt: new Date().toISOString(),
        };
        set({ posts: [post, ...s.posts] });
      },
      updatePost: (id, patch) => {
        const s = get();
        const user = sessionUser(s);
        if (!user?.isAdmin) return;
        set({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
      },
      deletePost: (id) => {
        const s = get();
        const user = sessionUser(s);
        if (!user?.isAdmin) return;
        const likes = { ...s.likes };
        delete likes[id];
        set({ posts: s.posts.filter((p) => p.id !== id), likes });
      },
      toggleLike: (postId) => {
        const id = get().sessionUserId;
        if (!id) return;
        set((s) => {
          const cur = s.likes[postId] ?? [];
          const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
          return { likes: { ...s.likes, [postId]: next } };
        });
      },
      declarePerf: ({ exerciseId, weight, reps, date }) => {
        const s = get();
        const user = sessionUser(s);
        if (!user) return { ok: false, error: "Pas de session." };
        const pool = poolFrom(s);
        if (!isClassifiedLift(exerciseId, pool)) return { ok: false, error: "Cet exo n’est pas classé." };
        if (!(weight > 0) || reps < 1 || reps > 30) {
          return { ok: false, error: "Charge > 0 kg, reps 1–30." };
        }
        const day = date.slice(0, 10);
        const row: DeclaredPerf = {
          id: uid(),
          userId: user.id,
          exerciseId,
          weight,
          reps,
          date: day,
          updatedAt: new Date().toISOString(),
        };
        const next = s.declaredPerfs.filter(
          (d) => !(d.userId === user.id && d.exerciseId === exerciseId && d.date === day),
        );
        next.push(row);
        const afterState = { ...s, declaredPerfs: next };
        const events = diffRankEvents(snap(s, user), snap(afterState, user), exerciseId);
        const lift = liftRankFor(user, exerciseId, s.sets, s.workouts, next, pool);
        const name = findExercise(exerciseId, pool)?.name ?? "exo";
        set({
          declaredPerfs: next,
          rankQueue: events.length ? [...s.rankQueue, ...events] : s.rankQueue,
          notice: events.some((e) => e.kind === "exo") ? null : `Perf ${name} enregistrée · ${lift.label}`,
        });
        return { ok: true, label: lift.label };
      },
      upsertWeight: (kg, date) => {
        const user = sessionUser(get());
        if (!user) return { ok: false, error: "Pas de session." };
        if (!(kg >= 30) || kg > 250) return { ok: false, error: "Poids invalide." };
        const day = date.slice(0, 10);
        const rounded = Math.round(kg * 10) / 10;
        set((s) => ({
          ...applyBodyweight(s, user.id, rounded, day),
          notice: "Poids mis à jour",
        }));
        return { ok: true };
      },
      sendMessage: (text) => {
        const s = get();
        const user = sessionUser(s);
        if (!user) return { ok: false, error: "Pas de session." };
        const now = Date.now();
        const t = text.replace(/\s+/g, " ").trim();
        if (!t) return { ok: false, error: "Message vide." };
        if (t.length > 200) return { ok: false, error: "200 caractères max." };
        if (isHeld(s.chatClosedUntil, now)) return { ok: false, error: "Chat fermé par un modo." };
        if (isHeld(s.mutedUntil[user.id], now)) return { ok: false, error: "Tu es muet." };
        if ((s.floodUntil[user.id] ?? 0) > now) return { ok: false, error: "Ralentis." };
        const last = s.lastSentAt[user.id] ?? 0;
        if (last && now - last < 8000) {
          set({ floodUntil: { ...s.floodUntil, [user.id]: now + 60_000 } });
          return { ok: false, error: "Ralentis." };
        }
        if ((s.lastText[user.id] ?? "") === t) return { ok: false, error: "Pas le même message." };
        const msg: ChatMessage = {
          id: uid(),
          userId: user.id,
          text: t,
          createdAt: new Date().toISOString(),
        };
        set({
          messages: [...s.messages, msg],
          lastSentAt: { ...s.lastSentAt, [user.id]: now },
          lastText: { ...s.lastText, [user.id]: t },
        });
        return { ok: true };
      },
      deleteMessage: (id) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return;
        set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
      },
      muteUser: (userId, minutes) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return;
        if (userId === user.id || userId === ADMIN_ID) return;
        set((s) => ({ mutedUntil: { ...s.mutedUntil, [userId]: toHold(minutes) } }));
      },
      unmuteUser: (userId) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return;
        set((s) => {
          const mutedUntil = { ...s.mutedUntil };
          delete mutedUntil[userId];
          return { mutedUntil };
        });
      },
      closeChat: (minutes) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return;
        set({ chatClosedUntil: toHold(minutes) });
      },
      openChat: () => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return;
        set({ chatClosedUntil: null });
      },
      deleteAccount: (userId) => {
        const user = sessionUser(get());
        if (!user?.isAdmin) return { ok: false, error: "Admin seulement." };
        const target = get().users.find((u) => u.id === userId);
        if (!target) return { ok: false, error: "Compte introuvable." };
        if (target.isAdmin || target.id === user.id || target.pseudo === "admin") {
          return { ok: false, error: "Impossible de supprimer l’admin." };
        }
        set((s) => ({ ...purgeUserFrom(s, userId), notice: `@${target.pseudo} supprimé` }));
        return { ok: true };
      },
      dismissNotice: () => set({ notice: null }),
      shiftRankEvent: () => set((s) => ({ rankQueue: s.rankQueue.slice(1) })),
    }),
    {
      name: "orbit-v7",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return localStorage;
      }),
      skipHydration: true,
      partialize: (s) => ({
        users: s.users,
        sessionUserId: s.sessionUserId,
        workouts: s.workouts,
        sets: s.sets,
        workoutExercises: s.workoutExercises,
        programs: s.programs,
        customExercises: s.customExercises,
        posts: s.posts,
        likes: s.likes,
        friendsByUser: s.friendsByUser,
        restByUser: s.restByUser,
        declaredPerfs: s.declaredPerfs,
        weightLogs: s.weightLogs,
        catalog: s.catalog,
        messages: s.messages,
        mutedUntil: s.mutedUntil,
        chatClosedUntil: s.chatClosedUntil,
        lastSentAt: s.lastSentAt,
        lastText: s.lastText,
        floodUntil: s.floodUntil,
      }),
    },
  ),
);

export function useSessionUser(): User | null {
  return useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc) ?? null);
}

export function usePool(): Exercise[] {
  const catalog = useOrbitStore((s) => s.catalog);
  const custom = useOrbitStore((s) => s.customExercises);
  return poolFrom({ catalog, customExercises: custom });
}

export { lastSetForExercise };
