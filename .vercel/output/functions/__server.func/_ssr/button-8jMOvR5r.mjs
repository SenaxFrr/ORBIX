import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { H as require_react, V as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./store-KSUIc6qN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-8jMOvR5r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("pressable inline-flex items-center justify-center gap-2 font-medium transition-[opacity,background-color,color,box-shadow] duration-150 disabled:opacity-40 disabled:pointer-events-none select-none", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] hover:opacity-95",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:opacity-90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2"
		},
		size: {
			sm: "h-10 px-3 text-sm rounded-md",
			md: "h-12 px-4 text-[15px] rounded-lg",
			lg: "h-14 px-5 text-base rounded-xl",
			icon: "size-12 rounded-lg",
			pill: "h-11 px-4 rounded-full text-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
//#endregion
export { Button as t };
