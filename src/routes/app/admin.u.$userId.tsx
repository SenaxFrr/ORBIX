import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/u/$userId")({ component: RedirectAdminUser });

function RedirectAdminUser() {
  const { userId } = Route.useParams();
  return <Navigate to="/admin/u/$userId" params={{ userId }} />;
}
