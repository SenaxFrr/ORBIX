import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { V as useOrbitStore, i as allExercises, n as GROUP_LABEL, s as cn, t as CATALOG_GROUPS, z as searchExercises } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercise-picker-BEvzERmP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExercisePicker({ exclude, onClose, onPick }) {
	const store = useOrbitStore();
	const [q, setQ] = (0, import_react.useState)("");
	const [g, setG] = (0, import_react.useState)("all");
	const [custom, setCustom] = (0, import_react.useState)(false);
	const [cname, setCname] = (0, import_react.useState)("");
	const [cgroup, setCgroup] = (0, import_react.useState)("pectoraux");
	const list = (0, import_react.useMemo)(() => {
		let pool = q ? searchExercises(q, store.catalog, store.customExercises) : allExercises(store.catalog, store.customExercises);
		if (g !== "all") {
			const grp = CATALOG_GROUPS.find((x) => x.id === g);
			if (grp) pool = pool.filter((e) => grp.match.includes(e.group));
		}
		return pool.filter((e) => !exclude.includes(e.id));
	}, [
		q,
		g,
		store.catalog,
		store.customExercises,
		exclude
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end bg-bg/70",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong flex max-h-[88dvh] w-full flex-col rounded-t-2xl p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Ajouter un exo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-sm text-muted",
						onClick: onClose,
						children: "Fermer"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-3",
					placeholder: "Recherche",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-1 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: g === "all",
						onClick: () => setG("all"),
						children: "Tous"
					}), CATALOG_GROUPS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: g === x.id,
						onClick: () => setG(x.id),
						children: x.label
					}, x.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex-1 overflow-y-auto",
					children: list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex h-12 w-full items-center justify-between border-b border-border text-left text-sm",
						onClick: () => onPick(e.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: GROUP_LABEL[e.group]
						})]
					}) }, e.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "mt-2",
					onClick: () => setCustom(true),
					children: "Créer un exo"
				}),
				custom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nom" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cname,
							onChange: (e) => setCname(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: CATALOG_GROUPS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: cgroup === x.match[0],
								onClick: () => setCgroup(x.match[0]),
								children: x.label
							}, x.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !cname.trim(),
							onClick: () => {
								onPick(store.addCustomExercise(cname.trim(), cgroup));
							},
							children: "Ajouter"
						})
					]
				}) : null
			]
		})
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-sm", active ? "bg-accent text-accent-fg" : "bg-surface-2"),
		children
	});
}
//#endregion
export { ExercisePicker as t };
