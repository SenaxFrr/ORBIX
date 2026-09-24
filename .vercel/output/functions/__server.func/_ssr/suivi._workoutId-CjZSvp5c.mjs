import { V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as usePool, I as refForSex, O as isClassifiedLift, R as scoreExo, S as formatRm, T as formatVolume, U as useSessionUser, V as useOrbitStore, _ as formatDuration, h as formatDateFull, j as liftRankFor, l as epley, u as findExercise, v as formatFr, w as formatSet } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { h as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as Route, o as RankBadge } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suivi._workoutId-CjZSvp5c.js
var import_jsx_runtime = require_jsx_runtime();
function WorkoutDetail() {
	const { workoutId } = Route.useParams();
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const navigate = useNavigate();
	const w = store.workouts.find((x) => x.id === workoutId && x.userId === user.id);
	if (!w) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Séance introuvable."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			onClick: () => void navigate({ to: "/app/suivi" }),
			children: "Retour"
		})]
	});
	const planned = store.workoutExercises.filter((e) => e.workoutId === w.id).sort((a, b) => a.order - b.order);
	const sets = store.sets.filter((s) => s.workoutId === w.id);
	const order = planned.length ? planned.map((p) => p.exerciseId) : [...new Set(sets.map((s) => s.exerciseId))];
	const vol = sets.reduce((a, s) => a + s.weight * s.reps, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center rounded-lg",
					onClick: () => void navigate({ to: "/app/suivi" }),
					"aria-label": "Retour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-xl font-semibold",
					children: ["Séance du ", formatDateFull(w.date)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					w.programName,
					" · ",
					formatDuration(w.duration),
					" · ",
					formatVolume(vol)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: order.map((exerciseId) => {
					const ex = findExercise(exerciseId, pool);
					const ss = sets.filter((s) => s.exerciseId === exerciseId).sort((a, b) => a.setNumber - b.setNumber);
					if (!ss.length) return null;
					let best = ss[0];
					let bestE = epley(best.weight, best.reps);
					for (const s of ss) {
						const e = epley(s.weight, s.reps);
						if (e > bestE) {
							best = s;
							bestE = e;
						}
					}
					const classified = isClassifiedLift(exerciseId, pool);
					const lift = classified ? liftRankFor(user, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool) : null;
					const sessionScore = classified && ex ? scoreExo({
						epley1RM: bestE,
						refKg: refForSex(ex, user.sex),
						age: user.age
					}) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "glass rounded-2xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: ex?.name ?? exerciseId
								}), lift ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
									rank: lift.rank,
									division: lift.division,
									size: "sm"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1",
								children: ss.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted num",
										children: ["S", s.setNumber]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: formatSet(s.weight, s.reps)
									})]
								}, s.id))
							}),
							classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [
									"1RM ",
									formatRm(bestE),
									" · score ",
									formatFr(sessionScore, 1)
								]
							}) : null
						]
					}, exerciseId);
				})
			})
		]
	});
}
//#endregion
export { WorkoutDetail as component };
