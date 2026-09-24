import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppHeader } from "@/components/orbit/app-header";
import { BottomNav } from "@/components/orbit/bottom-nav";
import { SplashMark } from "@/components/orbit/provider";
import { useOrbitStore } from "@/lib/orbit/store";

export const Route = createFileRoute("/app")({ component: AppLayout });

function AppLayout() {
  const hydrated = useOrbitStore((s) => s.hydrated);
  const user = useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc));
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const live = pathname.startsWith("/app/seance");
  const nested =
    /^\/app\/(programme|perfs|suivi)\/.+/.test(pathname) ||
    pathname.startsWith("/app/profil") ||
    pathname.startsWith("/app/admin") ||
    pathname.startsWith("/app/u/") ||
    pathname.startsWith("/app/messages");
  const hideHeader =
    live || nested || pathname === "/app/feed";

  useEffect(() => {
    if (!hydrated) return;
    if (!user) void navigate({ to: "/connexion" });
  }, [hydrated, user, navigate]);

  if (!hydrated) return <SplashMark />;
  if (!user) return <SplashMark />;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg">
      {user.isAdmin ? (
        <div className="sticky top-0 z-40 flex justify-end border-b border-border bg-bg px-3 py-1">
          <button
            className="font-mono text-[10px] uppercase tracking-wider text-muted"
            onClick={() => void navigate({ to: "/admin" })}
          >
            Retour console
          </button>
        </div>
      ) : null}
      {hideHeader ? null : <AppHeader />}
      <Outlet />
      {live ? null : <BottomNav pathname={pathname} />}
    </div>
  );
}
