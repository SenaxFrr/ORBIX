import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, f as useLocation, h as Outlet, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as useSessionUser, V as useOrbitStore } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { a as Plus, f as Copy } from "../_libs/lucide-react.mjs";
import { r as ResumeBanner } from "./app-header-CWcBZMac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programme-BWRDA43E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProgrammeList() {
	const pathname = useLocation({ select: (l) => l.pathname });
	const store = useOrbitStore();
	const user = useSessionUser();
	const navigate = useNavigate();
	const [create, setCreate] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	if (pathname !== "/app/programme") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	const builtins = store.programs.filter((p) => p.builtin);
	const mine = store.programs.filter((p) => p.ownerId === user.id && !p.builtin);
	const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
	function open(id) {
		navigate({
			to: "/app/programme/$programId",
			params: { programId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Programme"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setCreate(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nouveau"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeBanner, {}),
			mine.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs uppercase tracking-[0.16em] text-muted",
					children: "Mes programmes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: mine.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						name: p.name,
						n: p.exercises.length,
						description: p.description,
						onClick: () => open(p.id),
						onDup: () => {
							const id = store.duplicateProgram(p.id);
							if (id) open(id);
						}
					}, p.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs uppercase tracking-[0.16em] text-muted",
				children: "Officiels"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: builtins.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					name: p.name,
					n: p.exercises.length,
					description: p.description,
					onClick: () => open(p.id),
					onDup: () => {
						const id = store.duplicateProgram(p.id);
						if (id) open(id);
					}
				}, p.id))
			})] }),
			create ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-strong w-full rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Nouveau programme"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-4",
							placeholder: "Nom",
							value: name,
							onChange: (e) => setName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "flex-1",
								onClick: () => setCreate(false),
								children: "Annuler"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								disabled: !name.trim(),
								onClick: () => {
									const id = store.createProgram(name.trim());
									setCreate(false);
									setName("");
									if (id) open(id);
								},
								children: "Créer"
							})]
						}),
						active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "Une séance est déjà en cours — tu pourras lancer après."
						}) : null
					]
				})
			}) : null
		]
	});
}
function Card({ name, n, description, onClick, onDup }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "glass flex items-center gap-1 rounded-2xl py-1 pl-1 pr-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left",
			onClick,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					n,
					" mouvement",
					n > 1 ? "s" : "",
					description ? ` · ${description}` : ""
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-lg text-muted",
			onClick: (e) => {
				e.stopPropagation();
				onDup();
			},
			"aria-label": `Dupliquer ${name}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "pointer-events-none size-4" })
		})]
	});
}
//#endregion
export { ProgrammeList as component };
