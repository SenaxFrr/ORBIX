import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, V as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { V as useOrbitStore } from "./store-KSUIc6qN.mjs";
import { a as SplashMark } from "./router-k9RcKQrn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DozF7gMb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Splash() {
	const hydrated = useOrbitStore((s) => s.hydrated);
	const session = useOrbitStore((s) => s.sessionUserId);
	const user = useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc));
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!session || !user) navigate({ to: "/connexion" });
		else navigate({ to: "/app/feed" });
	}, [
		hydrated,
		session,
		user,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashMark, {});
}
//#endregion
export { Splash as component };
