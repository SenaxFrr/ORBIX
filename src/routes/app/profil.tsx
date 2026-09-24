import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Shield } from "lucide-react";
import { useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { RankGateBanner } from "@/components/orbit/starter-lifts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatAge, formatBodyweight, formatFr, formatHeight } from "@/lib/orbit/format";
import { GOAL_LABEL, LEVEL_LABEL, SEX_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit, nextRankInfo } from "@/lib/orbit/ranks";
import { THEME_SWATCHES } from "@/lib/orbit/theme";
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
  const [delStep, setDelStep] = useState<0 | 1 | 2>(0);
  const [delPseudo, setDelPseudo] = useState("");
  const [delPw, setDelPw] = useState("");
  const [delErr, setDelErr] = useState("");
  const [dropId, setDropId] = useState<string | null>(null);
  const [bio, setBio] = useState(user.bio ?? "");
  const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
  const incoming = store.friendRequests.filter((r) => r.toId === user.id && r.status === "pending");
  const outgoing = store.friendRequests.filter((r) => r.fromId === user.id && r.status === "pending");
  const theme = user.theme ?? "or";
  const principal = user.pseudo.toLowerCase() === "admin";

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

      <Button
        variant="secondary"
        className="mt-4 w-full"
        onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: user.id } })}
      >
        Voir mon profil public
      </Button>

      {orbit.classified ? (
        <div className="mt-4">
          <p className="text-sm text-muted">Score {formatFr(orbit.score, 1)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-subtle">{progress.label}</p>
        </div>
      ) : (
        <RankGateBanner />
      )}

      {user.isAdmin ? (
        <Button className="mt-4 w-full" onClick={() => void navigate({ to: "/app/admin" })}>
          <Shield className="size-4" />
          Admin
        </Button>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-medium">Apparence</h2>
        <p className="text-xs text-muted">Uniquement sur ton compte. Le fond reste sombre.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {THEME_SWATCHES.map((sw) => (
            <button
              key={sw.id}
              aria-label={sw.label}
              onClick={() => store.updateProfile({ theme: sw.id })}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full bg-surface-2 px-3 text-sm",
                theme === sw.id && "shadow-[var(--shadow-border)]",
              )}
            >
              <span className="size-4 rounded-full" style={{ background: sw.hex }} />
              {sw.label}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-surface p-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-fg">Badge</span>
            <Button size="sm">Bouton</Button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-2/3 rounded-full bg-accent shadow-[var(--shadow-glow)]" />
          </div>
        </div>
      </section>

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
            <Label>Bio</Label>
            <Textarea
              className="mt-1"
              maxLength={160}
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              onBlur={() => {
                const next = bio.trim().slice(0, 160);
                setBio(next);
                if (next !== (user.bio ?? "")) store.updateProfile({ bio: next });
              }}
            />
            <p className="mt-1 text-right text-[10px] text-subtle num">{bio.length}/160</p>
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
        <h2 className="flex items-center gap-2 text-sm font-medium">
          Demandes
          {incoming.length > 0 ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-fg num">{incoming.length}</span>
          ) : null}
        </h2>
        {incoming.length === 0 && outgoing.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucune demande.</p>
        ) : null}
        {incoming.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {incoming.map((r) => {
              const from = store.users.find((u) => u.id === r.fromId && !u.isNpc);
              if (!from) return null;
              return (
                <li key={r.id} className="rounded-xl bg-surface px-3 py-3">
                  <button
                    className="text-sm font-medium"
                    onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: from.id } })}
                  >
                    @{from.pseudo}
                  </button>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => store.acceptFriendRequest(r.id)}>
                      Accepter
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => store.declineFriendRequest(r.id)}>
                      Refuser
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
        {outgoing.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {outgoing.map((r) => {
              const to = store.users.find((u) => u.id === r.toId && !u.isNpc);
              if (!to) return null;
              return (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2">
                  <button
                    className="min-w-0 truncate text-sm"
                    onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: to.id } })}
                  >
                    @{to.pseudo}
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => store.cancelFriendRequest(r.id)}>
                    Annuler
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Amis</h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const q = pseudo.trim().toLowerCase();
            const found = store.users.find((u) => !u.isNpc && u.pseudo.toLowerCase() === q);
            if (!found) {
              setErr("Aucun compte avec ce pseudo.");
              return;
            }
            setErr("");
            setPseudo("");
            void navigate({ to: "/app/u/$userId", params: { userId: found.id } });
          }}
        >
          <Input
            placeholder="Rechercher un pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <Button type="submit">Voir</Button>
        </form>
        {err ? <p className="mt-1 text-xs text-danger">{err}</p> : null}
        <ul className="mt-3 space-y-1">
          {friends.map((f) => {
            if (!f) return null;
            const fr = computeGlobalOrbit(f, store.sets, store.workouts, store.declaredPerfs, pool);
            return (
              <li key={f.id} className="flex h-12 items-center justify-between gap-2 rounded-xl bg-surface px-3">
                <button
                  className="min-w-0 flex-1 truncate text-left text-sm"
                  onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: f.id } })}
                >
                  @{f.pseudo}
                </button>
                <RankBadge rank={fr.rank} division={fr.division} size="sm" />
                <Button size="sm" variant="ghost" onClick={() => setDropId(f.id)}>
                  Retirer
                </Button>
              </li>
            );
          })}
          {friends.length === 0 ? <li className="text-sm text-muted">Aucun ami pour l’instant.</li> : null}
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

      {principal ? null : (
        <Button variant="danger" className="mt-3 w-full" onClick={() => setDelStep(1)}>
          Supprimer mon compte
        </Button>
      )}

      {dropId ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Retirer des amis</h2>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDropId(null)}>
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  store.removeFriend(dropId);
                  setDropId(null);
                }}
              >
                Retirer
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {delStep === 1 ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Supprimer mon compte</h2>
            <p className="mt-2 text-sm text-muted">
              Cette action est définitive. Tes perfs, séances, messages et demandes d’amis seront effacés.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDelStep(0)}>
                Annuler
              </Button>
              <Button variant="danger" className="flex-1" onClick={() => setDelStep(2)}>
                Continuer
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {delStep === 2 ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Confirme ton identité</h2>
            <div className="mt-3 grid gap-2">
              <Input
                placeholder="Pseudo exact"
                value={delPseudo}
                onChange={(e) => setDelPseudo(e.target.value)}
                autoComplete="off"
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={delPw}
                onChange={(e) => setDelPw(e.target.value)}
                autoComplete="current-password"
              />
              {delErr ? <p className="text-xs text-danger">{delErr}</p> : null}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDelStep(0)}>
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                disabled={delPseudo !== user.pseudo || delPw.length === 0}
                onClick={() => {
                  const r = store.deleteOwnAccount(delPseudo, delPw);
                  if (!r.ok) {
                    setDelErr(r.error);
                    return;
                  }
                  void navigate({ to: "/connexion" });
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
