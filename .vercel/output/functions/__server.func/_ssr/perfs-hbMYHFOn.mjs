import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, f as useLocation, h as Outlet, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as lastSetForExercise, B as todayKey, H as usePool, S as formatRm, U as useSessionUser, V as useOrbitStore, c as computeGlobalOrbit, j as liftRankFor, o as classifiedIds, s as cn, t as CATALOG_GROUPS, u as findExercise, v as formatFr, w as formatSet } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
import { a as Plus, i as Search, m as ChevronRight } from "../_libs/lucide-react.mjs";
import { o as RankBadge } from "./router-k9RcKQrn.mjs";
import { r as ResumeBanner } from "./app-header-CWcBZMac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfs-hbMYHFOn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PerfsPage() {
	const pathname = useLocation({ select: (l) => l.pathname });
	const [tab, setTab] = (0, import_react.useState)("classements");
	if (pathname !== "/app/perfs") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Perfs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "classements",
						onClick: () => setTab("classements"),
						children: "Classements"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "exos",
						onClick: () => setTab("exos"),
						children: "Mes exos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "definir",
						onClick: () => setTab("definir"),
						children: "Définir"
					})
				]
			}),
			tab === "classements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {}) : tab === "exos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyExos, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Define, {})
		]
	});
}
function TabBtn({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: cn("h-10 rounded-lg text-sm", active ? "bg-accent text-accent-fg" : "text-muted"),
		children
	});
}
function Board() {
	const store = useOrbitStore();
	const pool = usePool();
	const me = useSessionUser();
	const [scope, setScope] = (0, import_react.useState)("global");
	const [metric, setMetric] = (0, import_react.useState)("global");
	const [friendErr, setFriendErr] = (0, import_react.useState)("");
	const friends = store.friendsByUser[me.id] ?? [];
	const picker = ["global", ...classifiedIds(pool)];
	const rows = (0, import_react.useMemo)(() => {
		const users = store.users.filter((u) => !u.isAdmin);
		return (scope === "amis" ? users.filter((u) => u.id === me.id || friends.includes(u.id)) : users).map((u) => {
			if (metric === "global") {
				const o = computeGlobalOrbit(u, store.sets, store.workouts, store.declaredPerfs, pool);
				return {
					id: u.id,
					pseudo: u.pseudo,
					score: o.score,
					rank: o.rank,
					division: o.division,
					label: o.label,
					classified: o.classified
				};
			}
			const l = liftRankFor(u, metric, store.sets, store.workouts, store.declaredPerfs, pool);
			return {
				id: u.id,
				pseudo: u.pseudo,
				score: l.score,
				rank: l.rank,
				division: l.division,
				label: l.label,
				classified: l.classifiedLift && l.score > 0
			};
		}).filter((r) => r.classified).sort((a, b) => b.score - a.score);
	}, [
		store.users,
		store.sets,
		store.workouts,
		store.declaredPerfs,
		scope,
		metric,
		friends,
		me.id,
		pool
	]);
	const myIndex = rows.findIndex((r) => r.id === me.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: scope === "global",
				onClick: () => setScope("global"),
				children: "Global"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: scope === "amis",
				onClick: () => setScope("amis"),
				children: "Amis"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-1 overflow-x-auto pb-1",
			children: picker.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: metric === id,
				onClick: () => setMetric(id),
				children: id === "global" ? "Rang global" : findExercise(id, pool)?.name ?? id
			}, id))
		}),
		scope === "amis" && friends.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-sm text-muted",
				children: "Aucun ami pour l’instant."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					const p = String(fd.get("pseudo") ?? "");
					const r = store.addFriend(p);
					if (!r.ok) setFriendErr(r.error);
					else {
						setFriendErr("");
						e.currentTarget.reset();
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "pseudo",
					placeholder: "Pseudo exact"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Ajouter"
				})]
			}),
			friendErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-danger",
				children: friendErr
			}) : null
		] }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-center text-sm text-muted",
			children: "Personne n’est classé pour l’instant. Définis 3 exos classés pour apparaître."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-1.5",
			children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5", r.id === me.id ? "bg-accent/10 shadow-[var(--shadow-border)]" : "bg-surface"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-6 text-right text-xs text-muted num",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm font-medium",
							children: [r.pseudo, r.id === me.id ? " · toi" : ""]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted num",
						children: formatFr(r.score, 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
						rank: r.rank,
						division: r.division,
						label: r.label,
						size: "sm"
					})
				]
			}, r.id))
		}),
		myIndex >= 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky bottom-20 mt-3 glass-strong flex items-center gap-3 rounded-xl px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-6 text-right text-xs text-muted num",
					children: myIndex + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex-1 text-sm font-medium",
					children: [me.pseudo, " · toi"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted num",
					children: formatFr(rows[myIndex].score, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
					rank: rows[myIndex].rank,
					division: rows[myIndex].division,
					label: rows[myIndex].label,
					size: "sm"
				})
			]
		}) : null
	] });
}
function MyExos() {
	const store = useOrbitStore();
	const pool = usePool();
	const me = useSessionUser();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [g, setG] = (0, import_react.useState)("all");
	const [create, setCreate] = (0, import_react.useState)(false);
	const [cname, setCname] = (0, import_react.useState)("");
	const [cgroup, setCgroup] = (0, import_react.useState)("pectoraux");
	const list = pool.filter((e) => {
		if (e.custom && e.ownerId !== me.id) return false;
		if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
		if (g === "all") return true;
		const grp = CATALOG_GROUPS.find((x) => x.id === g);
		return grp ? grp.match.includes(e.group) : true;
	}).map((e) => liftRankFor(me, e.id, store.sets, store.workouts, store.declaredPerfs, pool)).sort((a, b) => {
		if (a.classifiedLift !== b.classifiedLift) return a.classifiedLift ? -1 : 1;
		return a.name.localeCompare(b.name, "fr");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "pl-9",
				placeholder: "Recherche",
				value: q,
				onChange: (e) => setQ(e.target.value)
			})]
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			className: "mt-3 w-full",
			onClick: () => setCreate(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Créer un exo perso"]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-center text-sm text-muted",
			children: "Aucun exo."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: list.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "glass flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left",
				onClick: () => void navigate({
					to: "/app/perfs/$exerciseId",
					params: { exerciseId: l.exerciseId }
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: l.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [l.bestWeight > 0 ? formatSet(l.bestWeight, l.bestReps) : "—", l.epley > 0 ? ` · 1RM ${formatRm(l.epley)}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
						rank: l.rank,
						division: l.division,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })
				]
			}) }, l.exerciseId))
		}),
		create ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong w-full rounded-2xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Exo perso"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Privé, Non classé."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mt-3",
						children: "Nom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: cname,
						onChange: (e) => setCname(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1",
						children: CATALOG_GROUPS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: cgroup === x.match[0],
							onClick: () => setCgroup(x.match[0]),
							children: x.label
						}, x.id))
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
							disabled: !cname.trim(),
							onClick: () => {
								const id = store.addCustomExercise(cname.trim(), cgroup);
								setCreate(false);
								setCname("");
								if (id) navigate({
									to: "/app/perfs/$exerciseId",
									params: { exerciseId: id }
								});
							},
							children: "Créer"
						})]
					})
				]
			})
		}) : null
	] });
}
function Define() {
	const store = useOrbitStore();
	const pool = usePool();
	const me = useSessionUser();
	const ids = classifiedIds(pool);
	const any = ids.some((id) => {
		return liftRankFor(me, id, store.sets, store.workouts, store.declaredPerfs, pool).bestWeight > 0;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [!any ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-sm text-muted",
			children: "Entre tes max ici pour être classé."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "Exos classés. Ça ne crée pas de séance au calendrier."
		}), ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefineRow, { exerciseId: id }, id))]
	});
}
function DefineRow({ exerciseId }) {
	const store = useOrbitStore();
	const pool = usePool();
	const me = useSessionUser();
	const ex = findExercise(exerciseId, pool);
	const last = lastSetForExercise(store.sets, store.workouts, me.id, exerciseId, store.declaredPerfs);
	const lift = liftRankFor(me, exerciseId, store.sets, store.workouts, store.declaredPerfs, pool);
	const [kg, setKg] = (0, import_react.useState)(last ? String(last.weight).replace(".", ",") : "");
	const [reps, setReps] = (0, import_react.useState)(last ? String(last.reps) : "5");
	const [date, setDate] = (0, import_react.useState)(todayKey());
	const [err, setErr] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: ex?.name ?? exerciseId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
					rank: lift.rank,
					division: lift.division,
					size: "sm"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase text-muted",
						children: "Charge kg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-0.5 h-10",
						inputMode: "decimal",
						value: kg,
						onChange: (e) => setKg(e.target.value),
						"aria-label": `Charge ${ex?.name ?? exerciseId}`
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase text-muted",
						children: "Reps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-0.5 h-10",
						inputMode: "numeric",
						value: reps,
						onChange: (e) => setReps(e.target.value),
						"aria-label": `Reps ${ex?.name ?? exerciseId}`
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase text-muted",
						children: "Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-0.5 h-10",
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})] })
				]
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-danger",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-2 w-full",
				size: "sm",
				onClick: () => {
					const r = store.declarePerf({
						exerciseId,
						weight: Number(String(kg).replace(",", ".")),
						reps: Number(reps),
						date
					});
					setErr(r.ok ? "" : r.error);
				},
				children: ["Enregistrer ", ex?.name ?? ""]
			})
		]
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
export { PerfsPage as component };
