import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { RankStrip, ResumeBanner } from "@/components/orbit/app-header";
import { EmptyState } from "@/components/orbit/empty-state";
import { formatDateLong } from "@/lib/orbit/format";
import { TAG_LABEL } from "@/lib/orbit/labels";
import { useOrbitStore, useSessionUser } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/feed")({ component: FeedPage });

function FeedPage() {
  const store = useOrbitStore();
  const user = useSessionUser()!;
  const posts = [...store.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <>
      <RankStrip />
      <main className="px-4 pb-36 pt-3">
        <h1 className="font-display text-2xl font-semibold">Feed</h1>
        <ResumeBanner />

        {posts.length === 0 ? (
          <EmptyState title="Rien ici pour l’instant." body="Le club n’a pas encore publié. Reviens plus tard." />
        ) : (
          <ul className="mt-3 space-y-3">
            {posts.map((p) => {
              const liked = (store.likes[p.id] ?? []).includes(user.id);
              const n = (store.likes[p.id] ?? []).length;
              const author = store.users.find((u) => u.id === p.authorId);
              return (
                <li key={p.id} className="glass rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.tag ? (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                        {TAG_LABEL[p.tag]}
                      </span>
                    ) : null}
                    {author?.isAdmin ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent">ADMIN</span>
                    ) : null}
                  </div>
                  <h2 className="mt-1 font-medium">{p.title}</h2>
                  <p className="mt-0.5 text-xs text-subtle">{formatDateLong(p.createdAt)}</p>
                  <p className="mt-3 text-sm text-fg/90">{p.body}</p>
                  <button
                    className={cn(
                      "mt-3 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm",
                      liked ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted",
                    )}
                    onClick={() => store.toggleLike(p.id)}
                  >
                    <Heart className={cn("pointer-events-none size-4", liked && "fill-current")} />
                    {n}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
