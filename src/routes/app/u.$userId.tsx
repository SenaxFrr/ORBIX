import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { RankBadge } from "@/components/orbit/rank-badge";
import { Button } from "@/components/ui/button";
import { formatAge, formatDateFull, formatFr, formatSet, formatVolume } from "@/lib/orbit/format";
import { GOAL_LABEL, LEVEL_LABEL, SEX_LABEL } from "@/lib/orbit/labels";
import { computeGlobalOrbit, liftRankFor, nextRankInfo } from "@/lib/orbit/ranks";
import { isStaffAccount, useOrbitStore, usePool, useSessionUser } from "@/lib/orbit/store";
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
  const navigate = useNavigate();
  const me = useSessionUser();
  const [friendErr, setFriendErr] = useState("");
  const user = store.users.find((u) => u.id === userId && !u.isNpc);
  if (!user) {
    return <p className="mt-10 text-sm text-muted">Ce compte n’existe plus.</p>;
  }
  const mine = user.id === meId;
  const staffPair = isStaffAccount(user) || isStaffAccount(me);
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
      <div className="mt-5">
        {orbit.classified ? (
          <>
            <RankBadge rank={orbit.rank} division={orbit.division} label={orbit.label} size="xl" />
            <p className="mt-3 font-display text-4xl font-semibold num">{formatFr(orbit.score, 1)}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted">{progress.label}</p>
          </>
        ) : (
          <p className="font-display text-2xl font-semibold">Non classé</p>
        )}
        <p className="mt-3 text-sm text-muted">
          @{user.pseudo}
          {user.isAdmin ? <span className="ml-2 text-[11px] uppercase text-accent">admin</span> : null}
        </p>
      </div>
      {user.bio?.trim() ? (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm">{user.bio.trim()}</p>
      ) : null}

      <section className="mt-6">
        <h2 className="text-sm font-medium">Rangs d’exos</h2>
        {lifts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Pas encore de rangs d’exos types.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {lifts.map((l) => (
              <li key={l.exerciseId} className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-3 py-3">
                <RankBadge rank={l.rank} division={l.division} label={l.label} size="sm" />
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{l.name}</p>
                <span className="shrink-0 text-sm num">{formatSet(l.bestWeight, l.bestReps)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

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
      {volume > 0 ? <p className="mt-2 text-sm text-muted">Volume total {formatVolume(volume)}</p> : null}

      <div className="mt-6 grid gap-2">
        {!mine ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => void navigate({ to: "/app/messages", search: { with: user.id } })}
          >
            Message
          </Button>
        ) : null}
        {mine ? (
          <div className="grid gap-2">
            <p className="text-sm text-muted">C’est toi</p>
            <Button onClick={onEdit}>Modifier mon profil</Button>
          </div>
        ) : staffPair ? (
          <div className="grid gap-2">
            <p className="text-sm text-muted">Les comptes admin ne peuvent pas être ajoutés en ami.</p>
            {already ? (
              <Button variant="secondary" className="w-full" onClick={() => setConfirmRemove(true)}>
                Retirer des amis
              </Button>
            ) : null}
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
