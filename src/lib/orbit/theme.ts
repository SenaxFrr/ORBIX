import type { ThemeId, ThemeMode } from "./types";

export const THEME_SWATCHES: { id: ThemeId; label: string; hex: string; fg: string; ink: string }[] = [
  { id: "or", label: "Or", hex: "#E8C547", fg: "#16120a", ink: "#8A6A10" },
  { id: "teal", label: "Teal", hex: "#2EE6C7", fg: "#06221c", ink: "#0C7A68" },
  { id: "violet", label: "Violet", hex: "#8B7CFF", fg: "#120e22", ink: "#5146C7" },
  { id: "rouge", label: "Rouge", hex: "#FF5A6A", fg: "#2a0c10", ink: "#C42736" },
  { id: "bleu", label: "Bleu", hex: "#4DA3FF", fg: "#071422", ink: "#1B6FD4" },
  { id: "vert", label: "Vert", hex: "#3DDC97", fg: "#062216", ink: "#0E8A58" },
];

export function isThemeId(v: unknown): v is ThemeId {
  return THEME_SWATCHES.some((s) => s.id === v);
}

export function isThemeMode(v: unknown): v is ThemeMode {
  return v === "sombre" || v === "clair";
}

const DARK: Record<string, string> = {
  "--color-bg": "#07080C",
  "--color-surface": "#12141C",
  "--color-surface-2": "#1A1D27",
  "--color-fg": "#F3F4F7",
  "--color-muted": "#8B93A7",
  "--color-subtle": "#5C6478",
  "--color-border": "rgb(232 237 245 / 0.1)",
  "--color-danger": "#F07178",
  "--color-warn": "#E8A54B",
  "--shadow-border": "0 0 0 1px rgb(255 255 255 / 0.08)",
};

const LIGHT: Record<string, string> = {
  "--color-bg": "#F4F1EA",
  "--color-surface": "#FFFFFF",
  "--color-surface-2": "#EBE6DC",
  "--color-fg": "#12141A",
  "--color-muted": "#5A6170",
  "--color-subtle": "#7A736A",
  "--color-border": "rgb(18 20 26 / 0.12)",
  "--color-danger": "#C43842",
  "--color-warn": "#8A5A10",
  "--shadow-border": "0 0 0 1px rgb(18 20 26 / 0.08)",
};

const CONSOLE: Record<string, string> = {
  "--color-bg": "#090A0C",
  "--color-surface": "#121418",
  "--color-surface-2": "#1A1D22",
  "--color-fg": "#E6E8EC",
  "--color-muted": "#9AA1AB",
  "--color-subtle": "#6D747E",
  "--color-border": "#2A2E36",
  "--color-danger": "#E15A4A",
  "--color-warn": "#C4923A",
  "--color-accent": "#C5CBD6",
  "--color-accent-fg": "#12141A",
  "--color-accent-ink": "#C5CBD6",
  "--color-glow": "transparent",
  "--shadow-glow": "none",
  "--shadow-border": "none",
};

function paint(root: HTMLElement, tokens: Record<string, string>) {
  for (const [key, value] of Object.entries(tokens)) root.style.setProperty(key, value);
}

export function applyAccountTheme(mode: unknown, accent: unknown) {
  if (typeof document === "undefined") return;
  const m: ThemeMode = mode === "clair" ? "clair" : "sombre";
  const sw = THEME_SWATCHES.find((s) => s.id === accent) ?? THEME_SWATCHES[0];
  const root = document.documentElement;
  root.dataset.mode = m;
  root.style.colorScheme = m === "clair" ? "light" : "dark";
  paint(root, m === "clair" ? LIGHT : DARK);
  root.style.setProperty("--color-accent", sw.hex);
  root.style.setProperty("--color-accent-fg", sw.fg);
  root.style.setProperty("--color-accent-ink", m === "clair" ? sw.ink : sw.hex);
  if (m === "clair") {
    root.style.setProperty("--color-glow", "transparent");
    root.style.setProperty("--shadow-glow", "none");
  } else {
    root.style.setProperty("--color-glow", `color-mix(in oklab, ${sw.hex} 18%, transparent)`);
    root.style.setProperty("--shadow-glow", `0 0 32px color-mix(in oklab, ${sw.hex} 16%, transparent)`);
  }
}

export function applyConsoleTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.mode = "console";
  root.style.colorScheme = "dark";
  paint(root, CONSOLE);
}
