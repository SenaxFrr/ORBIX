import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clockHm, daySeparatorLabel, formatClock } from "@/lib/orbit/format";
import { conversationKey, DM_REACTIONS, useOrbitStore, useSessionUser } from "@/lib/orbit/store";
import type { DirectMessage } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/messages")({
  validateSearch: (search: Record<string, unknown>): { with?: string } => ({
    with: typeof search.with === "string" && search.with ? search.with : undefined,
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { with: peerId } = Route.useSearch();
  if (peerId) return <Thread peerId={peerId} />;
  return <Inbox />;
}

function Inbox() {
  const store = useOrbitStore();
  const me = useSessionUser()!;
  const navigate = useNavigate();
  const [compose, setCompose] = useState(false);
  const [q, setQ] = useState("");
  const convos = useMemo(() => groupFor(store.dms, me.id), [store.dms, me.id]);

  const people = store.users
    .filter((u) => !u.isNpc && u.id !== me.id)
    .filter((u) => !q.trim() || u.pseudo.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => a.pseudo.localeCompare(b.pseudo, "fr"))
    .slice(0, 12);

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
        <h1 className="min-w-0 flex-1 font-display text-2xl font-semibold">Messages</h1>
        <Button size="sm" variant="secondary" onClick={() => setCompose((v) => !v)}>
          Nouveau
        </Button>
      </header>

      {compose ? (
        <div className="mt-4">
          <Input
            placeholder="Chercher un pseudo"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Nouveau message"
          />
          <ul className="mt-2 space-y-1">
            {people.length === 0 ? (
              <li className="px-1 py-2 text-sm text-muted">Aucun membre.</li>
            ) : (
              people.map((u) => (
                <li key={u.id}>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left"
                    onClick={() => void navigate({ to: "/app/messages", search: { with: u.id } })}
                  >
                    <Avatar pseudo={u.pseudo} name={u.firstName} />
                    <span className="truncate text-sm">@{u.pseudo}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {convos.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          Aucune conversation. Ouvre un profil public pour écrire.
        </p>
      ) : (
        <ul className="mt-4 space-y-1">
          {convos.map((c) => {
            const peer = store.users.find((u) => u.id === c.peerId);
            const unread = c.unread > 0;
            return (
              <li key={c.peerId}>
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left"
                  onClick={() => void navigate({ to: "/app/messages", search: { with: c.peerId } })}
                >
                  <Avatar pseudo={peer?.pseudo ?? "?"} name={peer?.firstName} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>
                        @{peer?.pseudo ?? "parti"}
                      </span>
                      <span className="shrink-0 text-[10px] text-subtle num">{formatClock(c.last.createdAt)}</span>
                    </span>
                    <span className={cn("mt-0.5 block truncate text-xs", unread ? "font-semibold text-fg" : "text-muted")}>
                      {c.last.text}
                    </span>
                  </span>
                  {unread ? <span className="size-2 shrink-0 rounded-full bg-accent" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function Thread({ peerId }: { peerId: string }) {
  const store = useOrbitStore();
  const me = useSessionUser()!;
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [picker, setPicker] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const peer = store.users.find((u) => u.id === peerId && !u.isNpc);
  const mine = peerId === me.id;
  const msgs = store.dms
    .filter((m) => conversationKey(m.fromId, m.toId) === conversationKey(me.id, peerId))
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const unread = msgs.filter((m) => m.fromId === peerId && m.toId === me.id && !(m.readAt > 0)).length;

  useEffect(() => {
    if (unread) store.markDmRead(peerId);
  }, [peerId, unread, store]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [msgs.length, msgs.at(-1)?.id]);

  function send() {
    const r = store.sendDm(peerId, text);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    setText("");
    setErr("");
  }

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+14rem)] pt-[calc(env(safe-area-inset-top)+8px)]">
      <header className="flex items-center gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-lg"
          onClick={() => void navigate({ to: "/app/messages", search: {} })}
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
        {peer && !mine ? (
          <button
            className="min-w-0 truncate text-sm font-medium"
            onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: peer.id } })}
          >
            @{peer.pseudo}
          </button>
        ) : (
          <p className="text-sm text-muted">{mine ? "C’est toi" : "Ce compte n’existe plus."}</p>
        )}
      </header>

      <ul className="mt-4 flex flex-1 flex-col gap-1.5">
        {msgs.map((m, i) => {
          const own = m.fromId === me.id;
          const prev = msgs[i - 1];
          const day = !prev || daySeparatorLabel(prev.createdAt) !== daySeparatorLabel(m.createdAt);
          return (
            <li key={m.id} className="flex flex-col">
              {day ? (
                <p className="py-2 text-center text-[11px] text-subtle">{daySeparatorLabel(m.createdAt)}</p>
              ) : null}
              <div className={cn("flex flex-col", own ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 text-sm",
                    own
                      ? "rounded-2xl rounded-br-md bg-accent text-accent-fg"
                      : "rounded-2xl rounded-bl-md bg-surface text-fg",
                  )}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPicker(m.id);
                  }}
                  onPointerDown={() => {
                    const hold = window.setTimeout(() => setPicker(m.id), 450);
                    const up = () => {
                      window.clearTimeout(hold);
                      window.removeEventListener("pointerup", up);
                    };
                    window.addEventListener("pointerup", up);
                  }}
                >
                  <p className="whitespace-pre-wrap [overflow-wrap:break-word] [word-break:normal]">{m.text}</p>
                  <button
                    type="button"
                    className={cn("mt-1 text-[10px] num", own ? "text-accent-fg/70" : "text-subtle")}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setPicker((id) => (id === m.id ? null : m.id))}
                  >
                    {clockHm(m.createdAt)}
                  </button>
                </div>
                {picker === m.id ? (
                  <div className="mt-1 flex gap-1 rounded-full bg-surface-2 px-2 py-1">
                    {DM_REACTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-base",
                          m.reactions?.[me.id] === emoji && "bg-surface",
                        )}
                        onClick={() => {
                          store.reactToDm(m.id, emoji);
                          setPicker(null);
                        }}
                        aria-label={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : null}
                <ReactionPills reactions={m.reactions} />
              </div>
            </li>
          );
        })}
      </ul>
      <div ref={bottom} />

      {peer && !mine ? (
        <form
          className="fixed inset-x-0 z-40 mx-auto w-full max-w-lg border-t border-border bg-bg px-4 pt-2"
          style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom))" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) send();
          }}
        >
          {err ? <p className="mb-1 text-xs text-danger">{err}</p> : null}
          <div className="flex gap-2 pb-1">
            <Input
              value={text}
              maxLength={200}
              placeholder="Message"
              onChange={(e) => {
                setText(e.target.value.slice(0, 200));
                if (err) setErr("");
              }}
              aria-label="Message"
            />
            <Button type="submit" className="shrink-0" disabled={!text.trim()}>
              Envoyer
            </Button>
          </div>
          <p className="pb-1 text-right text-[10px] text-subtle num">{text.length}/200</p>
        </form>
      ) : null}
    </main>
  );
}

function ReactionPills({ reactions }: { reactions?: Record<string, string> }) {
  const emojis = [...new Set(Object.values(reactions ?? {}))].filter((e) =>
    (DM_REACTIONS as readonly string[]).includes(e),
  );
  if (!emojis.length) return null;
  return (
    <div className="mt-1 flex gap-1">
      {emojis.map((emoji) => (
        <span key={emoji} className="rounded-full bg-surface-2 px-1.5 py-0.5 text-xs leading-none">
          {emoji}
        </span>
      ))}
    </div>
  );
}

function Avatar({ pseudo, name }: { pseudo: string; name?: string }) {
  const initials = (name || pseudo).slice(0, 2).toUpperCase();
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold">
      {initials}
    </span>
  );
}

function groupFor(dms: DirectMessage[], meId: string) {
  const map = new Map<string, { peerId: string; last: DirectMessage; unread: number }>();
  for (const m of dms) {
    if (m.fromId !== meId && m.toId !== meId) continue;
    const peerId = m.fromId === meId ? m.toId : m.fromId;
    const cur = map.get(peerId);
    const unread = m.toId === meId && !(m.readAt > 0) ? 1 : 0;
    if (!cur) {
      map.set(peerId, { peerId, last: m, unread });
      continue;
    }
    cur.unread += unread;
    if (+new Date(m.createdAt) >= +new Date(cur.last.createdAt)) cur.last = m;
  }
  return [...map.values()].sort((a, b) => +new Date(b.last.createdAt) - +new Date(a.last.createdAt));
}
