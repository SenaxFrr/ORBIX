import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { V as useOrbitStore, d as formatAge, f as formatBodyweight, s as cn, y as formatHeight } from "./store-KSUIc6qN.mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as Input } from "./input-B4XO3g8L.mjs";
import { t as Label } from "./label-DR6m95wp.mjs";
import { t as OrbitGlyph } from "./glyph-CfTNkWXE.mjs";
import { r as SEX_LABEL } from "./labels-BpfB9Gtw.mjs";
import { a as SplashMark } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connexion-C-fXPlJz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Connexion() {
	const [mode, setMode] = (0, import_react.useState)("login");
	const [step, setStep] = (0, import_react.useState)(0);
	const [pseudo, setPseudo] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [sex, setSex] = (0, import_react.useState)("homme");
	const [age, setAge] = (0, import_react.useState)("18");
	const [height, setHeight] = (0, import_react.useState)("178");
	const [weight, setWeight] = (0, import_react.useState)("74");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const login = useOrbitStore((s) => s.login);
	const register = useOrbitStore((s) => s.register);
	const hydrated = useOrbitStore((s) => s.hydrated);
	const navigate = useNavigate();
	function goApp() {
		navigate({ to: "/app/feed" });
	}
	function onLogin(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		setError("");
		const r = login(pseudo, password);
		setBusy(false);
		if (!r.ok) {
			setError(r.error);
			return;
		}
		goApp();
	}
	function submitRegister() {
		if (busy) return;
		setBusy(true);
		setError("");
		const r = register({
			pseudo,
			password,
			sex,
			age: Number(age),
			height: Number(height),
			bodyweight: Number(String(weight).replace(",", "."))
		});
		setBusy(false);
		if (!r.ok) {
			setError(r.error);
			return;
		}
		goApp();
	}
	const athleteOk = Number(age) >= 13 && Number(age) <= 80 && Number(height) >= 120 && Number(String(weight).replace(",", ".")) >= 30;
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashMark, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-col items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-16 items-center justify-center rounded-full bg-surface text-accent shadow-[var(--shadow-glow)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitGlyph, { size: 40 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold tracking-[0.22em]",
						children: "ORBIT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Force, rangs, séances. Simple."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: cn("h-10 rounded-lg text-sm", mode === "login" && "bg-accent text-accent-fg"),
					onClick: () => {
						setMode("login");
						setStep(0);
						setError("");
					},
					children: "Connexion"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: cn("h-10 rounded-lg text-sm", mode === "register" && "bg-accent text-accent-fg"),
					onClick: () => {
						setMode("register");
						setStep(0);
						setError("");
					},
					children: "Créer un compte"
				})]
			}),
			mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onLogin,
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pseudo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: pseudo,
						onChange: (e) => setPseudo(e.target.value),
						autoComplete: "username"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mot de passe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						autoComplete: "current-password"
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: busy,
						children: "Entrer"
					})
				]
			}) : step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (pseudo.trim().length < 2) {
						setError("Pseudo trop court.");
						return;
					}
					if (password.length < 4) {
						setError("Mot de passe trop court.");
						return;
					}
					setError("");
					setStep(1);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pseudo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: pseudo,
						onChange: (e) => setPseudo(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mot de passe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						children: "Continuer"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Sexe et âge servent aux rangs. Taille et poids sont suivis, ils n’entrent pas dans le score."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: Object.keys(SEX_LABEL).map((sx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSex(sx),
							className: cn("h-10 flex-1 rounded-lg text-sm", sex === sx ? "bg-accent text-accent-fg" : "bg-surface-2"),
							children: SEX_LABEL[sx]
						}, sx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
						"Âge (",
						formatAge(Number(age) || 0),
						")"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						inputMode: "numeric",
						value: age,
						onChange: (e) => setAge(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
						"Taille (",
						formatHeight(Number(height) || 0),
						")"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						inputMode: "numeric",
						value: height,
						onChange: (e) => setHeight(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
						"Poids (",
						formatBodyweight(Number(String(weight).replace(",", ".")) || 0),
						")"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						inputMode: "decimal",
						value: weight,
						onChange: (e) => setWeight(e.target.value)
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						disabled: !athleteOk || busy,
						onClick: submitRegister,
						children: "Créer le compte"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setStep(0),
						children: "Retour"
					})
				]
			})
		]
	});
}
//#endregion
export { Connexion as component };
