import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as useSessionUser, V as useOrbitStore, b as formatHold, k as isHeld, p as formatClock, s as cn } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { r as ResumeBanner } from "./app-header-CWcBZMac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-Bg6NUTq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatPage() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const [text, setText] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const bottom = (0, import_react.useRef)(null);
	const closed = isHeld(store.chatClosedUntil, now);
	const muted = isHeld(store.mutedUntil[user.id], now);
	const flooded = (store.floodUntil[user.id] ?? 0) > now;
	const messages = store.messages;
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		bottom.current?.scrollIntoView({ block: "end" });
	}, [messages.length]);
	const blocked = closed || muted || flooded;
	const reason = closed ? "Chat fermé par un modo." : muted ? `Tu es muet${store.mutedUntil[user.id] ? ` · ${formatHold(store.mutedUntil[user.id], now)}` : ""}.` : flooded ? "Ralentis." : "";
	function send() {
		const r = store.sendMessage(text);
		if (!r.ok) {
			setErr(r.error);
			return;
		}
		setText("");
		setErr("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+10rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Chat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeBanner, {}),
			closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-xl bg-warn/15 px-3 py-2 text-sm text-warn",
				children: "Chat fermé par un modo."
			}) : null,
			user.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1",
				children: closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => store.openChat(),
					children: "Réouvrir"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => store.closeChat(15),
						children: "Fermer 15 min"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => store.closeChat(60),
						children: "Fermer 1 h"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => store.closeChat("manual"),
						children: "Jusqu’à réouverture"
					})
				] })
			}) : null,
			messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-center text-sm text-muted",
				children: "Aucun message. Dis bonjour."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: messages.map((m) => {
					const author = store.users.find((u) => u.id === m.userId);
					const mine = m.userId === user.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("rounded-2xl px-3 py-2", mine ? "ml-6 bg-accent/15" : "mr-6 bg-surface"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs font-medium",
									children: [
										"@",
										author?.pseudo ?? "parti",
										author?.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-accent",
											children: "admin"
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] text-subtle num",
									children: formatClock(m.createdAt)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap break-words text-sm",
								children: m.text
							}),
							user.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "h-8 rounded-full px-2 text-[11px] text-danger",
									onClick: () => store.deleteMessage(m.id),
									children: "Supprimer"
								}), !author?.isAdmin && author ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "h-8 rounded-full px-2 text-[11px] text-muted",
										onClick: () => store.muteUser(author.id, 15),
										children: "Mute 15 min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "h-8 rounded-full px-2 text-[11px] text-muted",
										onClick: () => store.muteUser(author.id, 60),
										children: "1 h"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "h-8 rounded-full px-2 text-[11px] text-muted",
										onClick: () => store.muteUser(author.id, 1440),
										children: "24 h"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "h-8 rounded-full px-2 text-[11px] text-muted",
										onClick: () => store.muteUser(author.id, "manual"),
										children: "Jusqu’à unmute"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "h-8 rounded-full px-2 text-[11px] text-muted",
										onClick: () => store.unmuteUser(author.id),
										children: "Unmute"
									})
								] }) : null]
							}) : null
						]
					}, m.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottom }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "fixed inset-x-0 z-20 mx-auto w-full max-w-lg bg-bg/95 px-4 pt-2 backdrop-blur-md",
				style: { bottom: "calc(3.5rem + env(safe-area-inset-bottom))" },
				onSubmit: (e) => {
					e.preventDefault();
					if (!blocked) send();
				},
				children: [
					err || blocked && reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-xs text-danger",
						children: err || reason
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: text,
							maxLength: 200,
							placeholder: blocked ? reason : "Écrire…",
							disabled: blocked,
							onChange: (e) => {
								setText(e.target.value.slice(0, 200));
								if (err) setErr("");
							},
							"aria-label": "Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "shrink-0",
							disabled: blocked || !text.trim(),
							children: "Envoyer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pb-1 text-right text-[10px] text-subtle num",
						children: [text.length, "/200"]
					})
				]
			})
		]
	});
}
//#endregion
export { ChatPage as component };
