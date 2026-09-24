import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExercisePicker } from "@/components/orbit/exercise-picker";
import { EmptyState } from "@/components/orbit/empty-state";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATALOG_GROUPS, findExercise, GROUP_LABEL, poolFrom } from "@/lib/orbit/exercises";
import { formatDateLong, formatClock, formatRest, formatSeries, formatWeight } from "@/lib/orbit/format";
import { TAG_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit } from "@/lib/orbit/ranks";
import type { Exercise, MuscleGroup, Post, PostTag, Program } from "@/lib/orbit/types";
import { isStaffAccount, useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

const TAGS: (PostTag | null)[] = [null, "Annonce", "Programme", "Conseils", "Event"];

function AdminPage() {
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const [tab, setTab] = useState<"feed" | "programmes" | "exercices" | "membres">("feed");

  useEffect(() => {
    if (!user.isAdmin) void navigate({ to: "/app/profil" });
  }, [user.isAdmin, navigate]);

  if (!user.isAdmin) return null;
  if (pathname !== "/app/admin") return <Outlet />;

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
      <div className="mb-4 mt-3 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1">
        <button
          className={cn("h-10 shrink-0 rounded-lg px-3 text-xs", tab === "feed" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("feed")}
        >
          Feed
        </button>
        <button
          className={cn("h-10 shrink-0 rounded-lg px-3 text-xs", tab === "programmes" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("programmes")}
        >
          Programmes
        </button>
        <button
          className={cn("h-10 shrink-0 rounded-lg px-3 text-xs", tab === "exercices" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("exercices")}
        >
          Exercices
        </button>
        <button
          className={cn("h-10 shrink-0 rounded-lg px-3 text-xs", tab === "membres" ? "bg-accent text-accent-fg" : "text-muted")}
          onClick={() => setTab("membres")}
        >
          Membres
        </button>
      </div>
      {tab === "feed" ? (
        <AdminFeed />
      ) : tab === "programmes" ? (
        <AdminPrograms />
      ) : tab === "exercices" ? (
        <AdminExercises />
      ) : (
        <AdminMembers />
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

function AdminMembers() {
  const store = useOrbitStore();
  const pool = usePool();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const all = store.users.filter((u) => !u.isNpc);
  const needle = q.trim().toLowerCase();
  const members = all
    .filter((u) => !needle || u.pseudo.toLowerCase().includes(needle))
    .sort((a, b) => a.pseudo.localeCompare(b.pseudo, "fr"));

  return (
    <div>
      <SupportInbox />
      <Input
        className="mt-4"
        placeholder="Rechercher un pseudo"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {members.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Aucun membre.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {members.map((u) => {
            const orbit = computeGlobalOrbit(u, store.sets, store.workouts, store.declaredPerfs, pool);
            return (
              <li key={u.id}>
                <button
                  className="glass flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left"
                  onClick={() => void navigate({ to: "/app/admin/u/$userId", params: { userId: u.id } })}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium">@{u.pseudo}</span>
                    {u.isAdmin ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent">Admin</span>
                    ) : null}
                  </span>
                  <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="sm" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SupportInbox() {
  const store = useOrbitStore();
  const me = useSessionUser()!;
  const [open, setOpen] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [del, setDel] = useState<string | null>(null);
  const threads = useMemo(() => {
    const map = new Map<string, { unread: number; last: string; at: string }>();
    for (const m of store.supportMessages ?? []) {
      const from = store.users.find((u) => u.id === m.fromId);
      const to = store.users.find((u) => u.id === m.toId);
      const owner = from && !isStaffAccount(from) ? from.id : to && !isStaffAccount(to) ? to.id : null;
      if (!owner) continue;
      const cur = map.get(owner);
      const unread = m.toId === me.id || (isStaffAccount({ isAdmin: true, pseudo: "admin" }) && !(m.readAt > 0) && m.fromId === owner) ? (m.readAt > 0 ? 0 : 1) : 0;
      if (!cur || m.createdAt > cur.at) map.set(owner, { unread: (cur?.unread ?? 0) + unread, last: m.text, at: m.createdAt });
      else map.set(owner, { ...cur, unread: cur.unread + unread });
    }
    return [...map.entries()].sort((a, b) => b[1].at.localeCompare(a[1].at));
  }, [store.supportMessages, store.users, me.id]);
  const n = threads.reduce((a, [, t]) => a + t.unread, 0) || threads.length;
  const msgs = open
    ? (store.supportMessages ?? [])
        .filter((m) => m.fromId === open || m.toId === open)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    : [];
  const unreadOpen = msgs.filter((m) => m.fromId === open && !(m.readAt > 0)).length;

  useEffect(() => {
    if (open && unreadOpen) store.markSupportRead(open);
  }, [open, unreadOpen, store]);

  const pseudo = (id: string) => store.users.find((u) => u.id === id)?.pseudo ?? "parti";

  if (open) {
    return (
      <div className="rounded-2xl bg-surface px-3 py-3">
        <button className="text-sm text-muted" onClick={() => setOpen(null)}>
          Retour
        </button>
        <p className="mt-2 text-sm font-medium">@{pseudo(open)}</p>
        <ul className="mt-2 space-y-2">
          {msgs.map((m) => (
            <li key={m.id}>
              <p className="text-xs text-muted">
                @{pseudo(m.fromId)} · {formatClock(m.createdAt)}
              </p>
              <p className="text-sm">{m.text}</p>
              <button className="text-[11px] text-danger" onClick={() => setDel(m.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const r = store.replySupport(open, text);
            if (!r.ok) {
              setErr(r.error);
              return;
            }
            setText("");
            setErr("");
          }}
        >
          <Input value={text} maxLength={200} placeholder="Répondre" onChange={(e) => setText(e.target.value.slice(0, 200))} />
          <Button type="submit" disabled={!text.trim()}>
            Envoyer
          </Button>
        </form>
        {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
        {del ? (
          <Confirm
            title="Supprimer ce message ?"
            onCancel={() => setDel(null)}
            onOk={() => {
              store.deleteSupport(del);
              setDel(null);
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-medium">Messages support ({n})</h2>
      {threads.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Aucun message.</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {threads.map(([id, t]) => (
            <li key={id}>
              <button className="w-full rounded-xl bg-surface px-3 py-2 text-left" onClick={() => setOpen(id)}>
                <span className={cn("text-sm", t.unread ? "font-semibold" : "font-medium")}>@{pseudo(id)}</span>
                <span className="mt-0.5 block truncate text-xs text-muted">{t.last}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
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
