import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatFr(n: number, digits = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function roundKg(kg: number): number {
  return Math.round(kg * 4) / 4;
}

export function formatRm(kg: number, withUnit = true): string {
  const v = Math.round(kg * 10) / 10;
  const digits = Number.isInteger(v) ? 0 : 1;
  const n = formatFr(v, digits);
  return withUnit ? `${n} kg` : n;
}

export function formatWeight(kg: number, withUnit = true): string {
  const v = roundKg(kg);
  const digits = Number.isInteger(v) ? 0 : 1;
  const n = formatFr(v, digits);
  return withUnit ? `${n} kg` : n;
}

export function formatBodyweight(kg: number): string {
  return `${formatFr(Math.round(kg * 10) / 10, 1)} kg`;
}

export function formatReps(n: number): string {
  return `${formatFr(n, 0)} rep${n > 1 ? "s" : ""}`;
}

export function formatSeries(n: number): string {
  return `${formatFr(n, 0)} série${n > 1 ? "s" : ""}`;
}

export function formatRest(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m === 0) return `${r} s`;
  if (r === 0) return `${m} min`;
  return `${m} min ${r} s`;
}

export function formatHeight(cm: number): string {
  return `${formatFr(Math.round(cm), 0)} cm`;
}

export function formatAge(age: number): string {
  return `${formatFr(age, 0)} ans`;
}

export function formatVolume(kg: number): string {
  return `${formatFr(Math.round(kg), 0)} kg`;
}

export function formatSet(weight: number, reps: number): string {
  return `${formatWeight(weight)} × ${formatReps(reps)}`;
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso.slice(0, 10)), "d MMM", { locale: fr });
  } catch {
    return iso;
  }
}

export function formatDateLong(iso: string): string {
  try {
    return format(parseISO(iso.slice(0, 10)), "EEEE d MMMM", { locale: fr });
  } catch {
    return iso;
  }
}

export function formatDateFull(iso: string): string {
  try {
    return format(parseISO(iso.slice(0, 10)), "d MMM yyyy", { locale: fr });
  } catch {
    return iso;
  }
}

export function parisParts(d = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    year: Number(g("year")),
    month: Number(g("month")),
    day: Number(g("day")),
    hour: Number(g("hour") === "24" ? "0" : g("hour")),
    minute: Number(g("minute")),
    second: Number(g("second")),
    weekday: g("weekday"),
  };
}

export function parisDateKey(d = new Date()): string {
  const p = parisParts(d);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function todayKey(d = new Date()): string {
  return parisDateKey(d);
}

export function addDaysKey(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export function monthKey(d = new Date()): { year: number; month: number } {
  const p = parisParts(d);
  return { year: p.year, month: p.month };
}

export function clockHm(iso: string): string {
  const p = parisParts(new Date(iso));
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

export function daySeparatorLabel(iso: string): string {
  const p = parisParts(new Date(iso));
  const key = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  const today = parisDateKey();
  if (key === today) return "Aujourd’hui";
  if (key === addDaysKey(today, -1)) return "Hier";
  return formatDateFull(key);
}

export function formatLastSeen(value: string | 0 | null | undefined, now = Date.now()): string {
  if (value == null || value === 0) return "Jamais";
  const t = Date.parse(value);
  if (!Number.isFinite(t)) return "Jamais";
  const delta = Math.max(0, now - t);
  if (delta < 3 * 60 * 1000) return "En ligne";
  if (delta < 60 * 60 * 1000) {
    const m = Math.max(1, Math.floor(delta / 60000));
    return `Il y a ${m} min`;
  }
  const p = parisParts(new Date(t));
  const key = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  const today = parisDateKey(new Date(now));
  const hm = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  if (key === today) {
    const h = Math.floor(delta / 3600000);
    return h <= 1 ? "Il y a 1 h" : `Il y a ${h} h`;
  }
  if (key === addDaysKey(today, -1)) return `Hier ${hm}`;
  return `${formatDateFull(key)} ${hm}`;
}

export function formatClock(iso: string): string {
  const p = parisParts(new Date(iso));
  const hm = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  const today = parisDateKey();
  const key = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  if (key === today) return hm;
  return `${formatDate(key)} ${hm}`;
}

export function formatHold(until: number | "manual" | null | undefined, now = Date.now()): string {
  if (until == null || until === 0) return "";
  if (until === "manual") return "jusqu’à levée";
  const ms = Math.max(0, until - now);
  const m = Math.ceil(ms / 60000);
  if (m <= 1) return "1 min";
  if (m < 60) return `${m} min`;
  const h = Math.ceil(m / 60);
  return h === 1 ? "1 h" : `${h} h`;
}

export function muteStatusLabel(until: number | "manual" | null | undefined, now = Date.now()): string {
  if (until == null || until === 0) return "ok";
  if (until === "manual") return "muet manuel";
  if (until <= now) return "ok";
  return `muet ${formatHold(until, now)}`;
}
