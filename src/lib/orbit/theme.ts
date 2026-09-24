import type { ThemeId } from "./types";

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

export function applyAccountTheme(theme: unknown) {
  if (typeof document === "undefined") return;
  const sw = THEME_SWATCHES.find((s) => s.id === theme) ?? THEME_SWATCHES[0];
  const root = document.documentElement;
  root.style.setProperty("--color-accent", sw.hex);
  root.style.setProperty("--color-accent-fg", sw.fg);
  root.style.removeProperty("--color-glow");
  root.style.removeProperty("--shadow-glow");
}
