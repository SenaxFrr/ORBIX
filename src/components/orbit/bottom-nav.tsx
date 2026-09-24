import { Link } from "@tanstack/react-router";
import { Dumbbell, Medal, MessageCircle, Newspaper, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/app/feed", label: "Feed", icon: Newspaper },
  { to: "/app/programme", label: "Programme", icon: Dumbbell },
  { to: "/app/perfs", label: "Perfs", icon: Medal },
  { to: "/app/chat", label: "Chat", icon: MessageCircle },
  { to: "/app/recherche", label: "Rechercher", icon: Search },
] as const;

export function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-border bg-bg/90 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 px-1 pt-1">
        {ITEMS.map((it) => {
          const active = pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon className="pointer-events-none size-5" strokeWidth={active ? 2.2 : 1.8} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
