import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ExercisePicker } from "@/components/orbit/exercise-picker";
import { EmptyState } from "@/components/orbit/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATALOG_GROUPS, findExercise, GROUP_LABEL, poolFrom } from "@/lib/orbit/exercises";
import { formatDateLong, formatHold, formatRest, formatSeries, formatWeight } from "@/lib/orbit/format";
import { TAG_LABEL } from "@/lib/orbit/labels";
import type { Exercise, HoldUntil, MuscleGroup, Post, PostTag, Program } from "@/lib/orbit/types";
import { isHeld, useOrbitStore, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

const TAGS: (PostTag | null)[] = [null, "Annonce", "Programme", "Conseils", "Event"];

function AdminPage() {
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const [tab, setTab] = useState<"feed" | "programmes" | "exercices" | "comptes">("feed");

  useEffect(() => {
    if (!user.isAdmin) void navigate({ to: "/app/profil" });
  }, [user.isAdmin, navigate]);

  if (!user.isAdmin) return null;

  return (
    <main className="px-4 pb-36 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/profil" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-display text-2xl font-semibold">Admin</h1>
      </header>
      <div className="mb-4 mt-3 grid grid-cols-4 gap-1 rounded-xl bg-surface-2 p-1">
        <button
          className={cn("h-10 rounded-lg text-xs", tab === "feed" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("feed")}
        >
          Feed
        </button>
        <button
          className={cn("h-10 rounded-lg text-xs", tab === "programmes" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("programmes")}
        >
          Programmes
        </button>
        <button
          className={cn("h-10 rounded-lg text-xs", tab === "exercices" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("exercices")}
        >
          Exercices
        </button>
        <button
          className={cn("h-10 rounded-lg text-xs", tab === "comptes" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("comptes")}
        >
          Comptes
        </button>
      </div>
      {tab === "feed" ? (
        <AdminFeed />
      ) : tab === "programmes" ? (
        <AdminPrograms />
      ) : tab === "exercices" ? (
        <AdminExercises />
      ) : (
        <AdminUsers />
      )}
    </main>
  );
}

function AdminFeed() {
  const store = useOrbitStore();
  const posts = [...store.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const [compose, setCompose] = useState(false);
  const [edit, setEdit] = useState<Post | null>(null);
  const [del, setDel] = useState<Post | null>(null);

  return (
    <div>
      <Button className="w-full" onClick={() => setCompose(true)}>
        <Plus className="size-4" />
        Nouveau post
      </Button>
      {posts.length === 0 ? (
        <EmptyState title="Aucun post" body="Publie la première annonce du club." />
      ) : (
        <ul className="mt-3 space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  {p.tag ? (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                      {TAG_LABEL[p.tag]}
                    </span>
                  ) : null}
                  <h2 className="mt-1 font-medium">{p.title}</h2>
                  <p className="text-xs text-subtle">{formatDateLong(p.createdAt)}</p>
                </div>
                <div className="flex">
                  <button className="flex size-10 items-center justify-center text-muted" onClick={() => setEdit(p)} aria-label="Éditer">
                    <Pencil className="size-4" />
                  </button>
                  <button className="flex size-10 items-center justify-center text-danger" onClick={() => setDel(p)} aria-label="Supprimer">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-fg/90">{p.body}</p>
            </li>
          ))}
        </ul>
      )}
      {compose ? (
        <PostSheet
          title="Nouveau post"
          onClose={() => setCompose(false)}
          onSave={(d) => {
            store.createPost(d);
            setCompose(false);
          }}
        />
      ) : null}
      {edit ? (
        <PostSheet
          title="Éditer"
          initial={edit}
          onClose={() => setEdit(null)}
          onSave={(d) => {
            store.updatePost(edit.id, d);
            setEdit(null);
          }}
        />
      ) : null}
      {del ? (
        <Confirm
          title="Supprimer ce post ?"
          onCancel={() => setDel(null)}
          onOk={() => {
            store.deletePost(del.id);
            setDel(null);
          }}
        />
      ) : null}
    </div>
  );
}

function AdminPrograms() {
  const store = useOrbitStore();
  const builtins = store.programs.filter((p) => p.builtin);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [edit, setEdit] = useState<Program | null>(null);
  const [del, setDel] = useState<Program | null>(null);

  return (
    <div>
      <Button className="w-full" onClick={() => setCreate(true)}>
        <Plus className="size-4" />
        Nouveau programme officiel
      </Button>
      <ul className="mt-3 space-y-2">
        {builtins.map((p) => (
          <li key={p.id} className="glass rounded-2xl px-3 py-3">
            <div className="flex items-start justify-between gap-2">
              <button className="min-w-0 flex-1 text-left" onClick={() => setEdit(p)}>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.exercises.length} mouvement{p.exercises.length > 1 ? "s" : ""}
                  {p.description ? ` · ${p.description}` : ""}
                </p>
              </button>
              <button className="flex size-10 items-center justify-center text-danger" onClick={() => setDel(p)} aria-label="Supprimer">
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {create ? (
        <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
          <div className="glass-strong w-full rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Programme officiel</h2>
            <Input className="mt-3" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              className="mt-2"
              placeholder="Description courte"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCreate(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1"
                disabled={!name.trim()}
                onClick={() => {
                  const id = store.createOfficialProgram(name.trim(), desc.trim());
                  setCreate(false);
                  setName("");
                  setDesc("");
                  const p = useOrbitStore.getState().programs.find((x) => x.id === id);
                  if (p) setEdit(p);
                }}
              >
                Créer
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {edit ? (
        <OfficialEditor
          programId={edit.id}
          onClose={() => {
            setEdit(null);
          }}
        />
      ) : null}

      {del ? (
        <Confirm
          title={`Supprimer « ${del.name} » ?`}
          onCancel={() => setDel(null)}
          onOk={() => {
            store.deleteProgram(del.id);
            setDel(null);
          }}
        />
      ) : null}
    </div>
  );
}

function OfficialEditor({ programId, onClose }: { programId: string; onClose: () => void }) {
  const store = useOrbitStore();
  const program = store.programs.find((p) => p.id === programId);
  const [pick, setPick] = useState(false);
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-bg px-4 pb-10 pt-[calc(env(safe-area-inset-top)+8px)]">
      <div className="mx-auto max-w-lg">
        <header className="flex items-center gap-2">
          <button className="flex size-11 items-center justify-center rounded-lg" onClick={onClose} aria-label="Fermer">
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="font-display text-xl font-semibold">Éditer</h2>
        </header>
        <Input
          className="mt-3"
          defaultValue={program.name}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v) store.updateProgram(program.id, { name: v });
          }}
        />
        <Textarea
          className="mt-2"
          defaultValue={program.description ?? ""}
          placeholder="Description courte"
          onBlur={(e) => store.updateProgram(program.id, { description: e.target.value.trim() })}
        />
        <ul className="mt-4 space-y-2">
          {program.exercises.map((row, i) => {
            const ex = findExercise(row.exerciseId, poolFrom(store));
            return (
              <li key={row.exerciseId} className="glass rounded-2xl px-3 py-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{ex?.name ?? row.exerciseId}</p>
                    <p className="text-xs text-muted">
                      {formatSeries(row.sets)} · {row.reps} reps · repos {formatRest(row.restSeconds)}
                      {row.targetKg ? ` · ${formatWeight(row.targetKg)}` : ""}
                    </p>
                  </div>
                  <button className="flex size-10 items-center justify-center text-muted" onClick={() => store.moveProgramExercise(program.id, row.exerciseId, -1)} disabled={i === 0} aria-label="Monter">
                    <ChevronUp className="size-4" />
                  </button>
                  <button className="flex size-10 items-center justify-center text-muted" onClick={() => store.moveProgramExercise(program.id, row.exerciseId, 1)} disabled={i === program.exercises.length - 1} aria-label="Descendre">
                    <ChevronDown className="size-4" />
                  </button>
                  <button className="flex size-10 items-center justify-center text-danger" onClick={() => store.removeExerciseFromProgram(program.id, row.exerciseId)} aria-label="Retirer">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  <Num label="Séries" value={row.sets} onChange={(n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => (e.exerciseId === row.exerciseId ? { ...e, sets: n } : e)) })} />
                  <Num label="Reps" value={row.reps} onChange={(n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => (e.exerciseId === row.exerciseId ? { ...e, reps: n } : e)) })} />
                  <Num label="Repos s" value={row.restSeconds} onChange={(n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => (e.exerciseId === row.exerciseId ? { ...e, restSeconds: n } : e)) })} />
                  <Num label="kg" value={row.targetKg ?? 0} onChange={(n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => (e.exerciseId === row.exerciseId ? { ...e, targetKg: n || null } : e)) })} />
                </div>
              </li>
            );
          })}
        </ul>
        <Button variant="secondary" className="mt-3 w-full" onClick={() => setPick(true)}>
          <Plus className="size-4" />
          Ajouter un exo
        </Button>
        <Button className="mt-3 w-full" onClick={onClose}>
          Fermer
        </Button>
      </div>
      {pick ? (
        <ExercisePicker
          exclude={program.exercises.map((e) => e.exerciseId)}
          onClose={() => setPick(false)}
          onPick={(id) => {
            store.addExerciseToProgram(program.id, id);
            setPick(false);
          }}
        />
      ) : null}
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase text-muted">{label}</span>
      <Input
        className="mt-0.5 h-10 px-2 text-center"
        inputMode="decimal"
        defaultValue={value}
        onBlur={(e) => onChange(Number(String(e.target.value).replace(",", ".")) || 0)}
      />
    </label>
  );
}

function PostSheet({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial?: Post;
  onClose: () => void;
  onSave: (d: { title: string; body: string; tag: PostTag | null }) => void;
}) {
  const [t, setT] = useState(initial?.title ?? "");
  const [b, setB] = useState(initial?.body ?? "");
  const [tag, setTag] = useState<PostTag | null>(initial?.tag ?? "Annonce");
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
      <div className="glass-strong max-h-[86dvh] w-full overflow-y-auto rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <div className="mt-4 grid gap-3">
          <div>
            <Label>Titre</Label>
            <Input className="mt-1" value={t} onChange={(e) => setT(e.target.value)} />
          </div>
          <div>
            <Label>Texte</Label>
            <Textarea className="mt-1" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1">
            {TAGS.map((x) => (
              <button
                key={x ?? "none"}
                onClick={() => setTag(x)}
                className={cn(
                  "h-9 rounded-full px-3 text-sm",
                  tag === x ? "bg-accent text-accent-fg" : "bg-surface-2",
                )}
              >
                {x ?? "Sans tag"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button className="flex-1" disabled={!t.trim() || !b.trim()} onClick={() => onSave({ title: t, body: b, tag })}>
            Publier
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminExercises() {
  const store = useOrbitStore();
  const catalog = store.catalog;
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<Exercise | null>(null);
  const [del, setDel] = useState<Exercise | null>(null);
  const [err, setErr] = useState("");

  return (
    <div>
      <Button className="w-full" onClick={() => setCreate(true)}>
        <Plus className="size-4" />
        Nouvel exo
      </Button>
      {err ? <p className="mt-2 text-xs text-danger">{err}</p> : null}
      <ul className="mt-3 space-y-2">
        {catalog.map((e) => (
          <li key={e.id} className="glass rounded-2xl px-3 py-3">
            <div className="flex items-start justify-between gap-2">
              <button className="min-w-0 flex-1 text-left" onClick={() => setEdit(e)}>
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted">
                  {GROUP_LABEL[e.group]}
                  {e.classified ? ` · classé · H ${e.refHomme} / F ${e.refFemme} kg` : " · Non classé"}
                </p>
              </button>
              <button
                className="flex size-10 items-center justify-center text-danger"
                onClick={() => setDel(e)}
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {create ? (
        <ExoSheet
          title="Nouvel exo"
          onClose={() => setCreate(false)}
          onSave={(d) => {
            const r = store.createOfficialExercise(d);
            if (!r.ok) setErr(r.error);
            else {
              setErr("");
              setCreate(false);
            }
          }}
        />
      ) : null}
      {edit ? (
        <ExoSheet
          title="Éditer"
          initial={edit}
          onClose={() => setEdit(null)}
          onSave={(d) => {
            const r = store.updateOfficialExercise(edit.id, d);
            if (!r.ok) setErr(r.error);
            else {
              setErr("");
              setEdit(null);
            }
          }}
        />
      ) : null}
      {del ? (
        <Confirm
          title={`Supprimer « ${del.name} » ?`}
          onCancel={() => setDel(null)}
          onOk={() => {
            const r = store.deleteOfficialExercise(del.id);
            if (!r.ok) setErr(r.error);
            setDel(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ExoSheet({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial?: Exercise;
  onClose: () => void;
  onSave: (d: {
    name: string;
    group: MuscleGroup;
    classified: boolean;
    refHomme?: number;
    refFemme?: number;
  }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState<MuscleGroup>(initial?.group ?? "pectoraux");
  const [classified, setClassified] = useState(!!initial?.classified);
  const [rh, setRh] = useState(initial?.refHomme ? String(initial.refHomme) : "");
  const [rf, setRf] = useState(initial?.refFemme ? String(initial.refFemme) : "");
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8">
      <div className="glass-strong max-h-[86dvh] w-full overflow-y-auto rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <Label className="mt-3">Nom</Label>
        <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="mt-3 text-[10px] uppercase text-muted">Groupe</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {CATALOG_GROUPS.map((x) => (
            <button
              key={x.id}
              onClick={() => setGroup(x.match[0])}
              className={cn(
                "h-9 rounded-full px-3 text-sm",
                group === x.match[0] ? "bg-accent text-accent-fg" : "bg-surface-2",
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
        <button
          className={cn(
            "mt-3 h-10 w-full rounded-lg text-sm",
            classified ? "bg-accent text-accent-fg" : "bg-surface-2",
          )}
          onClick={() => setClassified((v) => !v)}
        >
          {classified ? "Classé" : "Non classé"}
        </button>
        {classified ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label>
              <span className="text-[10px] uppercase text-muted">Réf homme kg</span>
              <Input
                className="mt-0.5 h-10"
                inputMode="decimal"
                value={rh}
                onChange={(e) => setRh(e.target.value)}
              />
            </label>
            <label>
              <span className="text-[10px] uppercase text-muted">Réf femme kg</span>
              <Input
                className="mt-0.5 h-10"
                inputMode="decimal"
                value={rf}
                onChange={(e) => setRf(e.target.value)}
              />
            </label>
          </div>
        ) : null}
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button
            className="flex-1"
            disabled={!name.trim() || (classified && (!Number(rh.replace(",", ".")) || !Number(rf.replace(",", "."))))}
            onClick={() =>
              onSave({
                name: name.trim(),
                group,
                classified,
                refHomme: classified ? Number(rh.replace(",", ".")) : undefined,
                refFemme: classified ? Number(rf.replace(",", ".")) : undefined,
              })
            }
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

function Confirm({
  title,
  onCancel,
  onOk,
  ok = "Supprimer",
}: {
  title: string;
  onCancel: () => void;
  onOk: () => void;
  ok?: string;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="danger" className="flex-1" onClick={onOk}>
            {ok}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const store = useOrbitStore();
  const [now, setNow] = useState(Date.now());
  const [del, setDel] = useState<{ id: string; pseudo: string } | null>(null);
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, []);
  const members = store.users.filter((u) => !u.isNpc && !u.isAdmin);
  const closed = isHeld(store.chatClosedUntil, now);

  return (
    <div>
      <h2 className="text-sm font-medium">Chat</h2>
      <p className="mt-1 text-xs text-muted">
        {closed
          ? `Fermé · ${formatHold(store.chatClosedUntil as HoldUntil, now)}`
          : "Ouvert."}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {closed ? (
          <Button size="sm" variant="secondary" onClick={() => store.openChat()}>
            Réouvrir
          </Button>
        ) : (
          <>
            <Button size="sm" variant="secondary" onClick={() => store.closeChat(15)}>
              Fermer 15 min
            </Button>
            <Button size="sm" variant="secondary" onClick={() => store.closeChat(60)}>
              Fermer 1 h
            </Button>
            <Button size="sm" variant="secondary" onClick={() => store.closeChat("manual")}>
              Jusqu’à réouverture
            </Button>
          </>
        )}
      </div>

      <h2 className="mt-6 text-sm font-medium">Comptes</h2>
      {members.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Aucun membre inscrit.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {members.map((u) => {
            const muted = isHeld(store.mutedUntil[u.id], now);
            return (
              <li key={u.id} className="glass rounded-2xl px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">@{u.pseudo}</p>
                    <p className="text-xs text-muted">
                      {muted ? `Muet · ${formatHold(store.mutedUntil[u.id], now)}` : "Actif"}
                    </p>
                  </div>
                  <button
                    className="flex size-10 items-center justify-center text-danger"
                    onClick={() => setDel({ id: u.id, pseudo: u.pseudo })}
                    aria-label={`Supprimer ${u.pseudo}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Button size="sm" variant="secondary" onClick={() => store.muteUser(u.id, 15)}>
                    15 min
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => store.muteUser(u.id, 60)}>
                    1 h
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => store.muteUser(u.id, 1440)}>
                    24 h
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => store.muteUser(u.id, "manual")}>
                    Jusqu’à unmute
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => store.unmuteUser(u.id)}>
                    Unmute
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {del ? (
        <Confirm
          title={`Supprimer @${del.pseudo} ?`}
          ok="Supprimer"
          onCancel={() => setDel(null)}
          onOk={() => {
            store.deleteAccount(del.id);
            setDel(null);
          }}
        />
      ) : null}
    </div>
  );
}
