import { V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glyph-CfTNkWXE.js
var import_jsx_runtime = require_jsx_runtime();
function OrbitGlyph({ size = 48, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": true,
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "32",
					r: "16"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "32",
					cy: "32",
					rx: "24",
					ry: "9"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "52",
					cy: "32",
					r: "3",
					fill: "currentColor",
					stroke: "none"
				})
			]
		})
	});
}
//#endregion
export { OrbitGlyph as t };
