import type { GlowLevel, ThemeId } from "./types";

export const THEME_SWATCHES: { id: ThemeId; label: string; hex: string; fg: string }[] = [
  { id: "or", label: "Or", hex: "#E8C547", fg: "#16120a" },
  { id: "teal", label: "Teal", hex: "#2EE6C7", fg: "#06221c" },
  { id: "violet", label: "Violet", hex: "#8B7CFF", fg: "#120e22" },
  { id: "rouge", label: "Rouge", hex: "#FF5A6A", fg: "#2a0c10" },
  { id: "bleu", label: "Bleu", hex: "#4DA3FF", fg: "#071422" },
  { id: "vert", label: "Vert", hex: "#3DDC97", fg: "#062216" },
];

export function isThemeId(v: unknown): v is ThemeId {
  return THEME_SWATCHES.some((s) => s.id === v);
}

export function isGlow(v: unknown): v is GlowLevel {
  return v === "faible" || v === "normal" || v === "fort";
}

export function resolveTheme(theme: unknown, glow: unknown): { theme: ThemeId; glow: GlowLevel } {
  return {
    theme: isThemeId(theme) ? theme : "or",
    glow: isGlow(glow) ? glow : "normal",
  };
}

export function applyAccountTheme(theme: unknown, glow: unknown) {
  if (typeof document === "undefined") return;
  const picked = resolveTheme(theme, glow);
  const sw = THEME_SWATCHES.find((s) => s.id === picked.theme) ?? THEME_SWATCHES[0];
  const alpha = picked.glow === "faible" ? 0.08 : picked.glow === "fort" ? 0.34 : 0.18;
  const blur = picked.glow === "faible" ? 16 : picked.glow === "fort" ? 48 : 32;
  const root = document.documentElement;
  root.style.setProperty("--color-accent", sw.hex);
  root.style.setProperty("--color-accent-fg", sw.fg);
  root.style.setProperty("--color-glow", hexAlpha(sw.hex, alpha));
  root.style.setProperty(
    "--shadow-glow",
    `0 0 ${blur}px color-mix(in oklab, ${sw.hex} ${Math.round(alpha * 100)}%, transparent)`,
  );
}

function hexAlpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${a})`;
}
