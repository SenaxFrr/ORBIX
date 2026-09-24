import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as formatSeries, E as formatWeight, N as poolFrom, U as useSessionUser, V as useOrbitStore, b as formatHold, g as formatDateLong, k as isHeld, n as GROUP_LABEL, s as cn, t as CATALOG_GROUPS, u as findExercise, x as formatRest } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
import { t as ExercisePicker } from "./exercise-picker-BEvzERmP.mjs";
import { t as EmptyState } from "./empty-state--2nqDT3Q.mjs";
import { i as TAG_LABEL } from "./labels-BpfB9Gtw.mjs";
import { a as Plus, g as ChevronDown, h as ChevronLeft, n as Trash2, o as Pencil, p as ChevronUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D7JYs13Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("min-h-28 w-full rounded-lg bg-surface-2 px-4 py-3 text-base text-fg shadow-[var(--shadow-border)] placeholder:text-subtle", className),
	...props
}));
Textarea.displayName = "Textarea";
var TAGS = [
	null,
	"Annonce",
	"Programme",
	"Conseils",
	"Event"
];
function AdminPage() {
	const user = useSessionUser();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("feed");
	(0, import_react.useEffect)(() => {
		if (!user.isAdmin) navigate({ to: "/app/profil" });
	}, [user.isAdmin, navigate]);
	if (!user.isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-36 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex size-11 items-center justify-center rounded-lg",
					onClick: () => void navigate({ to: "/app/profil" }),
					"aria-label": "Retour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Admin"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 mt-3 grid grid-cols-4 gap-1 rounded-xl bg-surface-2 p-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: cn("h-10 rounded-lg text-xs", tab === "feed" ? "bg-accent text-accent-fg" : "text-muted"),
						onClick: () => setTab("feed"),
						children: "Feed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: cn("h-10 rounded-lg text-xs", tab === "programmes" ? "bg-accent text-accent-fg" : "text-muted"),
						onClick: () => setTab("programmes"),
						children: "Programmes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: cn("h-10 rounded-lg text-xs", tab === "exercices" ? "bg-accent text-accent-fg" : "text-muted"),
						onClick: () => setTab("exercices"),
						children: "Exercices"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: cn("h-10 rounded-lg text-xs", tab === "comptes" ? "bg-accent text-accent-fg" : "text-muted"),
						onClick: () => setTab("comptes"),
						children: "Comptes"
					})
				]
			}),
			tab === "feed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFeed, {}) : tab === "programmes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPrograms, {}) : tab === "exercices" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminExercises, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminUsers, {})
		]
	});
}
function AdminFeed() {
	const store = useOrbitStore();
	const posts = [...store.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
	const [compose, setCompose] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [del, setDel] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "w-full",
			onClick: () => setCompose(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nouveau post"]
		}),
		posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Aucun post",
			body: "Publie la première annonce du club."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "glass rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						p.tag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted",
							children: TAG_LABEL[p.tag]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-medium",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: formatDateLong(p.createdAt)
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "flex size-10 items-center justify-center text-muted",
							onClick: () => setEdit(p),
							"aria-label": "Éditer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "flex size-10 items-center justify-center text-danger",
							onClick: () => setDel(p),
							"aria-label": "Supprimer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg/90",
					children: p.body
				})]
			}, p.id))
		}),
		compose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostSheet, {
			title: "Nouveau post",
			onClose: () => setCompose(false),
			onSave: (d) => {
				store.createPost(d);
				setCompose(false);
			}
		}) : null,
		edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostSheet, {
			title: "Éditer",
			initial: edit,
			onClose: () => setEdit(null),
			onSave: (d) => {
				store.updatePost(edit.id, d);
				setEdit(null);
			}
		}) : null,
		del ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
			title: "Supprimer ce post ?",
			onCancel: () => setDel(null),
			onOk: () => {
				store.deletePost(del.id);
				setDel(null);
			}
		}) : null
	] });
}
function AdminPrograms() {
	const store = useOrbitStore();
	const builtins = store.programs.filter((p) => p.builtin);
	const [create, setCreate] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [del, setDel] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "w-full",
			onClick: () => setCreate(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nouveau programme officiel"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: builtins.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "glass rounded-2xl px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "min-w-0 flex-1 text-left",
						onClick: () => setEdit(p),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								p.exercises.length,
								" mouvement",
								p.exercises.length > 1 ? "s" : "",
								p.description ? ` · ${p.description}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex size-10 items-center justify-center text-danger",
						onClick: () => setDel(p),
						"aria-label": "Supprimer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})
			}, p.id))
		}),
		create ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong w-full rounded-2xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Programme officiel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3",
						placeholder: "Nom",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-2",
						placeholder: "Description courte",
						value: desc,
						onChange: (e) => setDesc(e.target.value)
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
								const id = store.createOfficialProgram(name.trim(), desc.trim());
								setCreate(false);
								setName("");
								setDesc("");
								const p = useOrbitStore.getState().programs.find((x) => x.id === id);
								if (p) setEdit(p);
							},
							children: "Créer"
						})]
					})
				]
			})
		}) : null,
		edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficialEditor, {
			programId: edit.id,
			onClose: () => {
				setEdit(null);
			}
		}) : null,
		del ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
			title: `Supprimer « ${del.name} » ?`,
			onCancel: () => setDel(null),
			onOk: () => {
				store.deleteProgram(del.id);
				setDel(null);
			}
		}) : null
	] });
}
function OfficialEditor({ programId, onClose }) {
	const store = useOrbitStore();
	const program = store.programs.find((p) => p.id === programId);
	const [pick, setPick] = (0, import_react.useState)(false);
	if (!program) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 overflow-y-auto bg-bg px-4 pb-10 pt-[calc(env(safe-area-inset-top)+8px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex size-11 items-center justify-center rounded-lg",
						onClick: onClose,
						"aria-label": "Fermer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Éditer"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-3",
					defaultValue: program.name,
					onBlur: (e) => {
						const v = e.target.value.trim();
						if (v) store.updateProgram(program.id, { name: v });
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-2",
					defaultValue: program.description ?? "",
					placeholder: "Description courte",
					onBlur: (e) => store.updateProgram(program.id, { description: e.target.value.trim() })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: program.exercises.map((row, i) => {
						const ex = findExercise(row.exerciseId, poolFrom(store));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "glass rounded-2xl px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									}),
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							})]
						}, row.exerciseId);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "mt-3 w-full",
					onClick: () => setPick(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Ajouter un exo"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: onClose,
					children: "Fermer"
				})
			]
		}), pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePicker, {
			exclude: program.exercises.map((e) => e.exerciseId),
			onClose: () => setPick(false),
			onPick: (id) => {
				store.addExerciseToProgram(program.id, id);
				setPick(false);
			}
		}) : null]
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
function PostSheet({ title, initial, onClose, onSave }) {
	const [t, setT] = (0, import_react.useState)(initial?.title ?? "");
	const [b, setB] = (0, import_react.useState)(initial?.body ?? "");
	const [tag, setTag] = (0, import_react.useState)(initial?.tag ?? "Annonce");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong max-h-[86dvh] w-full overflow-y-auto rounded-2xl p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Titre" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: t,
							onChange: (e) => setT(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Texte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-1",
							value: b,
							onChange: (e) => setB(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: TAGS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTag(x),
								className: cn("h-9 rounded-full px-3 text-sm", tag === x ? "bg-accent text-accent-fg" : "bg-surface-2"),
								children: x ?? "Sans tag"
							}, x ?? "none"))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1",
						onClick: onClose,
						children: "Annuler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						disabled: !t.trim() || !b.trim(),
						onClick: () => onSave({
							title: t,
							body: b,
							tag
						}),
						children: "Publier"
					})]
				})
			]
		})
	});
}
function AdminExercises() {
	const store = useOrbitStore();
	const catalog = store.catalog;
	const [create, setCreate] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [del, setDel] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "w-full",
			onClick: () => setCreate(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nouvel exo"]
		}),
		err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-danger",
			children: err
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: catalog.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "glass rounded-2xl px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "min-w-0 flex-1 text-left",
						onClick: () => setEdit(e),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: e.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [GROUP_LABEL[e.group], e.classified ? ` · classé · H ${e.refHomme} / F ${e.refFemme} kg` : " · Non classé"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex size-10 items-center justify-center text-danger",
						onClick: () => setDel(e),
						"aria-label": "Supprimer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})
			}, e.id))
		}),
		create ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExoSheet, {
			title: "Nouvel exo",
			onClose: () => setCreate(false),
			onSave: (d) => {
				const r = store.createOfficialExercise(d);
				if (!r.ok) setErr(r.error);
				else {
					setErr("");
					setCreate(false);
				}
			}
		}) : null,
		edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExoSheet, {
			title: "Éditer",
			initial: edit,
			onClose: () => setEdit(null),
			onSave: (d) => {
				const r = store.updateOfficialExercise(edit.id, d);
				if (!r.ok) setErr(r.error);
				else {
					setErr("");
					setEdit(null);
				}
			}
		}) : null,
		del ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
			title: `Supprimer « ${del.name} » ?`,
			onCancel: () => setDel(null),
			onOk: () => {
				const r = store.deleteOfficialExercise(del.id);
				if (!r.ok) setErr(r.error);
				setDel(null);
			}
		}) : null
	] });
}
function ExoSheet({ title, initial, onClose, onSave }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [group, setGroup] = (0, import_react.useState)(initial?.group ?? "pectoraux");
	const [classified, setClassified] = (0, import_react.useState)(!!initial?.classified);
	const [rh, setRh] = (0, import_react.useState)(initial?.refHomme ? String(initial.refHomme) : "");
	const [rf, setRf] = (0, import_react.useState)(initial?.refFemme ? String(initial.refFemme) : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end bg-bg/70 px-4 pb-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong max-h-[86dvh] w-full overflow-y-auto rounded-2xl p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-3",
					children: "Nom"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[10px] uppercase text-muted",
					children: "Groupe"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 flex flex-wrap gap-1",
					children: CATALOG_GROUPS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setGroup(x.match[0]),
						className: cn("h-9 rounded-full px-3 text-sm", group === x.match[0] ? "bg-accent text-accent-fg" : "bg-surface-2"),
						children: x.label
					}, x.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: cn("mt-3 h-10 w-full rounded-lg text-sm", classified ? "bg-accent text-accent-fg" : "bg-surface-2"),
					onClick: () => setClassified((v) => !v),
					children: classified ? "Classé" : "Non classé"
				}),
				classified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase text-muted",
						children: "Réf homme kg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-0.5 h-10",
						inputMode: "decimal",
						value: rh,
						onChange: (e) => setRh(e.target.value)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase text-muted",
						children: "Réf femme kg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-0.5 h-10",
						inputMode: "decimal",
						value: rf,
						onChange: (e) => setRf(e.target.value)
					})] })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1",
						onClick: onClose,
						children: "Annuler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						disabled: !name.trim() || classified && (!Number(rh.replace(",", ".")) || !Number(rf.replace(",", "."))),
						onClick: () => onSave({
							name: name.trim(),
							group,
							classified,
							refHomme: classified ? Number(rh.replace(",", ".")) : void 0,
							refFemme: classified ? Number(rf.replace(",", ".")) : void 0
						}),
						children: "Enregistrer"
					})]
				})
			]
		})
	});
}
function Confirm({ title, onCancel, onOk, ok = "Supprimer" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/70 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong w-full max-w-sm rounded-2xl p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "flex-1",
					onClick: onCancel,
					children: "Annuler"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					className: "flex-1",
					onClick: onOk,
					children: ok
				})]
			})]
		})
	});
}
function AdminUsers() {
	const store = useOrbitStore();
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [del, setDel] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 5e3);
		return () => window.clearInterval(t);
	}, []);
	const members = store.users.filter((u) => !u.isNpc && !u.isAdmin);
	const closed = isHeld(store.chatClosedUntil, now);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: "Chat"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: closed ? `Fermé · ${formatHold(store.chatClosedUntil, now)}` : "Ouvert."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-1",
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
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 text-sm font-medium",
			children: "Comptes"
		}),
		members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Aucun membre inscrit."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: members.map((u) => {
				const muted = isHeld(store.mutedUntil[u.id], now);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "glass rounded-2xl px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: ["@", u.pseudo]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: muted ? `Muet · ${formatHold(store.mutedUntil[u.id], now)}` : "Actif"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "flex size-10 items-center justify-center text-danger",
							onClick: () => setDel({
								id: u.id,
								pseudo: u.pseudo
							}),
							"aria-label": `Supprimer ${u.pseudo}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => store.muteUser(u.id, 15),
								children: "15 min"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => store.muteUser(u.id, 60),
								children: "1 h"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => store.muteUser(u.id, 1440),
								children: "24 h"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => store.muteUser(u.id, "manual"),
								children: "Jusqu’à unmute"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => store.unmuteUser(u.id),
								children: "Unmute"
							})
						]
					})]
				}, u.id);
			})
		}),
		del ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
			title: `Supprimer @${del.pseudo} ?`,
			ok: "Supprimer",
			onCancel: () => setDel(null),
			onOk: () => {
				store.deleteAccount(del.id);
				setDel(null);
			}
		}) : null
	] });
}
//#endregion
export { AdminPage as component };
