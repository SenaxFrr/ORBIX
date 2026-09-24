import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAge, formatBodyweight, formatFr, formatHeight } from "@/lib/orbit/format";
import { GOAL_LABEL, LEVEL_LABEL, SEX_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit, nextRankInfo } from "@/lib/orbit/ranks";
import type { Goal, Level, Sex } from "@/lib/orbit/types";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/profil")({ component: Profil });

function Profil() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const pool = usePool();
  const navigate = useNavigate();
  const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
  const progress = nextRankInfo(orbit.score, orbit.classified);
  const friendIds = store.friendsByUser[user.id] ?? [];
  const friends = friendIds.map((id) => store.users.find((u) => u.id === id)).filter(Boolean);
  const [pseudo, setPseudo] = useState("");
  const [err, setErr] = useState("");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();

  return (
    <main className="px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/feed" })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-display text-2xl font-semibold">Profil</h1>
      </header>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">@{user.pseudo}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="lg" />
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                user.isAdmin ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted",
              )}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </div>
      </div>

      {orbit.classified ? (
        <div className="mt-4">
          <p className="text-sm text-muted">Score {formatFr(orbit.score, 1)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-subtle">{progress.label}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-warn">{orbit.reason}</p>
      )}

      {user.isAdmin ? (
        <Button className="mt-4 w-full" onClick={() => void navigate({ to: "/app/admin" })}>
          <Shield className="size-4" />
          Admin
        </Button>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-medium">Identité</h2>
        <p className="text-xs text-muted">Le poids est suivi. Il n’entre plus dans les rangs.</p>
        <div className="mt-3 grid gap-3">
          <div>
            <Label>Prénom (optionnel)</Label>
            <Input
              className="mt-1"
              defaultValue={user.firstName ?? ""}
              onBlur={(e) => store.updateProfile({ firstName: e.target.value.trim() })}
            />
          </div>
          <div>
            <Label>Sexe</Label>
            <div className="mt-1 flex gap-1">
              {(Object.keys(SEX_LABEL) as Sex[]).map((sx) => (
                <button
                  key={sx}
                  onClick={() => store.updateProfile({ sex: sx })}
                  className={cn(
                    "h-10 flex-1 rounded-lg text-sm",
                    user.sex === sx ? "bg-accent text-accent-fg" : "bg-surface-2",
                  )}
                >
                  {SEX_LABEL[sx]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Âge ({formatAge(user.age)})</Label>
            <Input
              className="mt-1"
              inputMode="numeric"
              defaultValue={user.age}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (n >= 13 && n <= 80) store.updateProfile({ age: n });
              }}
            />
          </div>
          <div>
            <Label>Taille ({formatHeight(user.height)})</Label>
            <Input
              className="mt-1"
              inputMode="numeric"
              defaultValue={user.height}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (n >= 120) store.updateProfile({ height: n });
              }}
            />
          </div>
          <div>
            <Label>Poids actuel ({formatBodyweight(user.bodyweight)})</Label>
            <Input
              className="mt-1"
              inputMode="decimal"
              defaultValue={user.bodyweight}
              onBlur={(e) => {
                const n = Number(String(e.target.value).replace(",", "."));
                if (n >= 30) store.updateProfile({ bodyweight: Math.round(n * 10) / 10 });
              }}
            />
          </div>
          <div>
            <Label>Niveau</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {(Object.keys(LEVEL_LABEL) as Level[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => store.updateProfile({ level: lv })}
                  className={cn(
                    "h-10 flex-1 rounded-lg px-2 text-sm",
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
                  onClick={() => store.updateProfile({ goal: g })}
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
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Amis</h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const r = store.addFriend(pseudo);
            if (!r.ok) setErr(r.error);
            else {
              setErr("");
              setPseudo("");
            }
          }}
        >
          <Input placeholder="Pseudo exact" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          <Button type="submit">Ajouter</Button>
        </form>
        {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
        <ul className="mt-3 space-y-1">
          {friends.map((f) => {
            if (!f) return null;
            const fr = computeGlobalOrbit(f, store.sets, store.workouts, store.declaredPerfs, pool);
            return (
              <li key={f.id} className="flex h-12 items-center justify-between gap-2 rounded-xl bg-surface px-3">
                <span className="min-w-0 truncate text-sm">@{f.pseudo}</span>
                <RankBadge rank={fr.rank} division={fr.division} size="sm" />
                <button
                  className="flex size-10 items-center justify-center text-danger"
                  onClick={() => store.removeFriend(f.id)}
                  aria-label="Retirer"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
          {friends.length === 0 ? (
            <li className="text-sm text-muted">Personne pour l’instant. Ajoute un pseudo réel.</li>
          ) : null}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Compte</h2>
        <div className="mt-3 grid gap-2">
          <Label>Changer le mot de passe</Label>
          <Input
            type="password"
            placeholder="Actuel"
            value={curPw}
            onChange={(e) => setCurPw(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Nouveau"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
          {pwErr ? <p className="text-xs text-danger">{pwErr}</p> : null}
          <Button
            variant="secondary"
            onClick={() => {
              const r = store.changePassword(curPw, newPw);
              if (!r.ok) setPwErr(r.error);
              else {
                setPwErr("");
                setCurPw("");
                setNewPw("");
              }
            }}
          >
            Enregistrer le mot de passe
          </Button>
        </div>
      </section>

      <Button
        variant="ghost"
        className="mt-8 w-full"
        onClick={() => {
          store.logout();
          void navigate({ to: "/connexion" });
        }}
      >
        Déconnexion
      </Button>
    </main>
  );
}
