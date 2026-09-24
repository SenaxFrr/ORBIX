import { V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as usePool, M as nextRankInfo, U as useSessionUser, V as useOrbitStore, c as computeGlobalOrbit, s as cn, v as formatFr } from "./store-KSUIc6qN.mjs";
import { o as RankBadge } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-header-CWcBZMac.js
var import_jsx_runtime = require_jsx_runtime();
function AppHeader() {
	const user = useSessionUser();
	const store = useOrbitStore();
	const pool = usePool();
	const navigate = useNavigate();
	if (!user) return null;
	const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
	const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg font-semibold tracking-[0.2em]",
			children: "ORBIT"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "flex size-11 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold shadow-[var(--shadow-border)]",
			onClick: () => void navigate({ to: "/app/profil" }),
			"aria-label": "Profil",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex size-9 items-center justify-center rounded-full"),
				style: { background: `color-mix(in oklab, ${orbit.classified ? "var(--color-accent)" : "var(--color-surface-2)"} 35%, transparent)` },
				children: initials
			})
		})]
	});
}
function RankStrip() {
	const user = useSessionUser();
	const store = useOrbitStore();
	const pool = usePool();
	const navigate = useNavigate();
	if (!user) return null;
	const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
	const progress = nextRankInfo(orbit.score, orbit.classified);
	const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-0 z-20 shrink-0 overflow-hidden border-b border-border bg-bg/90 backdrop-blur-md",
		style: { paddingTop: "env(safe-area-inset-top)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 items-center gap-3 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "flex min-w-0 flex-1 items-center gap-3 text-left",
				onClick: () => void navigate({ to: "/app/perfs" }),
				"aria-label": "Classements",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
						rank: orbit.rank,
						division: orbit.division,
						label: orbit.label,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent",
								style: { width: `${progress.pct}%` }
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-sm text-muted num",
						children: orbit.classified ? formatFr(orbit.score, 1) : "—"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold",
				onClick: () => void navigate({ to: "/app/profil" }),
				"aria-label": "Profil",
				children: initials
			})]
		})
	});
}
function ResumeBanner() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const navigate = useNavigate();
	if (!user) return null;
	const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "mb-3 flex w-full items-center justify-between rounded-xl bg-accent px-4 py-3 text-left text-sm font-medium text-accent-fg",
		onClick: () => void navigate({ to: "/app/seance" }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Séance en cours — ", active.programName] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reprendre" })]
	});
}
//#endregion
export { RankStrip as n, ResumeBanner as r, AppHeader as t };
