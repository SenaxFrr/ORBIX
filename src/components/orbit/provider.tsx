import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { OrbitGlyph } from "./glyph";
import { RankStage } from "./rank-stage";
import { applyAccountTheme } from "@/lib/orbit/theme";
import { useOrbitStore, useSessionUser } from "@/lib/orbit/store";

export function OrbitProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useOrbitStore((s) => s.hydrated);
  const theme = useSessionUser()?.theme;
  const glow = useSessionUser()?.glow;
  const userId = useSessionUser()?.id;

  useEffect(() => {
    if (!hydrated) return;
    applyAccountTheme(theme, glow);
  }, [hydrated, theme, glow, userId]);

  useEffect(() => {
    const persist = useOrbitStore.persist;
    const finish = () => {
      useOrbitStore.getState().ensureSeed();
      useOrbitStore.getState().markHydrated();
    };
    const unsub = persist.onFinishHydration(finish);
    void persist.rehydrate();
    if (persist.hasHydrated()) finish();
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    let stop: undefined | (() => void);
    let alive = true;
    void import("@/lib/orbit/firebase-sync")
      .then((mod) => {
        if (!alive) return;
        stop = mod.startOrbitFirebaseSync();
        toast.message("Sync cloud activée");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Sync Firebase échouée");
      });
    return () => {
      alive = false;
      stop?.();
    };
  }, [hydrated]);

  const notice = useOrbitStore((s) => s.notice);
  useEffect(() => {
    if (!notice) return;
    toast.success(notice);
    useOrbitStore.getState().dismissNotice();
  }, [notice]);

  return (
    <div className="orbit-shell">
      <div className="orbit-wash" />
      <div className="relative z-10">{children}</div>
      <RankStage />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

export function SplashMark() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5">
      <div className="flex size-20 items-center justify-center rounded-full bg-surface text-accent shadow-[var(--shadow-glow)]">
        <OrbitGlyph size={56} />
      </div>
      <p className="font-display text-3xl font-semibold tracking-[0.28em]">ORBIT</p>
      <p className="text-sm text-muted">Force, rangs, séances.</p>
    </div>
  );
}
