import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allExercises, CATALOG_GROUPS, GROUP_LABEL, searchExercises } from "@/lib/orbit/exercises";
import type { MuscleGroup } from "@/lib/orbit/types";
import { useOrbitStore } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export function ExercisePicker({
  exclude,
  onClose,
  onPick,
}: {
  exclude: string[];
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const store = useOrbitStore();
  const [q, setQ] = useState("");
  const [g, setG] = useState<string>("all");
  const [custom, setCustom] = useState(false);
  const [cname, setCname] = useState("");
  const [cgroup, setCgroup] = useState<MuscleGroup>("pectoraux");
  const list = useMemo(() => {
    let pool = q
      ? searchExercises(q, store.catalog, store.customExercises)
      : allExercises(store.catalog, store.customExercises);
    if (g !== "all") {
      const grp = CATALOG_GROUPS.find((x) => x.id === g);
      if (grp) pool = pool.filter((e) => grp.match.includes(e.group));
    }
    return pool.filter((e) => !exclude.includes(e.id));
  }, [q, g, store.catalog, store.customExercises, exclude]);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-bg/70">
      <div className="glass-strong flex max-h-[88dvh] w-full flex-col rounded-t-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Ajouter un exo</h2>
          <button className="text-sm text-muted" onClick={onClose}>
            Fermer
          </button>
        </div>
        <Input className="mt-3" placeholder="Recherche" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          <Chip active={g === "all"} onClick={() => setG("all")}>
            Tous
          </Chip>
          {CATALOG_GROUPS.map((x) => (
            <Chip key={x.id} active={g === x.id} onClick={() => setG(x.id)}>
              {x.label}
            </Chip>
          ))}
        </div>
        <ul className="mt-2 flex-1 overflow-y-auto">
          {list.map((e) => (
            <li key={e.id}>
              <button
                className="flex h-12 w-full items-center justify-between border-b border-border text-left text-sm"
                onClick={() => onPick(e.id)}
              >
                <span>{e.name}</span>
                <span className="text-xs text-muted">{GROUP_LABEL[e.group]}</span>
              </button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="mt-2" onClick={() => setCustom(true)}>
          Créer un exo
        </Button>
        {custom ? (
          <div className="mt-3 grid gap-2">
            <Label>Nom</Label>
            <Input value={cname} onChange={(e) => setCname(e.target.value)} />
            <div className="flex flex-wrap gap-1">
              {CATALOG_GROUPS.map((x) => (
                <Chip key={x.id} active={cgroup === x.match[0]} onClick={() => setCgroup(x.match[0])}>
                  {x.label}
                </Chip>
              ))}
            </div>
            <Button
              disabled={!cname.trim()}
              onClick={() => {
                const id = store.addCustomExercise(cname.trim(), cgroup);
                onPick(id);
              }}
            >
              Ajouter
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-sm",
        active ? "bg-accent text-accent-fg" : "bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
