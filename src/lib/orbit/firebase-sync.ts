import { onValue, ref, set } from "firebase/database";
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

type SharedKey = (typeof SHARED)[number];

function pickShared(s: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of SHARED) out[k] = s[k] ?? null;
  return out;
}

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function startOrbitFirebaseSync() {
  const worldRef = ref(rtdb, WORLD_PATH);
  let applyingRemote = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const unsubRemote = onValue(
    worldRef,
    (snap) => {
      const remote = snap.val() as Record<string, unknown> | null;
      applyingRemote = true;
      if (remote && typeof remote === "object") {
        const patch: Record<string, unknown> = {};
        for (const k of SHARED) {
          if (remote[k] != null) patch[k] = remote[k];
        }
        useOrbitStore.setState(patch as never);
        useOrbitStore.getState().ensureSeed();
      } else {
        const world = pickShared(useOrbitStore.getState() as unknown as Record<string, unknown>);
        void set(worldRef, stripUndefined(world));
      }
      ready = true;
      applyingRemote = false;
    },
    (err) => {
      console.error("[orbit] firebase sync", err);
      ready = true;
    },
  );

  const unsubStore = useOrbitStore.subscribe((state) => {
    if (!ready || applyingRemote) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const world = pickShared(state as unknown as Record<string, unknown>);
      void set(worldRef, stripUndefined(world)).catch((err) => {
        console.error("[orbit] firebase write", err);
      });
    }, 350);
  });

  return () => {
    unsubRemote();
    unsubStore();
    if (timer) clearTimeout(timer);
  };
}
