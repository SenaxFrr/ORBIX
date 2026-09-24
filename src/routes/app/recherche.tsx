import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useOrbitStore, useSessionUser } from "@/lib/orbit/store";

export const Route = createFileRoute("/app/recherche")({ component: RecherchePage });

function RecherchePage() {
  const store = useOrbitStore();
  const me = useSessionUser();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const results = needle
    ? store.users
        .filter((u) => !u.isNpc && u.pseudo.toLowerCase().includes(needle))
        .sort((a, b) => a.pseudo.localeCompare(b.pseudo, "fr"))
    : [];

  return (
    <main className="px-4 pb-28">
      <h1 className="font-display text-2xl font-semibold">Rechercher</h1>
      <Input
        className="mt-4"
        placeholder="Pseudo"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Rechercher un pseudo"
      />
      {needle && results.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">Aucun profil.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {results.map((u) => (
            <li key={u.id}>
              <button
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left"
                onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: u.id } })}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold">
                  {(u.firstName || u.pseudo).slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">@{u.pseudo}</span>
                  {me?.id === u.id ? <span className="text-xs text-muted">C’est toi</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
