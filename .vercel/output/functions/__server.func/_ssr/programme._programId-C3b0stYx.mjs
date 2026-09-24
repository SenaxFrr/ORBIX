import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as formatSeries, E as formatWeight, H as usePool, U as useSessionUser, V as useOrbitStore, u as findExercise, x as formatRest } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as ExercisePicker } from "./exercise-picker-BEvzERmP.mjs";
import { a as Plus, g as ChevronDown, h as ChevronLeft, n as Trash2, p as ChevronUp } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programme._programId-C3b0stYx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProgramDetail() {
	const { programId } = Route$1.useParams();
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const navigate = useNavigate();
	const program = store.programs.find((p) => p.id === programId);
	const canEdit = !!program && !program.builtin && program.ownerId === user.id;
	const [pick, setPick] = (0, import_react.useState)(false);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
	if (!program) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Programme introuvable."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			onClick: () => void navigate({ to: "/app/programme" }),
			children: "Retour"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center rounded-lg",
					onClick: () => void navigate({ to: "/app/programme" }),
					"aria-label": "Retour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "h-11 flex-1",
					defaultValue: program.name,
					onBlur: (e) => {
						const v = e.target.value.trim();
						if (v) store.updateProgram(program.id, { name: v });
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-semibold",
					children: program.name
				})]
			}),
			program.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 px-1 text-sm text-muted",
				children: program.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: program.exercises.map((row, i) => {
					const ex = findExercise(row.exerciseId, pool);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "glass rounded-2xl px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: ex?.name ?? row.exerciseId
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										formatSeries(row.sets),
										" · ",
										row.reps,
										" reps · repos ",
										formatRest(row.restSeconds),
										row.targetKg ? ` · ${formatWeight(row.targetKg)}` : ""
									]
								})]
							}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex size-10 items-center justify-center text-muted",
										onClick: () => store.moveProgramExercise(program.id, row.exerciseId, -1),
										disabled: i === 0,
										"aria-label": "Monter",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex size-10 items-center justify-center text-muted",
										onClick: () => store.moveProgramExercise(program.id, row.exerciseId, 1),
										disabled: i === program.exercises.length - 1,
										"aria-label": "Descendre",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex size-10 items-center justify-center text-danger",
										onClick: () => store.removeExerciseFromProgram(program.id, row.exerciseId),
										"aria-label": "Retirer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							}) : null]
						}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-4 gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
									label: "Séries",
									value: row.sets,
									onChange: (n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => e.exerciseId === row.exerciseId ? {
										...e,
										sets: n
									} : e) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
									label: "Reps",
									value: row.reps,
									onChange: (n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => e.exerciseId === row.exerciseId ? {
										...e,
										reps: n
									} : e) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
									label: "Repos s",
									value: row.restSeconds,
									onChange: (n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => e.exerciseId === row.exerciseId ? {
										...e,
										restSeconds: n
									} : e) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
									label: "kg",
									value: row.targetKg ?? 0,
									onChange: (n) => store.updateProgram(program.id, { exercises: program.exercises.map((e) => e.exerciseId === row.exerciseId ? {
										...e,
										targetKg: n || null
									} : e) })
								})
							]
						}) : null]
					}, row.exerciseId);
				})
			}),
			canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "mt-3 w-full",
				onClick: () => setPick(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Ajouter un exo"]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						disabled: !active && program.exercises.length === 0,
						onClick: () => {
							if (active) {
								navigate({ to: "/app/seance" });
								return;
							}
							store.startWorkout(program.id);
							navigate({ to: "/app/seance" });
						},
						children: active ? "Reprendre la séance" : "Commencer la séance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const id = store.duplicateProgram(program.id);
							if (id) navigate({
								to: "/app/programme/$programId",
								params: { programId: id }
							});
						},
						children: "Dupliquer"
					}),
					canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => setConfirmDel(true),
						children: "Supprimer"
					}) : null
				]
			}),
			pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePicker, {
				exclude: program.exercises.map((e) => e.exerciseId),
				onClose: () => setPick(false),
				onPick: (id) => {
					store.addExerciseToProgram(program.id, id);
					setPick(false);
				}
			}) : null,
			confirmDel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-strong w-full max-w-sm rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Supprimer ce programme ?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							onClick: () => setConfirmDel(false),
							children: "Annuler"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							className: "flex-1",
							onClick: () => {
								store.deleteProgram(program.id);
								navigate({ to: "/app/programme" });
							},
							children: "Supprimer"
						})]
					})]
				})
			}) : null
		]
	});
}
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-0.5 h-10 px-2 text-center",
			inputMode: "decimal",
			defaultValue: value,
			onBlur: (e) => onChange(Number(String(e.target.value).replace(",", ".")) || 0)
		})]
	});
}
//#endregion
export { ProgramDetail as component };
