import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as lastSetForExercise, D as historyForExercise, H as usePool, O as isClassifiedLift, S as formatRm, U as useSessionUser, V as useOrbitStore, a as classifiedExercises, j as liftRankFor, m as formatDate, r as SCORE_FORMULA, u as findExercise, v as formatFr, w as formatSet } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { h as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as Route$2, o as RankBadge } from "./router-k9RcKQrn.mjs";
import { i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfs._exerciseId-q7L2r7kQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExoSheet() {
	const { exerciseId } = Route$2.useParams();
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const navigate = useNavigate();
	const [how, setHow] = (0, import_react.useState)(false);
	const ex = findExercise(exerciseId, pool);
	const lift = liftRankFor(user, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool);
	const last = lastSetForExercise(store.sets, store.workouts, user.id, exerciseId, store.declaredPerfs);
	const hist = historyForExercise(user.id, exerciseId, store.sets, store.workouts, store.declaredPerfs, 10);
	const cutoff = Date.now() - 48384e5;
	const curve = [...hist].filter((h) => +new Date(h.date) >= cutoff).reverse().map((h) => ({
		d: formatDate(h.date),
		rm: Math.round(h.epley * 10) / 10,
		kg: h.weight
	}));
	const classified = isClassifiedLift(exerciseId, pool);
	const mine = ex?.custom && ex.ownerId === user.id;
	const refs = classifiedExercises(pool);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center rounded-lg",
					onClick: () => void navigate({ to: "/app/perfs" }),
					"aria-label": "Retour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-semibold",
					children: ex?.name ?? exerciseId
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 glass rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
						rank: lift.rank,
						division: lift.division,
						label: lift.label,
						size: "lg"
					}),
					classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-3xl font-semibold num",
						children: formatFr(lift.score, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"score · 1RM ",
							formatRm(lift.epley),
							" · réf ",
							formatRm(lift.refKg)
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"1RM ",
							formatRm(lift.epley),
							" · pas dans les classements"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: lift.sentence
					}),
					classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-3 text-xs text-accent",
						onClick: () => setHow((v) => !v),
						children: how ? "Masquer" : "Comment c’est calculé"
					}) : null,
					how && classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2 text-[11px] leading-relaxed text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "whitespace-pre-wrap",
								children: SCORE_FORMULA
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Exemple homme, 26 kg × 8 : curl marteau 1RM 32,9 / 41 = 80,2 · tirage 32,9 / 82 = 40,1." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-0.5",
								children: refs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									r.name,
									" · H ",
									formatRm(r.refHomme ?? 0),
									" · F ",
									formatRm(r.refFemme ?? 0)
								] }, r.id))
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-xl px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase text-muted",
							children: "Meilleur set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: lift.bestWeight > 0 ? formatSet(lift.bestWeight, lift.bestReps) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: lift.at ? formatDate(lift.at) : ""
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-xl px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase text-muted",
							children: "Dernier set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: last ? formatSet(last.weight, last.reps) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: last ? formatDate(last.at) : ""
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-muted",
					children: "1RM · 8 semaines (kg)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-36",
					children: curve.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: curve,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
									stroke: "#8B93A7",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#8B93A7",
									fontSize: 10,
									tickLine: false,
									axisLine: false,
									width: 48,
									tickFormatter: (v) => formatFr(v, 0),
									unit: " kg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#14161c",
										border: "1px solid rgba(232,237,245,0.1)",
										borderRadius: 12,
										color: "#f3f4f7"
									},
									formatter: (v) => [`${formatFr(Number(v), 1)} kg`, "1RM"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "rm",
									stroke: "var(--color-accent)",
									strokeWidth: 2,
									dot: true
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-8 text-center text-sm text-muted",
						children: "Pas encore de courbe."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-muted",
					children: "10 dernières séances"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-1.5",
					children: [hist.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [formatDate(h.date), h.source === "declared" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase text-subtle",
								children: "Déclaré"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "num",
							children: [
								formatSet(h.weight, h.reps),
								" · 1RM ",
								formatRm(h.epley)
							]
						})]
					}, `${h.date}-${h.source}-${i}`)), hist.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Aucune séance."
					}) : null]
				})]
			}),
			mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				className: "mt-8 w-full",
				onClick: () => {
					store.deleteCustomExercise(exerciseId);
					navigate({ to: "/app/perfs" });
				},
				children: "Supprimer cet exo"
			}) : null
		]
	});
}
//#endregion
export { ExoSheet as component };
