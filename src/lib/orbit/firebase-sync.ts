import { onValue, ref, set } from "firebase/database";
import { toast } from "sonner";
import { rtdb } from "@/lib/firebase";
import { isThemeId } from "./theme";
import { normalizeClosed, normalizeDms, normalizeMuted, normalizeRequests, useOrbitStore } from "./store";
import type { User } from "./types";

const WORLD_PATH = "orbit/world";

const SHARED = [
  "users",
  "workouts",
  "sets",
  "workoutExercises",
  "programs",
  "customExercises",
  "posts",
  "likes",
  "friendsByUser",
  "friendRequests",
  "declaredPerfs",
  "weightLogs",
  "catalog",
  "messages",
  "dms",
  "mutedUntil",
  "chatClosedUntil",
] as const;

function cleanUsers(v: unknown): User[] | null {
  if (!Array.isArray(v)) return null;
  return v.map((raw) => {
    const u = { ...(raw as User) } as User & { glow?: unknown };
    if (!isThemeId(u.theme)) delete u.theme;
    delete u.glow;
    if (typeof u.bio !== "string") delete u.bio;
    else u.bio = u.bio.slice(0, 160);
    return u;
  });
}

function pickShared(s: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of SHARED) {
    if (k === "chatClosedUntil") out[k] = normalizeClosed(s[k]);
    else if (k === "mutedUntil") out[k] = normalizeMuted(s[k]);
    else if (k === "friendRequests") out[k] = normalizeRequests(s[k]);
    else if (k === "dms") out[k] = normalizeDms(s[k]);
    else if (k === "users") out[k] = cleanUsers(s[k]) ?? [];
    else out[k] = s[k] ?? null;
  }
  return out;
}

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function writeWorld() {
  const world = pickShared(useOrbitStore.getState() as unknown as Record<string, unknown>);
  return set(ref(rtdb, WORLD_PATH), stripUndefined(world));
}

export function startOrbitFirebaseSync() {
  const worldRef = ref(rtdb, WORLD_PATH);
  let applyingRemote = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  void set(ref(rtdb, "orbit/ping"), { ok: true, at: Date.now() })
    .then(() => writeWorld())
    .catch((err: { code?: string; message?: string }) => {
      console.error("[orbit] firebase write", err);
      toast.error(err?.code || err?.message || "Écriture Firebase refusée");
    });

  const unsubRemote = onValue(
    worldRef,
    (snap) => {
      const remote = snap.val() as Record<string, unknown> | null;
      applyingRemote = true;
      if (remote && typeof remote === "object") {
        const patch: Record<string, unknown> = {};
        for (const k of SHARED) {
          if (k === "chatClosedUntil") patch[k] = normalizeClosed(remote[k]);
          else if (k === "mutedUntil") {
            if (remote[k] != null) patch[k] = normalizeMuted(remote[k]);
          } else if (k === "friendRequests") {
            patch[k] = Array.isArray(remote[k]) ? normalizeRequests(remote[k]) : [];
          } else if (k === "dms") {
            patch[k] = normalizeDms(remote[k]);
          } else if (k === "users") {
            const cleaned = cleanUsers(remote[k]);
            if (cleaned) patch[k] = cleaned;
          } else if (remote[k] != null) patch[k] = remote[k];
        }
        useOrbitStore.setState(patch as never);
        useOrbitStore.getState().ensureSeed();
      }
      ready = true;
      applyingRemote = false;
    },
    (err) => {
      console.error("[orbit] firebase listen", err);
      toast.error("Lecture Firebase refusée");
      ready = true;
    },
  );

  const unsubStore = useOrbitStore.subscribe(() => {
    if (!ready || applyingRemote) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void writeWorld().catch((err) => console.error("[orbit] firebase write", err));
    }, 350);
  });

  return () => {
    unsubRemote();
    unsubStore();
    if (timer) clearTimeout(timer);
  };
}
