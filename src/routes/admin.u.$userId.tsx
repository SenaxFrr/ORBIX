import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { classifiedExercises, findExercise } from "@/lib/orbit/exercises";
import { formatClock, formatDate, formatLastSeen, formatSet, muteStatusLabel } from "@/lib/orbit/format";
import { GOAL_LABEL, LEVEL_LABEL, SEX_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit } from "@/lib/orbit/ranks";
import { ADMIN_ID } from "@/lib/orbit/seed";
import { THEME_SWATCHES } from "@/lib/orbit/theme";
import type { Goal, Level, Sex } from "@/lib/orbit/types";
import { conversationKey, useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/u/$userId")({ component: AdminUserPage });

function AdminUserPage() {
  const { userId } = Route.useParams();
  const me = useSessionUser();
  const store = useOrbitStore();
  const pool = usePool();
  const navigate = useNavigate();
  const user = store.users.find((u) => u.id === userId && !u.isNpc);
  const [now, setNow] = useState(Date.now());
  const [del, setDel] = useState(false);
  const [err, setErr] = useState("");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [exo, setExo] = useState("");
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [perfErr, setPerfErr] = useState("");
  const [thread, setThread] = useState<string | null>(null);
  const [delDm, setDelDm] = useState<string | null>(null);
  const [delSup, setDelSup] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyErr, setReplyErr] = useState("");

  useEffect(() => {
    if (me && !me.isAdmin) void navigate({ to: "/app/profil" });
  }, [me, navigate]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    setBio(user?.bio ?? "");
  }, [user?.bio, user?.id]);

  const supportUnread = (store.supportMessages ?? []).some((m) => m.fromId === userId && !(m.readAt > 0));
  useEffect(() => {
    if (me?.isAdmin && supportUnread) store.markSupportRead(userId);
  }, [me?.isAdmin, supportUnread, userId, store]);

  const classified = classifiedExercises(pool);
  const perfs = store.declaredPerfs
    .filter((d) => d.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const dms = useMemo(() => {
    const map = new Map<string, typeof store.dms>();
    for (const m of store.dms ?? []) {
      if (m.fromId !== userId && m.toId !== userId) continue;
      const other = m.fromId === userId ? m.toId : m.fromId;
      const arr = map.get(other) ?? [];
      arr.push(m);
      map.set(other, arr);
    }
    return [...map.entries()]
      .map(([other, msgs]) => ({
        other,
        msgs: [...msgs].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
      }))
      .sort((a, b) => +new Date(b.msgs[b.msgs.length - 1].createdAt) - +new Date(a.msgs[a.msgs.length - 1].createdAt));
  }, [store.dms, userId]);

  const support = (store.supportMessages ?? [])
    .filter((m) => m.fromId === userId || m.toId === userId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  if (!me?.isAdmin) return null;
  if (!user) {
    return (
      <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]">
        <p className="text-sm text-muted">Ce compte n’existe plus.</p>
        <Button className="mt-4" variant="secondary" onClick={() => void navigate({ to: "/admin" })}>
          Retour
        </Button>
      </main>
    );
  }

  const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
  const self = user.id === me.id;
  const principal = user.pseudo.toLowerCase() === "admin" || user.id === ADMIN_ID;
  const openThread = dms.find((t) => t.other === thread) ?? null;
  const name = (id: string) => store.users.find((u) => u.id === id)?.pseudo ?? "parti";

  function saveProfile(patch: Parameters<typeof store.adminUpdateUser>[1]) {
    const r = store.adminUpdateUser(user!.id, patch);
    setErr(r.ok ? "" : r.error);
  }

  return (
    <main className="px-4 pb-36 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/admin" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="min-w-0 truncate font-display text-2xl font-semibold">@{user.pseudo}</h1>
      </header>
      <p className="mt-3 font-mono text-lg">{formatLastSeen(user.lastSeenAt, now)}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-muted">{muteStatusLabel(store.mutedUntil[user.id], now)}</p>
          {user.isAdmin ? <p className="mt-1 text-xs text-accent">Admin</p> : null}
        </div>
        <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="lg" />
      </div>
      <p className="mt-3 text-sm">
        {SEX_LABEL[user.sex]} · {user.age} ans · {user.height} cm · {user.bodyweight} kg
      </p>
      <p className="mt-1 text-sm text-muted">
        {LEVEL_LABEL[user.level ?? "debutant"]} · {GOAL_LABEL[user.goal ?? "force"]}
      </p>

      {self ? null : (
        <div className="mt-4 flex flex-wrap gap-1">
          {user.id === ADMIN_ID ? null : (
            <>
              <Button size="sm" variant="secondary" onClick={() => store.muteUser(user.id, 15)}>
                Mute 15 min
              </Button>
              <Button size="sm" variant="secondary" onClick={() => store.muteUser(user.id, 60)}>
                1 h
              </Button>
              <Button size="sm" variant="secondary" onClick={() => store.muteUser(user.id, 1440)}>
                24 h
              </Button>
              <Button size="sm" variant="secondary" onClick={() => store.muteUser(user.id, "manual")}>
                jusqu’à unmute
              </Button>
              <Button size="sm" variant="ghost" onClick={() => store.unmuteUser(user.id)}>
                Unmute
              </Button>
            </>
          )}
          {principal ? null : (
            <Button size="sm" variant="danger" onClick={() => setDel(true)}>
              Supprimer
            </Button>
          )}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-medium">Profil</h2>
        {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
        <div className="mt-3 grid gap-3">
          <div>
            <Label>Sexe</Label>
            <div className="mt-1 flex gap-1">
              {(Object.keys(SEX_LABEL) as Sex[]).map((sx) => (
                <button
                  key={sx}
                  onClick={() => saveProfile({ sex: sx })}
                  className={cn("h-10 flex-1 rounded-lg text-sm", user.sex === sx ? "bg-accent text-accent-fg" : "bg-surface-2")}
                >
                  {SEX_LABEL[sx]}
                </button>
              ))}
            </div>
          </div>
          <Field label={`Âge (${user.age} ans)`} defaultValue={String(user.age)} onSave={(v) => saveProfile({ age: Number(v) })} />
          <Field label={`Taille (${user.height} cm)`} defaultValue={String(user.height)} onSave={(v) => saveProfile({ height: Number(v) })} />
          <Field
            label={`Poids (${user.bodyweight} kg)`}
            defaultValue={String(user.bodyweight).replace(".", ",")}
            onSave={(v) => saveProfile({ bodyweight: Number(v.replace(",", ".")) })}
          />
          <div>
            <Label>Niveau</Label>
            <div className="mt-1 flex gap-1">
              {(Object.keys(LEVEL_LABEL) as Level[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => saveProfile({ level: lv })}
                  className={cn(
                    "h-10 flex-1 rounded-lg px-1 text-xs",
                    (user.level ?? "debutant") === lv ? "bg-accent text-accent-fg" : "bg-surface-2",
                  )}
                >
                  {LEVEL_LABEL[lv]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Objectif</Label>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => saveProfile({ goal: g })}
                  className={cn(
                    "h-10 rounded-lg text-sm",
                    (user.goal ?? "force") === g ? "bg-accent text-accent-fg" : "bg-surface-2",
                  )}
                >
                  {GOAL_LABEL[g]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea className="mt-1" maxLength={160} value={bio} onChange={(e) => setBio(e.target.value.slice(0, 160))} />
            <Button className="mt-2" size="sm" variant="secondary" onClick={() => saveProfile({ bio: bio.trim().slice(0, 160) })}>
              Enregistrer la bio
            </Button>
          </div>
          <div>
            <Label>Apparence</Label>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <button
                className={cn("h-10 text-sm", (user.themeMode ?? "sombre") === "sombre" ? "bg-accent text-accent-fg" : "bg-surface-2")}
                onClick={() => saveProfile({ themeMode: "sombre" })}
              >
                Sombre
              </button>
              <button
                className={cn("h-10 text-sm", user.themeMode === "clair" ? "bg-accent text-accent-fg" : "bg-surface-2")}
                onClick={() => saveProfile({ themeMode: "clair" })}
              >
                Clair
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEME_SWATCHES.map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => saveProfile({ themeAccent: sw.id, theme: sw.id })}
                  className={cn(
                    "flex h-10 items-center gap-2 bg-surface-2 px-3 text-sm",
                    (user.themeAccent ?? user.theme ?? "or") === sw.id && "shadow-[0_0_0_1px_var(--color-accent)]",
                  )}
                >
                  <span className="size-3 rounded-full" style={{ background: sw.hex }} />
                  {sw.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Perfs déclarées</h2>
        {perfs.length === 0 ? <p className="mt-2 text-sm text-muted">Aucune perf déclarée.</p> : null}
        <ul className="mt-3 space-y-2">
          {perfs.map((d) => (
            <PerfRow key={d.id} id={d.id} name={findExercise(d.exerciseId, pool)?.name ?? d.exerciseId} date={d.date} weight={d.weight} reps={d.reps} exerciseId={d.exerciseId} userId={user.id} />
          ))}
        </ul>
        <form
          className="mt-4 grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const r = store.adminUpsertDeclared({
              userId: user.id,
              exerciseId: exo,
              weight: Number(kg.replace(",", ".")),
              reps: Number(reps),
              date,
            });
            if (!r.ok) {
              setPerfErr(r.error);
              return;
            }
            setPerfErr("");
            setKg("");
            setReps("");
          }}
        >
          <Label>Ajouter</Label>
          <select
            className="h-11 rounded-lg bg-surface-2 px-3 text-sm"
            value={exo}
            onChange={(e) => setExo(e.target.value)}
          >
            <option value="">Exo classé</option>
            {classified.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <Input inputMode="decimal" placeholder="kg" value={kg} onChange={(e) => setKg(e.target.value)} aria-label="Kilogrammes" />
            <Input inputMode="numeric" placeholder="reps" value={reps} onChange={(e) => setReps(e.target.value)} aria-label="Reps" />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
          </div>
          {perfErr ? <p className="text-xs text-danger">{perfErr}</p> : null}
          <Button type="submit" variant="secondary" disabled={!exo}>
            Ajouter
          </Button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Messages privés</h2>
        {openThread ? (
          <div className="mt-3">
            <button className="text-sm text-muted" onClick={() => setThread(null)}>
              Retour
            </button>
            <p className="mt-2 text-sm font-medium">@{name(openThread.other)}</p>
            <ul className="mt-2 space-y-2">
              {openThread.msgs.map((m) => (
                <li key={m.id} className="rounded-xl bg-surface px-3 py-2">
                  <p className="text-xs text-muted">
                    @{name(m.fromId)} → @{name(m.toId)} · {formatClock(m.createdAt)}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.text}</p>
                  <button className="mt-1 text-[11px] text-danger" onClick={() => setDelDm(m.id)}>
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : dms.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucun DM.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {dms.map((t) => (
              <li key={conversationKey(user.id, t.other)}>
                <button className="w-full rounded-xl bg-surface px-3 py-3 text-left" onClick={() => setThread(t.other)}>
                  <span className="block text-sm font-medium">@{name(t.other)}</span>
                  <span className="mt-1 block truncate text-xs text-muted">{t.msgs[t.msgs.length - 1].text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Support</h2>
        {support.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucun message.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {support.map((m) => (
              <li key={m.id} className="rounded-xl bg-surface px-3 py-2">
                <p className="text-xs text-muted">
                  @{name(m.fromId)} → @{name(m.toId)} · {formatClock(m.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.text}</p>
                <button className="mt-1 text-[11px] text-danger" onClick={() => setDelSup(m.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
        {self ? null : (
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const r = store.replySupport(user.id, reply);
              if (!r.ok) {
                setReplyErr(r.error);
                return;
              }
              setReply("");
              setReplyErr("");
            }}
          >
            <Input
              value={reply}
              maxLength={200}
              placeholder="Répondre"
              onChange={(e) => setReply(e.target.value.slice(0, 200))}
            />
            <Button type="submit" disabled={!reply.trim()}>
              Envoyer
            </Button>
          </form>
        )}
        {replyErr ? <p className="mt-1 text-xs text-danger">{replyErr}</p> : null}
      </section>

      {del ? (
        <Confirm
          title={`Supprimer @${user.pseudo} ?`}
          onCancel={() => setDel(false)}
          onOk={() => {
            store.deleteAccount(user.id);
            setDel(false);
            void navigate({ to: "/admin" });
          }}
        />
      ) : null}
      {delDm ? (
        <Confirm
          title="Supprimer ce message ?"
          onCancel={() => setDelDm(null)}
          onOk={() => {
            store.deleteDm(delDm);
            setDelDm(null);
          }}
        />
      ) : null}
      {delSup ? (
        <Confirm
          title="Supprimer ce message ?"
          onCancel={() => setDelSup(null)}
          onOk={() => {
            store.deleteSupport(delSup);
            setDelSup(null);
          }}
        />
      ) : null}
    </main>
  );
}

function Field({
  label,
  defaultValue,
  onSave,
}: {
  label: string;
  defaultValue: string;
  onSave: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" defaultValue={defaultValue} onBlur={(e) => onSave(e.target.value.trim())} />
    </div>
  );
}

function PerfRow({
  id,
  name,
  date,
  weight,
  reps,
  exerciseId,
  userId,
}: {
  id: string;
  name: string;
  date: string;
  weight: number;
  reps: number;
  exerciseId: string;
  userId: string;
}) {
  const store = useOrbitStore();
  const [kg, setKg] = useState(String(weight).replace(".", ","));
  const [rp, setRp] = useState(String(reps));
  const [err, setErr] = useState("");
  const [confirm, setConfirm] = useState(false);
  return (
    <li className="rounded-xl bg-surface px-3 py-3">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted">
        {formatDate(date)} · {formatSet(weight, reps)}
      </p>
      <div className="mt-2 flex gap-2">
        <Input inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} aria-label="Kilogrammes" />
        <Input inputMode="numeric" value={rp} onChange={(e) => setRp(e.target.value)} aria-label="Reps" />
      </div>
      {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const r = store.adminUpsertDeclared({
              userId,
              exerciseId,
              weight: Number(kg.replace(",", ".")),
              reps: Number(rp),
              date,
            });
            setErr(r.ok ? "" : r.error);
          }}
        >
          Corriger
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirm(true)}>
          Supprimer
        </Button>
      </div>
      {confirm ? (
        <Confirm
          title="Supprimer cette perf ?"
          onCancel={() => setConfirm(false)}
          onOk={() => {
            store.adminDeleteDeclared(id);
            setConfirm(false);
          }}
        />
      ) : null}
    </li>
  );
}

function Confirm({ title, onCancel, onOk }: { title: string; onCancel: () => void; onOk: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="danger" className="flex-1" onClick={onOk}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
