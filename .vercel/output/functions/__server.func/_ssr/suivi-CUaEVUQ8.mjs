import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, f as useLocation, h as Outlet, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as todayKey, H as usePool, T as formatVolume, U as useSessionUser, V as useOrbitStore, _ as formatDuration, g as formatDateLong, h as formatDateFull, l as epley, m as formatDate, o as classifiedIds, s as cn, u as findExercise, v as formatFr } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
import { h as ChevronLeft, m as ChevronRight } from "../_libs/lucide-react.mjs";
import { r as ResumeBanner } from "./app-header-CWcBZMac.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suivi-CUaEVUQ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuiviPage() {
	const pathname = useLocation({ select: (l) => l.pathname });
	const [tab, setTab] = (0, import_react.useState)("graphes");
	if (pathname !== "/app/suivi") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-36",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Suivi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "graphes",
						onClick: () => setTab("graphes"),
						children: "Graphes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "calendrier",
						onClick: () => setTab("calendrier"),
						children: "Calendrier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "poids",
						onClick: () => setTab("poids"),
						children: "Poids"
					})
				]
			}),
			tab === "graphes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Graphs, {}) : tab === "calendrier" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cal, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poids, {})
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
function Graphs() {
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const [exo, setExo] = (0, import_react.useState)("volume");
	const classified = classifiedIds(pool);
	const [period, setPeriod] = (0, import_react.useState)(28);
	const [kind, setKind] = (0, import_react.useState)("rm");
	const data = (0, import_react.useMemo)(() => {
		const from = Date.now() - period * 864e5;
		const done = store.workouts.filter((w) => w.userId === user.id && w.status === "completed" && +new Date(w.startedAt) >= from);
		if (kind === "vol" || exo === "volume") {
			const weeks = /* @__PURE__ */ new Map();
			for (const w of done) {
				const vol = store.sets.filter((s) => s.workoutId === w.id && (exo === "volume" || s.exerciseId === exo)).reduce((a, s) => a + s.weight * s.reps, 0);
				const [y, m, d] = w.date.split("-").map(Number);
				const dt = new Date(y, m - 1, d);
				const day = (dt.getDay() + 6) % 7;
				const mon = new Date(dt);
				mon.setDate(dt.getDate() - day);
				const key = `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, "0")}-${String(mon.getDate()).padStart(2, "0")}`;
				const prev = weeks.get(key);
				weeks.set(key, {
					vol: (prev?.vol ?? 0) + vol,
					sort: key
				});
			}
			return [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, v]) => ({
				d: formatDate(key),
				v: Math.round(v.vol)
			}));
		}
		const points = [];
		const sorted = [...done].sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt));
		for (const w of sorted) {
			const ss = store.sets.filter((s) => s.workoutId === w.id && s.exerciseId === exo);
			if (!ss.length) continue;
			let bestW = 0;
			let bestE = 0;
			for (const s of ss) {
				bestW = Math.max(bestW, s.weight);
				bestE = Math.max(bestE, epley(s.weight, s.reps));
			}
			points.push({
				d: formatDate(w.date),
				v: Math.round((kind === "max" ? bestW : bestE) * 10) / 10,
				t: w.date
			});
		}
		for (const dcl of store.declaredPerfs) {
			if (dcl.userId !== user.id || dcl.exerciseId !== exo) continue;
			if (+new Date(dcl.date) < from) continue;
			points.push({
				d: formatDate(dcl.date),
				v: Math.round((kind === "max" ? dcl.weight : epley(dcl.weight, dcl.reps)) * 10) / 10,
				t: dcl.date
			});
		}
		points.sort((a, b) => a.t.localeCompare(b.t));
		return points.map(({ d, v }) => ({
			d,
			v
		}));
	}, [
		store.sets,
		store.workouts,
		store.declaredPerfs,
		user.id,
		exo,
		period,
		kind
	]);
	const tip = {
		background: "#14161c",
		border: "1px solid rgba(232,237,245,0.1)",
		borderRadius: 12,
		color: "#f3f4f7"
	};
	const unit = " kg";
	const label = kind === "vol" || exo === "volume" ? "Volume" : kind === "max" ? "Charge max" : "1RM";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1 overflow-x-auto pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: exo === "volume",
				onClick: () => setExo("volume"),
				children: "Volume total"
			}), classified.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: exo === id,
				onClick: () => setExo(id),
				children: findExercise(id, pool)?.name ?? id
			}, id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: period === 28,
					onClick: () => setPeriod(28),
					children: "4 sem"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: period === 90,
					onClick: () => setPeriod(90),
					children: "3 mois"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: period === 180,
					onClick: () => setPeriod(180),
					children: "6 mois"
				})
			]
		}),
		exo !== "volume" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: kind === "max",
					onClick: () => setKind("max"),
					children: "Charge max"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: kind === "rm",
					onClick: () => setKind("rm"),
					children: "1RM"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: kind === "vol",
					onClick: () => setKind("vol"),
					children: "Volume"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 h-48",
			children: data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "rgba(232,237,245,0.06)",
							vertical: false
						}),
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
							width: 52,
							tickLine: false,
							axisLine: false,
							tickFormatter: (v) => formatFr(v, 0),
							unit
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: tip,
							formatter: (v) => [`${formatFr(Number(v), 0)} kg`, label],
							labelFormatter: (l) => String(l)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "v",
							stroke: "var(--color-accent)",
							strokeWidth: 2,
							dot: true
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pt-16 text-center text-sm text-muted",
				children: "Logge une séance pour voir la courbe."
			})
		})
	] });
}
function Cal() {
	const store = useOrbitStore();
	const pool = usePool();
	const user = useSessionUser();
	const navigate = useNavigate();
	const now = /* @__PURE__ */ new Date();
	const [y, setY] = (0, import_react.useState)(now.getFullYear());
	const [m, setM] = (0, import_react.useState)(now.getMonth());
	const [picked, setPicked] = (0, import_react.useState)(null);
	const first = new Date(y, m, 1);
	const startPad = (first.getDay() + 6) % 7;
	const daysIn = new Date(y, m + 1, 0).getDate();
	const done = store.workouts.filter((w) => w.userId === user.id && w.status === "completed");
	const byDay = /* @__PURE__ */ new Map();
	for (const w of done) {
		const k = w.date.slice(0, 10);
		const list = byDay.get(k) ?? [];
		list.push(w);
		byDay.set(k, list);
	}
	const monthLabel = new Intl.DateTimeFormat("fr-FR", {
		month: "long",
		year: "numeric"
	}).format(first);
	function shift(dir) {
		const d = new Date(y, m + dir, 1);
		setY(d.getFullYear());
		setM(d.getMonth());
		setPicked(null);
	}
	const detail = picked ? byDay.get(picked) ?? [] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center",
					onClick: () => shift(-1),
					"aria-label": "Mois précédent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium capitalize",
					children: monthLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center",
					onClick: () => shift(1),
					"aria-label": "Mois suivant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-subtle",
			children: [
				"L",
				"M",
				"M",
				"J",
				"V",
				"S",
				"D"
			].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 grid grid-cols-7 gap-1",
			children: Array.from({ length: startPad + daysIn }, (_, i) => {
				if (i < startPad) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `p${i}`);
				const day = i - startPad + 1;
				const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
				const on = byDay.has(key);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (!on) return;
						const list = byDay.get(key) ?? [];
						if (list.length === 1) {
							navigate({
								to: "/app/suivi/$workoutId",
								params: { workoutId: list[0].id }
							});
							return;
						}
						setPicked(key);
					},
					className: cn("flex h-11 flex-col items-center justify-center rounded-lg text-sm num", picked === key && "bg-accent text-accent-fg", !on && "text-muted"),
					children: [day, on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-1 rounded-full", picked === key ? "bg-accent-fg" : "bg-accent") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 size-1" })]
				}, key);
			})
		}),
		picked && detail.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-muted",
				children: formatDateLong(picked)
			}), detail.map((w) => {
				const ss = store.sets.filter((s) => s.workoutId === w.id);
				const vol = ss.reduce((a, s) => a + s.weight * s.reps, 0);
				const exos = [...new Set(ss.map((s) => s.exerciseId))].map((id) => findExercise(id, pool)?.name ?? id).join(", ");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "glass w-full rounded-xl px-3 py-3 text-left",
					onClick: () => void navigate({
						to: "/app/suivi/$workoutId",
						params: { workoutId: w.id }
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: w.programName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								formatDuration(w.duration),
								" · ",
								formatVolume(vol)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: exos
						})
					]
				}, w.id);
			})]
		}) : picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Pas de séance ce jour-là."
		}) : null
	] });
}
function Poids() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const logs = store.weightLogs.filter((l) => l.userId === user.id).sort((a, b) => a.date.localeCompare(b.date));
	const current = logs[logs.length - 1]?.kg ?? user.bodyweight;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [kg, setKg] = (0, import_react.useState)(String(current).replace(".", ","));
	const [date, setDate] = (0, import_react.useState)(todayKey());
	const [picked, setPicked] = (0, import_react.useState)(null);
	function delta(days) {
		if (!logs.length) return null;
		const latest = logs[logs.length - 1];
		const target = addDays(latest.date, -days);
		let closest = logs[0];
		for (const l of logs) if (l.date <= target) closest = l;
		if (latest.date === closest.date && logs.length < 2) return null;
		return Math.round((latest.kg - closest.kg) * 10) / 10;
	}
	const d7 = delta(7);
	const d30 = delta(30);
	const from90 = Date.now() - 7776e6;
	const curve = logs.filter((l) => +new Date(l.date) >= from90).map((l) => ({
		d: formatDate(l.date),
		v: l.kg,
		date: l.date
	}));
	const tip = {
		background: "#14161c",
		border: "1px solid rgba(232,237,245,0.1)",
		borderRadius: 12,
		color: "#f3f4f7"
	};
	const pickedLog = picked ? logs.find((l) => l.date === picked) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-5xl font-semibold leading-none num",
			children: [
				formatFr(current, 1),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg text-muted",
					children: "kg"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-xl px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase text-muted",
					children: "7 j"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium num",
					children: fmtDelta(d7)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-xl px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase text-muted",
					children: "30 j"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium num",
					children: fmtDelta(d30)
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 h-44",
			children: curve.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data: curve,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "rgba(232,237,245,0.06)",
							vertical: false
						}),
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
							width: 48,
							tickLine: false,
							axisLine: false,
							tickFormatter: (v) => formatFr(v, 1),
							unit: " kg",
							domain: ["auto", "auto"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: tip,
							formatter: (v) => [`${formatFr(Number(v), 1)} kg`, "Poids"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "v",
							stroke: "var(--color-accent)",
							strokeWidth: 2,
							dot: true
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pt-16 text-center text-sm text-muted",
				children: "Note ton poids une fois par semaine."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 max-h-40 space-y-1 overflow-y-auto",
			children: [...logs].reverse().slice(0, 12).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: cn("flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm", picked === l.date ? "bg-accent/15" : "bg-surface"),
				onClick: () => setPicked(l.date),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: formatDateFull(l.date)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num",
					children: [formatFr(l.kg, 1), " kg"]
				})]
			}) }, l.id))
		}),
		pickedLog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm",
			children: [
				formatDateFull(pickedLog.date),
				" — ",
				formatFr(pickedLog.kg, 1),
				" kg"
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "sticky bottom-20 z-20 mt-4 w-full",
			onClick: () => setOpen(true),
			children: "Noter mon poids"
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong w-full rounded-2xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Noter mon poids"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Poids (kg)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							inputMode: "decimal",
							value: kg,
							onChange: (e) => setKg(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							onClick: () => setOpen(false),
							children: "Annuler"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => {
								const n = Number(String(kg).replace(",", "."));
								if (store.upsertWeight(n, date).ok) setOpen(false);
							},
							children: "Enregistrer"
						})]
					})
				]
			})
		}) : null
	] });
}
function addDays(key, n) {
	const [y, m, d] = key.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
	return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
function fmtDelta(n) {
	if (n === null) return "—";
	return `${n > 0 ? "+" : ""}${formatFr(n, 1)} kg`;
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-sm", active ? "bg-accent text-accent-fg" : "bg-surface-2"),
		children
	});
}
//#endregion
export { SuiviPage as component };
