import { onValue, ref, set } from "firebase/database";
import { toast } from "sonner";
import { rtdb } from "@/lib/firebase";
import { isThemeId, isThemeMode } from "./theme";
import { normalizeClosed, normalizeDms, normalizeMuted, normalizeRequests, normalizeSupport, useOrbitStore } from "./store";
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
  "supportMessages",
  "mutedUntil",
  "chatClosedUntil",
] as const;

function cleanUsers(v: unknown): User[] | null {
  if (!Array.isArray(v)) return null;
  return v.map((raw) => {
    const u = { ...(raw as User) } as User & { glow?: unknown };
    const accent = isThemeId(u.themeAccent) ? u.themeAccent : isThemeId(u.theme) ? u.theme : undefined;
    if (accent) {
      u.themeAccent = accent;
      u.theme = accent;
    } else {
      delete u.theme;
      delete u.themeAccent;
    }
    if (!isThemeMode(u.themeMode)) delete u.themeMode;
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
    else if (k === "supportMessages") out[k] = normalizeSupport(s[k]);
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

let onlineSaid = false;
let offlineSaid = false;

function sayOnline() {
  offlineSaid = false;
  if (onlineSaid) return;
  onlineSaid = true;
  toast.message("En ligne", { className: "orbit-net" });
}

function sayOffline() {
  if (offlineSaid) return;
  offlineSaid = true;
  toast.message("Hors ligne", { className: "orbit-net" });
}

export function startOrbitFirebaseSync() {
  const worldRef = ref(rtdb, WORLD_PATH);
  let applyingRemote = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  void set(ref(rtdb, "orbit/ping"), { ok: true, at: Date.now() })
    .then(() => writeWorld())
    .then(() => sayOnline())
    .catch((err: { code?: string; message?: string }) => {
      console.error("[orbit] firebase write", err);
      sayOffline();
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
          } else if (k === "supportMessages") {
            patch[k] = normalizeSupport(remote[k]);
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
      sayOnline();
    },
    (err) => {
      console.error("[orbit] firebase listen", err);
      sayOffline();
      ready = true;
    },
  );

  const unsubStore = useOrbitStore.subscribe(() => {
    if (!ready || applyingRemote) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void writeWorld()
        .then(() => sayOnline())
        .catch((err) => {
          console.error("[orbit] firebase write", err);
          sayOffline();
        });
    }, 350);
  });

  return () => {
    unsubRemote();
    unsubStore();
    if (timer) clearTimeout(timer);
  };
}
