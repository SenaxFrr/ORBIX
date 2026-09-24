import { onValue, ref, set } from "firebase/database";
import { toast } from "sonner";
import { rtdb } from "@/lib/firebase";
import { useOrbitStore } from "./store";

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
  "declaredPerfs",
  "weightLogs",
  "catalog",
  "messages",
  "mutedUntil",
  "chatClosedUntil",
] as const;

function pickShared(s: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of SHARED) {
    if (k === "chatClosedUntil") out[k] = s[k] ?? 0;
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
          if (k === "chatClosedUntil") patch[k] = remote[k] ?? 0;
          else if (remote[k] != null) patch[k] = remote[k];
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
