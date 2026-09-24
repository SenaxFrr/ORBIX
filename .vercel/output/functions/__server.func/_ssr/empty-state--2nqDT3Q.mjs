import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-8jMOvR5r.mjs";
import { t as OrbitGlyph } from "./glyph-CfTNkWXE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state--2nqDT3Q.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ title, body, cta, onCta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-16 items-center justify-center rounded-2xl bg-surface text-accent shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitGlyph, { size: 36 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-[28ch] text-sm text-muted",
				children: body
			})] }),
			cta && onCta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onCta,
				size: "lg",
				children: cta
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
