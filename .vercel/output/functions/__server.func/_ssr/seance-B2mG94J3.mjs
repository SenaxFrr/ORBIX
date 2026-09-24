import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as lastSetForExercise, H as usePool, L as roundKg, U as useSessionUser, V as useOrbitStore, _ as formatDuration, s as cn, u as findExercise, w as formatSet, x as formatRest } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as EmptyState } from "./empty-state--2nqDT3Q.mjs";
import { h as ChevronLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seance-B2mG94J3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SeancePage() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const active = store.workouts.find((w) => w.userId === user.id && w.status === "in_progress");
	const navigate = useNavigate();
	if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Aucune séance",
			body: "Choisis un programme pour commencer.",
			cta: "Programmes",
			onCta: () => void navigate({ to: "/app/programme" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logger, {
		workoutId: active.id,
		name: active.programName
	});
}
function Logger({ workoutId, name }) {
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const navigate = useNavigate();
	const planned = store.workoutExercises.filter((w) => w.workoutId === workoutId).sort((a, b) => a.order - b.order);
	const [currentId, setCurrentId] = (0, import_react.useState)(planned[0]?.exerciseId ?? "");
	const [weight, setWeight] = (0, import_react.useState)(0);
	const [wText, setWText] = (0, import_react.useState)("0");
	const [reps, setReps] = (0, import_react.useState)(8);
	const [leave, setLeave] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const rest = store.restByUser[user.id];
	const ex = findExercise(currentId, pool);
	const plan = planned.find((p) => p.exerciseId === currentId);
	const sets = store.sets.filter((s) => s.workoutId === workoutId && s.exerciseId === currentId).sort((a, b) => a.setNumber - b.setNumber || a.completedAt.localeCompare(b.completedAt));
	const lastKnown = lastSetForExercise(store.sets, store.workouts, user.id, currentId, store.declaredPerfs);
	const loggedHere = store.sets.filter((s) => s.workoutId === workoutId).length;
	(0, import_react.useEffect)(() => {
		if (!currentId && planned[0]) setCurrentId(planned[0].exerciseId);
	}, [currentId, planned]);
	(0, import_react.useEffect)(() => {
		const last = sets[sets.length - 1] ?? lastKnown;
		if (last) {
			const w = roundKg(last.weight);
			setWeight(w);
			setWText(String(w).replace(".", ","));
			setReps(last.reps);
		} else if (plan?.targetKg) {
			const w = roundKg(plan.targetKg);
			setWeight(w);
			setWText(String(w).replace(".", ","));
			setReps(plan.plannedReps);
		} else {
			setWeight(0);
			setWText("0");
			setReps(plan?.plannedReps ?? 8);
		}
	}, [currentId]);
	function validate() {
		if (busy || !currentId || reps <= 0) return;
		setBusy(true);
		store.addSet({
			workoutId,
			exerciseId: currentId,
			weight,
			reps
		});
		window.setTimeout(() => setBusy(false), 280);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col px-4 pb-8 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex size-11 items-center justify-center rounded-lg text-muted",
						onClick: () => setLeave(true),
						"aria-label": "Retour",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-[0.16em] text-muted",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-xl font-semibold",
							children: ex?.name ?? "Mouvement"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "sm",
						disabled: loggedHere === 0,
						onClick: () => {
							store.finishWorkout(workoutId);
							navigate({ to: "/app/suivi" });
						},
						children: "Terminer"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 px-1 text-xs text-muted",
				children: [
					"Dernière charge : ",
					lastKnown ? formatSet(lastKnown.weight, lastKnown.reps) : "—",
					plan ? ` · cible ${plan.plannedSets} × ${plan.plannedReps}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: planned.map((p) => {
					const e = findExercise(p.exerciseId, pool);
					const n = store.sets.filter((s) => s.workoutId === workoutId && s.exerciseId === p.exerciseId).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setCurrentId(p.exerciseId),
						className: cn("h-10 shrink-0 rounded-full px-3 text-sm shadow-[var(--shadow-border)]", p.exerciseId === currentId ? "bg-accent text-accent-fg" : "bg-surface text-fg"),
						children: [e?.name ?? p.exerciseId, n ? ` · ${n}` : ""]
					}, p.exerciseId);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1",
				children: sets.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex h-10 items-center justify-between rounded-lg bg-surface-2 px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted num",
						children: ["S", s.setNumber]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium num",
						children: formatSet(s.weight, s.reps)
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "glass rounded-2xl px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-[0.16em] text-muted",
						children: "Charge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full min-w-0 bg-transparent font-display text-5xl font-semibold leading-none num outline-none",
							inputMode: "decimal",
							value: wText,
							onChange: (e) => {
								const t = e.target.value.replace(".", ",");
								if (!/^\d*,?\d*$/.test(t)) return;
								setWText(t);
								const n = Number(t.replace(",", "."));
								if (!Number.isNaN(n) && n <= 999) setWeight(n);
							},
							onBlur: () => {
								const n = roundKg(Math.max(0, weight));
								setWeight(n);
								setWText(String(n).replace(".", ","));
							},
							"aria-label": "Charge en kg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-muted",
							children: "kg"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "glass rounded-2xl px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-[0.16em] text-muted",
						children: "Reps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full min-w-0 bg-transparent font-display text-5xl font-semibold leading-none num outline-none",
							inputMode: "numeric",
							value: reps,
							onChange: (e) => {
								const n = Number(e.target.value);
								if (!Number.isNaN(n) && n >= 0 && n <= 99) setReps(Math.round(n));
							},
							"aria-label": "Répétitions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-muted",
							children: "reps"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const n = roundKg(Math.max(0, weight - 2.5));
							setWeight(n);
							setWText(String(n).replace(".", ","));
						},
						children: "−2,5 kg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							const n = roundKg(weight + 2.5);
							setWeight(n);
							setWText(String(n).replace(".", ","));
						},
						children: "+2,5 kg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setReps((n) => Math.max(1, n - 1)),
						children: "−1 rep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setReps((n) => Math.min(50, n + 1)),
						children: "+1 rep"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "mt-2 w-full",
				disabled: !lastKnown,
				onClick: () => {
					if (!lastKnown) return;
					setWeight(roundKg(lastKnown.weight));
					setWText(String(roundKg(lastKnown.weight)).replace(".", ","));
					setReps(lastKnown.reps);
				},
				children: "Reprendre la dernière charge connue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mt-4 w-full",
				disabled: busy || !currentId,
				onClick: validate,
				children: "Valider la série"
			}),
			rest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestBar, {}) : null,
			leave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/70 px-4 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-strong w-full max-w-md rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Quitter la séance ?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Pause : tu reprends plus tard. Abandon : la séance est perdue."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										navigate({ to: "/app/programme" });
									},
									children: "Mettre en pause"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => {
										store.abandonWorkout(workoutId);
										navigate({ to: "/app/programme" });
									},
									children: "Abandonner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setLeave(false),
									children: "Rester"
								})
							]
						})
					]
				})
			}) : null
		]
	});
}
function RestBar() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const rest = store.restByUser[user.id];
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		if (!rest) return;
		const t = window.setInterval(() => setNow(Date.now()), 200);
		return () => window.clearInterval(t);
	}, [rest?.endsAt]);
	const remaining = rest ? Math.max(0, Math.ceil((rest.endsAt - now) / 1e3)) : 0;
	(0, import_react.useEffect)(() => {
		if (!rest) return;
		if (remaining <= 0) store.skipRest();
	}, [
		remaining,
		rest,
		store
	]);
	if (!rest) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 glass-strong flex items-center justify-between rounded-2xl px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-[0.16em] text-muted",
				children: "Repos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl font-semibold num",
				children: formatDuration(remaining)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: formatRest(remaining)
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			onClick: () => store.skipRest(),
			children: "Passer"
		})]
	});
}
//#endregion
export { SeancePage as component };
