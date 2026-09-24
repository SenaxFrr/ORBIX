import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ResumeBanner } from "@/components/orbit/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clockHm, daySeparatorLabel, formatHold } from "@/lib/orbit/format";
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
  const messages = [...store.messages].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length, messages.at(-1)?.id]);

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
    <main className="flex min-h-dvh flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+14rem)]">
      <h1 className="font-display text-2xl font-semibold">Chat</h1>
      <ResumeBanner />
      {closed ? (
        <p className="mt-3 rounded-xl bg-warn/15 px-3 py-2 text-sm text-warn">Chat fermé par un modo.</p>
      ) : null}

      {messages.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">Aucun message. Dis bonjour.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-1.5">
          {messages.map((m, i) => {
            const author = store.users.find((u) => u.id === m.userId);
            const mine = m.userId === user.id;
            const prev = messages[i - 1];
            const day = !prev || daySeparatorLabel(prev.createdAt) !== daySeparatorLabel(m.createdAt);
            return (
              <li key={m.id} className="flex flex-col">
                {day ? (
                  <p className="py-2 text-center text-[11px] text-subtle">{daySeparatorLabel(m.createdAt)}</p>
                ) : null}
                <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] px-3 py-2",
                      mine
                        ? "rounded-2xl rounded-br-md bg-accent/15"
                        : "rounded-2xl rounded-bl-md bg-surface",
                    )}
                  >
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
                    <p className="mt-1 whitespace-pre-wrap text-sm [overflow-wrap:break-word] [word-break:normal]">
                      {m.text}
                    </p>
                    <p className="mt-1 text-[10px] text-subtle num">{clockHm(m.createdAt)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div ref={bottom} />

      <form
        className="fixed inset-x-0 z-40 mx-auto w-full max-w-lg border-t border-border bg-bg px-4 pt-2"
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
