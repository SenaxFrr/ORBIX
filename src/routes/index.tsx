import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SplashMark } from "@/components/orbit/provider";
import { useOrbitStore } from "@/lib/orbit/store";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const hydrated = useOrbitStore((s) => s.hydrated);
  const session = useOrbitStore((s) => s.sessionUserId);
  const user = useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc));
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!session || !user) void navigate({ to: "/connexion" });
    else void navigate({ to: "/app/feed" });
  }, [hydrated, session, user, navigate]);

  return <SplashMark />;
}
