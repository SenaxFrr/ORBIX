import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as useSessionUser, V as useOrbitStore, g as formatDateLong, s as cn } from "./store-KSUIc6qN.mjs";
import { t as EmptyState } from "./empty-state--2nqDT3Q.mjs";
import { i as TAG_LABEL } from "./labels-BpfB9Gtw.mjs";
import { u as Heart } from "../_libs/lucide-react.mjs";
import { n as RankStrip, r as ResumeBanner } from "./app-header-CWcBZMac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/feed-DiQuyQN4.js
var import_jsx_runtime = require_jsx_runtime();
function FeedPage() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const posts = [...store.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankStrip, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-36 pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Feed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeBanner, {}),
			posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Rien ici pour l’instant.",
				body: "Le club n’a pas encore publié. Reviens plus tard."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: posts.map((p) => {
					const liked = (store.likes[p.id] ?? []).includes(user.id);
					const n = (store.likes[p.id] ?? []).length;
					const author = store.users.find((u) => u.id === p.authorId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "glass rounded-2xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [p.tag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted",
									children: TAG_LABEL[p.tag]
								}) : null, author?.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-accent",
									children: "ADMIN"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-medium",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-subtle",
								children: formatDateLong(p.createdAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-fg/90",
								children: p.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: cn("mt-3 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm", liked ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"),
								onClick: () => store.toggleLike(p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("pointer-events-none size-4", liked && "fill-current") }), n]
							})
						]
					}, p.id);
				})
			})
		]
	})] });
}
//#endregion
export { FeedPage as component };
