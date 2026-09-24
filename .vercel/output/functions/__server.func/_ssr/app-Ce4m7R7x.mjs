import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, f as useLocation, h as Outlet, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { V as useOrbitStore, s as cn } from "./store-KSUIc6qN.mjs";
import { _ as Activity, c as MessageCircle, d as Dumbbell, l as Medal, s as Newspaper } from "../_libs/lucide-react.mjs";
import { a as SplashMark } from "./router-k9RcKQrn.mjs";
import { t as AppHeader } from "./app-header-CWcBZMac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Ce4m7R7x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/app/feed",
		label: "Feed",
		icon: Newspaper
	},
	{
		to: "/app/programme",
		label: "Programme",
		icon: Dumbbell
	},
	{
		to: "/app/perfs",
		label: "Perfs",
		icon: Medal
	},
	{
		to: "/app/suivi",
		label: "Suivi",
		icon: Activity
	},
	{
		to: "/app/chat",
		label: "Chat",
		icon: MessageCircle
	}
];
function BottomNav({ pathname }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-border bg-bg/90 backdrop-blur-md",
		style: { paddingBottom: "env(safe-area-inset-bottom)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-5 px-1 pt-1",
			children: ITEMS.map((it) => {
				const active = pathname === it.to || pathname.startsWith(it.to + "/");
				const Icon = it.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: it.to,
					className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide", active ? "text-accent" : "text-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "pointer-events-none size-5",
						strokeWidth: active ? 2.2 : 1.8
					}), it.label]
				}) }, it.to);
			})
		})
	});
}
function AppLayout() {
	const hydrated = useOrbitStore((s) => s.hydrated);
	const user = useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc));
	const navigate = useNavigate();
	const pathname = useLocation({ select: (l) => l.pathname });
	const live = pathname.startsWith("/app/seance");
	const nested = /^\/app\/(programme|perfs|suivi)\/.+/.test(pathname) || pathname.startsWith("/app/profil") || pathname.startsWith("/app/admin");
	const hideHeader = live || nested || pathname === "/app/feed";
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!user) navigate({ to: "/connexion" });
	}, [
		hydrated,
		user,
		navigate
	]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashMark, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashMark, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh w-full max-w-lg",
		children: [
			hideHeader ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			live ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, { pathname })
		]
	});
}
//#endregion
export { AppLayout as component };
