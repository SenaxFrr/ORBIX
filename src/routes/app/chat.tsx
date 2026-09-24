import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ResumeBanner } from "@/components/orbit/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatClock, formatHold } from "@/lib/orbit/format";
import { isHeld, useOrbitStore, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/chat")({ component: ChatPage });

function ChatPage() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [now, setNow] = useState(Date.now());
  const bottom = useRef<HTMLDivElement>(null);
  const closed = isHeld(store.chatClosedUntil, now);
  const muted = isHeld(store.mutedUntil[user.id], now);
  const flooded = (store.floodUntil[user.id] ?? 0) > now;
  const messages = store.messages;

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const blocked = closed || muted || flooded;
  const reason = closed
    ? "Chat fermé par un modo."
    : muted
      ? `Tu es muet${store.mutedUntil[user.id] ? ` · ${formatHold(store.mutedUntil[user.id], now)}` : ""}.`
      : flooded
        ? "Ralentis."
        : "";

  function send() {
    const r = store.sendMessage(text);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    setText("");
    setErr("");
  }

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+10rem)]">
      <h1 className="font-display text-2xl font-semibold">Chat</h1>
      <ResumeBanner />
      {closed ? (
        <p className="mt-3 rounded-xl bg-warn/15 px-3 py-2 text-sm text-warn">Chat fermé par un modo.</p>
      ) : null}

      {user.isAdmin ? (
        <div className="mt-3 flex flex-wrap gap-1">
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
      ) : null}

      {messages.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">Aucun message. Dis bonjour.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {messages.map((m) => {
            const author = store.users.find((u) => u.id === m.userId);
            const mine = m.userId === user.id;
            return (
              <li
                key={m.id}
                className={cn(
                  "rounded-2xl px-3 py-2",
                  mine ? "ml-6 bg-accent/15" : "mr-6 bg-surface",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-medium">
                    {author ? (
                      <button
                        className="truncate"
                        onClick={() => void navigate({ to: "/app/u/$userId", params: { userId: author.id } })}
                      >
                        @{author.pseudo}
                      </button>
                    ) : (
                      <span>@parti</span>
                    )}
                    {author?.isAdmin ? <span className="ml-1 text-accent">admin</span> : null}
                  </p>
                  <span className="shrink-0 text-[10px] text-subtle num">{formatClock(m.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.text}</p>
                {user.isAdmin ? (
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <button
                      className="h-8 rounded-full px-2 text-[11px] text-danger"
                      onClick={() => store.deleteMessage(m.id)}
                    >
                      Supprimer
                    </button>
                    {!author?.isAdmin && author ? (
                      <>
                        <button
                          className="h-8 rounded-full px-2 text-[11px] text-muted"
                          onClick={() => store.muteUser(author.id, 15)}
                        >
                          Mute 15 min
                        </button>
                        <button
                          className="h-8 rounded-full px-2 text-[11px] text-muted"
                          onClick={() => store.muteUser(author.id, 60)}
                        >
                          1 h
                        </button>
                        <button
                          className="h-8 rounded-full px-2 text-[11px] text-muted"
                          onClick={() => store.muteUser(author.id, 1440)}
                        >
                          24 h
                        </button>
                        <button
                          className="h-8 rounded-full px-2 text-[11px] text-muted"
                          onClick={() => store.muteUser(author.id, "manual")}
                        >
                          Jusqu’à unmute
                        </button>
                        <button
                          className="h-8 rounded-full px-2 text-[11px] text-muted"
                          onClick={() => store.unmuteUser(author.id)}
                        >
                          Unmute
                        </button>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <div ref={bottom} />

      <form
        className="fixed inset-x-0 z-20 mx-auto w-full max-w-lg bg-bg/95 px-4 pt-2 backdrop-blur-md"
        style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom))" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!blocked) send();
        }}
      >
        {err || (blocked && reason) ? (
          <p className="mb-1 text-xs text-danger">{err || reason}</p>
        ) : null}
        <div className="flex gap-2 pb-1">
          <Input
            value={text}
            maxLength={200}
            placeholder={blocked ? reason : "Écrire…"}
            disabled={blocked}
            onChange={(e) => {
              setText(e.target.value.slice(0, 200));
              if (err) setErr("");
            }}
            aria-label="Message"
          />
          <Button type="submit" className="shrink-0" disabled={blocked || !text.trim()}>
            Envoyer
          </Button>
        </div>
        <p className="pb-1 text-right text-[10px] text-subtle num">{text.length}/200</p>
      </form>
    </main>
  );
}
