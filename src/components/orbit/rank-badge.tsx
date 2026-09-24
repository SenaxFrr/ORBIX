import { rankById, rankLabel } from "@/lib/orbit/ranks";
import type { Division, RankId } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

export function RankBadge({
  rank,
  division,
  label,
  size = "md",
}: {
  rank: RankId;
  division?: Division | null;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const def = rankById(rank);
  const text = label ?? rankLabel(rank, division ?? null);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
      )}
      style={{
        background: `color-mix(in oklab, ${def.color} 18%, transparent)`,
        color: def.color,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${def.color} 45%, transparent)`,
      }}
    >
      {text}
    </span>
  );
}
