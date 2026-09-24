import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { formatAge, formatDateFull, formatFr, formatSet, formatVolume } from "@/lib/orbit/format";
import { GOAL_LABEL, LEVEL_LABEL, SEX_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit, liftRankFor, nextRankInfo } from "@/lib/orbit/ranks";
import { useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/u/$userId")({ component: PublicProfil });

function PublicProfil() {
  const { userId } = Route.useParams();
  const store = useOrbitStore();
  const me = useSessionUser()!;
  const navigate = useNavigate();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const user = store.users.find((u) => u.id === userId && !u.isNpc);

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
        <h1 className="font-display text-2xl font-semibold">Profil public</h1>
      </header>

      {!user ? (
        <div className="mt-10">
          <p className="text-sm text-muted">Ce compte n’existe plus.</p>
          <Button className="mt-4" variant="secondary" onClick={() => void navigate({ to: "/app/perfs" })}>
            Retour
          </Button>
        </div>
      ) : (
        <PublicBody
          userId={user.id}
          confirmRemove={confirmRemove}
          setConfirmRemove={setConfirmRemove}
          onEdit={() => void navigate({ to: "/app/profil" })}
          meId={me.id}
        />
      )}
    </main>
  );
}

function PublicBody({
  userId,
  meId,
  confirmRemove,
  setConfirmRemove,
  onEdit,
}: {
  userId: string;
  meId: string;
  confirmRemove: boolean;
  setConfirmRemove: (v: boolean) => void;
  onEdit: () => void;
}) {
  const store = useOrbitStore();
  const pool = usePool();
  const [friendErr, setFriendErr] = useState("");
  const user = store.users.find((u) => u.id === userId && !u.isNpc);
  if (!user) {
    return <p className="mt-10 text-sm text-muted">Ce compte n’existe plus.</p>;
  }
  const mine = user.id === meId;
  const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
  const progress = nextRankInfo(orbit.score, orbit.classified);
  const lifts = pool
    .filter((e) => e.classified === true && !e.custom)
    .map((e) => liftRankFor(user, e.id, store.sets, store.workouts, store.declaredPerfs, pool))
    .filter((l) => l.classifiedLift && l.bestWeight > 0)
    .sort((a, b) => b.score - a.score);
  const done = store.workouts.filter((w) => w.userId === user.id && w.status === "completed");
  const doneIds = new Set(done.map((w) => w.id));
  const volume = store.sets
    .filter((s) => doneIds.has(s.workoutId))
    .reduce((acc, s) => acc + s.weight * s.reps, 0);
  const friends = store.friendsByUser[meId] ?? [];
  const already = friends.includes(user.id);
  const pendingOut = store.friendRequests.some(
    (r) => r.status === "pending" && r.fromId === meId && r.toId === user.id,
  );
  const pendingIn = store.friendRequests.find(
    (r) => r.status === "pending" && r.fromId === user.id && r.toId === meId,
  );

  return (
    <>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold">
          {user.pseudo.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">@{user.pseudo}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="lg" />
            {user.isAdmin ? (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent">Admin</span>
            ) : null}
          </div>
        </div>
      </div>
      {user.bio?.trim() ? (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm">{user.bio.trim()}</p>
      ) : null}

      {orbit.classified ? (
        <div className="mt-4">
          <p className="text-sm text-muted">Score {formatFr(orbit.score, 1)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">Non classé</p>
      )}

      <p className="mt-4 text-sm">
        {SEX_LABEL[user.sex]} · {formatAge(user.age)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {LEVEL_LABEL[user.level ?? "debutant"]} · {GOAL_LABEL[user.goal ?? "force"]}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">Séances</p>
          <p className="mt-1 text-sm font-medium num">
            {formatFr(done.length, 0)} terminée{done.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="glass rounded-xl px-3 py-3">
          <p className="text-[10px] uppercase text-muted">Inscrit</p>
          <p className="mt-1 text-sm font-medium">{formatDateFull(user.createdAt)}</p>
        </div>
      </div>
      {volume > 0 ? (
        <p className="mt-2 text-sm text-muted">Volume total {formatVolume(volume)}</p>
      ) : null}

      <section className="mt-6">
        <h2 className="text-sm font-medium">Rangs d’exos</h2>
        {lifts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Pas encore de rangs d’exos types.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {lifts.map((l) => (
              <li key={l.exerciseId} className="glass rounded-2xl px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-sm font-medium">{l.name}</p>
                  <RankBadge rank={l.rank} division={l.division} label={l.label} size="sm" />
                </div>
                <p className="mt-1 text-xs text-muted">{formatSet(l.bestWeight, l.bestReps)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        {mine ? (
          <div className="grid gap-2">
            <p className="text-sm text-muted">C’est toi</p>
            <Button onClick={onEdit}>Modifier mon profil</Button>
          </div>
        ) : already ? (
          <Button variant="secondary" className="w-full" onClick={() => setConfirmRemove(true)}>
            Retirer des amis
          </Button>
        ) : pendingOut ? (
          <Button className="w-full" disabled>
            Demande envoyée
          </Button>
        ) : pendingIn ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                store.acceptFriendRequest(pendingIn.id);
              }}
            >
              Accepter
            </Button>
            <Button variant="secondary" onClick={() => store.declineFriendRequest(pendingIn.id)}>
              Refuser
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              const r = store.requestFriend(user.id);
              setFriendErr(r.ok ? "" : r.error);
            }}
          >
            Demander en ami
          </Button>
        )}
        {friendErr ? <p className="mt-2 text-xs text-danger">{friendErr}</p> : null}
      </div>

      {confirmRemove ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Retirer des amis</h2>
            <p className={cn("mt-2 text-sm text-muted")}>@{user.pseudo} ne sera plus dans tes amis.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmRemove(false)}>
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  store.removeFriend(user.id);
                  setConfirmRemove(false);
                }}
              >
                Retirer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
