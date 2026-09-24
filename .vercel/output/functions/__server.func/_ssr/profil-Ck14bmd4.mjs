import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as usePool, M as nextRankInfo, U as useSessionUser, V as useOrbitStore, c as computeGlobalOrbit, d as formatAge, f as formatBodyweight, s as cn, v as formatFr, y as formatHeight } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
import { n as LEVEL_LABEL, r as SEX_LABEL, t as GOAL_LABEL } from "./labels-BpfB9Gtw.mjs";
import { h as ChevronLeft, n as Trash2, r as Shield } from "../_libs/lucide-react.mjs";
import { o as RankBadge } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-Ck14bmd4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Profil() {
	const store = useOrbitStore();
	const user = useSessionUser();
	const pool = usePool();
	const navigate = useNavigate();
	const orbit = computeGlobalOrbit(user, store.sets, store.workouts, store.declaredPerfs, pool);
	const progress = nextRankInfo(orbit.score, orbit.classified);
	const friends = (store.friendsByUser[user.id] ?? []).map((id) => store.users.find((u) => u.id === id)).filter(Boolean);
	const [pseudo, setPseudo] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [curPw, setCurPw] = (0, import_react.useState)("");
	const [newPw, setNewPw] = (0, import_react.useState)("");
	const [pwErr, setPwErr] = (0, import_react.useState)("");
	const initials = (user.firstName || user.pseudo).slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-28 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center rounded-lg",
					onClick: () => void navigate({ to: "/app/feed" }),
					"aria-label": "Retour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Profil"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-14 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold",
					children: initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-muted",
						children: ["@", user.pseudo]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
							rank: orbit.rank,
							division: orbit.division,
							label: orbit.label,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full px-2 py-0.5 text-[11px]", user.isAdmin ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"),
							children: user.isAdmin ? "Admin" : "User"
						})]
					})]
				})]
			}),
			orbit.classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Score ", formatFr(orbit.score, 1)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-accent",
							style: { width: `${progress.pct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: progress.label
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-warn",
				children: orbit.reason
			}),
			user.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4 w-full",
				onClick: () => void navigate({ to: "/app/admin" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Admin"]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Identité"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Le poids est suivi. Il n’entre plus dans les rangs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prénom (optionnel)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								defaultValue: user.firstName ?? "",
								onBlur: (e) => store.updateProfile({ firstName: e.target.value.trim() })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sexe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex gap-1",
								children: Object.keys(SEX_LABEL).map((sx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => store.updateProfile({ sex: sx }),
									className: cn("h-10 flex-1 rounded-lg text-sm", user.sex === sx ? "bg-accent text-accent-fg" : "bg-surface-2"),
									children: SEX_LABEL[sx]
								}, sx))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								"Âge (",
								formatAge(user.age),
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								inputMode: "numeric",
								defaultValue: user.age,
								onBlur: (e) => {
									const n = Number(e.target.value);
									if (n >= 13 && n <= 80) store.updateProfile({ age: n });
								}
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								"Taille (",
								formatHeight(user.height),
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								inputMode: "numeric",
								defaultValue: user.height,
								onBlur: (e) => {
									const n = Number(e.target.value);
									if (n >= 120) store.updateProfile({ height: n });
								}
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
								"Poids actuel (",
								formatBodyweight(user.bodyweight),
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								inputMode: "decimal",
								defaultValue: user.bodyweight,
								onBlur: (e) => {
									const n = Number(String(e.target.value).replace(",", "."));
									if (n >= 30) store.updateProfile({ bodyweight: Math.round(n * 10) / 10 });
								}
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Niveau" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: Object.keys(LEVEL_LABEL).map((lv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => store.updateProfile({ level: lv }),
									className: cn("h-10 flex-1 rounded-lg px-2 text-sm", (user.level ?? "debutant") === lv ? "bg-accent text-accent-fg" : "bg-surface-2"),
									children: LEVEL_LABEL[lv]
								}, lv))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Objectif" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 grid grid-cols-2 gap-1",
								children: Object.keys(GOAL_LABEL).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => store.updateProfile({ goal: g }),
									className: cn("h-10 rounded-lg text-sm", (user.goal ?? "force") === g ? "bg-accent text-accent-fg" : "bg-surface-2"),
									children: GOAL_LABEL[g]
								}, g))
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Amis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							const r = store.addFriend(pseudo);
							if (!r.ok) setErr(r.error);
							else {
								setErr("");
								setPseudo("");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Pseudo exact",
							value: pseudo,
							onChange: (e) => setPseudo(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Ajouter"
						})]
					}),
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-danger",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-1",
						children: [friends.map((f) => {
							if (!f) return null;
							const fr = computeGlobalOrbit(f, store.sets, store.workouts, store.declaredPerfs, pool);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex h-12 items-center justify-between gap-2 rounded-xl bg-surface px-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 truncate text-sm",
										children: ["@", f.pseudo]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankBadge, {
										rank: fr.rank,
										division: fr.division,
										size: "sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex size-10 items-center justify-center text-danger",
										onClick: () => store.removeFriend(f.id),
										"aria-label": "Retirer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							}, f.id);
						}), friends.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "Personne pour l’instant. Ajoute un pseudo réel."
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Compte"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Changer le mot de passe" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "Actuel",
							value: curPw,
							onChange: (e) => setCurPw(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "Nouveau",
							value: newPw,
							onChange: (e) => setNewPw(e.target.value)
						}),
						pwErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-danger",
							children: pwErr
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								const r = store.changePassword(curPw, newPw);
								if (!r.ok) setPwErr(r.error);
								else {
									setPwErr("");
									setCurPw("");
									setNewPw("");
								}
							},
							children: "Enregistrer le mot de passe"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-8 w-full",
				onClick: () => {
					store.logout();
					navigate({ to: "/connexion" });
				},
				children: "Déconnexion"
			})
		]
	});
}
//#endregion
export { Profil as component };
