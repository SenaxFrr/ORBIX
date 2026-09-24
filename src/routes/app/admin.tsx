import { createFileRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin")({ component: RedirectAdmin });

function RedirectAdmin() {
  const pathname = useLocation({ select: (l) => l.pathname });
  if (pathname !== "/app/admin") return <Outlet />;
  return <Navigate to="/admin" />;
}
