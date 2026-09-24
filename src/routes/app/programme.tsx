import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import { ResumeBanner } from "@/components/orbit/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrbitStore, useSessionUser } from "@/lib/orbit/store";

export const Route = createFileRoute("/app/programme")({ component: ProgrammeList });

function ProgrammeList() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  if (pathname !== "/app/programme") return <Outlet />;
  const builtins = store.programs.filter((p) => p.builtin);
  const mine = store.programs.filter((p) => p.ownerId === user.id && !p.builtin);
  const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");

  function open(id: string) {
    void navigate({ to: "/app/programme/$programId", params: { programId: id } });
  }

  return (
    <main className="px-4 pb-36">
      <div className="mb-3 flex items-end justify-between">
        <h1 className="font-display text-2xl font-semibold">Programme</h1>
        <Button size="sm" onClick={() => setCreate(true)}>
          <Plus className="size-4" />
          Nouveau
        </Button>
      </div>
      <ResumeBanner />

      {mine.length ? (
        <section className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Mes programmes</p>
          <ul className="space-y-2">
            {mine.map((p) => (
              <Card
                key={p.id}
                name={p.name}
                n={p.exercises.length}
                description={p.description}
                onClick={() => open(p.id)}
                onDup={() => {
                  const id = store.duplicateProgram(p.id);
                  if (id) open(id);
                }}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Officiels</p>
        <ul className="space-y-2">
          {builtins.map((p) => (
            <Card
              key={p.id}
              name={p.name}
              n={p.exercises.length}
              description={p.description}
              onClick={() => open(p.id)}
              onDup={() => {
                const id = store.duplicateProgram(p.id);
                if (id) open(id);
              }}
            />
          ))}
        </ul>
      </section>

      {create ? (
        <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
          <div className="glass-strong w-full rounded-2xl p-5">
            <h2 className="font-display text-xl font-semibold">Nouveau programme</h2>
            <Input
              className="mt-4"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCreate(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1"
                disabled={!name.trim()}
                onClick={() => {
                  const id = store.createProgram(name.trim());
                  setCreate(false);
                  setName("");
                  if (id) open(id);
                }}
              >
                Créer
              </Button>
            </div>
            {active ? <p className="mt-3 text-xs text-muted">Une séance est déjà en cours — tu pourras lancer après.</p> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Card({
  name,
  n,
  description,
  onClick,
  onDup,
}: {
  name: string;
  n: number;
  description?: string;
  onClick: () => void;
  onDup: () => void;
}) {
  return (
    <li className="glass flex items-center gap-1 rounded-2xl py-1 pl-1 pr-1">
      <button className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left" onClick={onClick}>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted">
          {n} mouvement{n > 1 ? "s" : ""}
          {description ? ` · ${description}` : ""}
        </p>
      </button>
      <button
        className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-lg text-muted"
        onClick={(e) => {
          e.stopPropagation();
          onDup();
        }}
        aria-label={`Dupliquer ${name}`}
      >
        <Copy className="pointer-events-none size-4" />
      </button>
    </li>
  );
}
