//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-DYq5JaqE.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/app",
			"/connexion"
		],
		preloads: [
			"/assets/index-CnNFNOiq.js",
			"/assets/useNavigate-B5cTCzu1.js",
			"/assets/useMatch-G-hXwMPn.js",
			"/assets/link-BSqERpiE.js",
			"/assets/preload-helper-DuZXJ_my.js",
			"/assets/store-vwpTYsyN.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-CnNFNOiq.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: ["/assets/routes-DyJjoWFm.js"]
	},
	"/app": {
		filePath: "/workspace/src/routes/app.tsx",
		children: [
			"/app/admin",
			"/app/chat",
			"/app/feed",
			"/app/perfs",
			"/app/profil",
			"/app/programme",
			"/app/seance",
			"/app/suivi",
			"/app/"
		],
		preloads: [
			"/assets/app-Bkd-1lAC.js",
			"/assets/useLocation-Dk77XKd9.js",
			"/assets/app-header-tOEOIVp5.js"
		]
	},
	"/connexion": {
		filePath: "/workspace/src/routes/connexion.tsx",
		children: void 0,
		preloads: [
			"/assets/connexion-B-V8cWW0.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js",
			"/assets/label-D8nBYwvP.js",
			"/assets/labels-BewSTZRt.js"
		]
	},
	"/app/admin": {
		filePath: "/workspace/src/routes/app/admin.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-emr1iW1T.js",
			"/assets/exercise-picker-0iLCXpIr.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/plus-CRu7u43x.js",
			"/assets/trash-2-zYVgCmTS.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js",
			"/assets/label-D8nBYwvP.js",
			"/assets/empty-state-CaVc-Th0.js",
			"/assets/labels-BewSTZRt.js"
		]
	},
	"/app/chat": {
		filePath: "/workspace/src/routes/app/chat.tsx",
		children: void 0,
		preloads: [
			"/assets/chat-BGMq9AtQ.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js"
		]
	},
	"/app/feed": {
		filePath: "/workspace/src/routes/app/feed.tsx",
		children: void 0,
		preloads: [
			"/assets/feed-CYHGrB1n.js",
			"/assets/empty-state-CaVc-Th0.js",
			"/assets/labels-BewSTZRt.js"
		]
	},
	"/app/perfs": {
		filePath: "/workspace/src/routes/app/perfs.tsx",
		children: ["/app/perfs/$exerciseId"],
		preloads: [
			"/assets/perfs-DlXbMr3c.js",
			"/assets/chevron-right-De5FSOA8.js",
			"/assets/plus-CRu7u43x.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js",
			"/assets/label-D8nBYwvP.js"
		]
	},
	"/app/profil": {
		filePath: "/workspace/src/routes/app/profil.tsx",
		children: void 0,
		preloads: [
			"/assets/profil-Dt8B7uvI.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/trash-2-zYVgCmTS.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js",
			"/assets/label-D8nBYwvP.js",
			"/assets/labels-BewSTZRt.js"
		]
	},
	"/app/programme": {
		filePath: "/workspace/src/routes/app/programme.tsx",
		children: ["/app/programme/$programId"],
		preloads: [
			"/assets/programme-Ble7NmMv.js",
			"/assets/plus-CRu7u43x.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js"
		]
	},
	"/app/seance": {
		filePath: "/workspace/src/routes/app/seance.tsx",
		children: void 0,
		preloads: [
			"/assets/seance-Df7AGrFs.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/empty-state-CaVc-Th0.js"
		]
	},
	"/app/suivi": {
		filePath: "/workspace/src/routes/app/suivi.tsx",
		children: ["/app/suivi/$workoutId"],
		preloads: [
			"/assets/suivi-C2Qm2p24.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/chevron-right-De5FSOA8.js",
			"/assets/button-vIPo1q_2.js",
			"/assets/input-cmOgkcMs.js",
			"/assets/label-D8nBYwvP.js",
			"/assets/LineChart-e0I6mEbI.js"
		]
	},
	"/app/": {
		filePath: "/workspace/src/routes/app/index.tsx",
		children: void 0,
		preloads: ["/assets/app-CTRZzHZ4.js"]
	},
	"/app/perfs/$exerciseId": {
		filePath: "/workspace/src/routes/app/perfs.$exerciseId.tsx",
		children: void 0,
		preloads: [
			"/assets/perfs._exerciseId-B7ORq6yl.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/LineChart-e0I6mEbI.js"
		]
	},
	"/app/programme/$programId": {
		filePath: "/workspace/src/routes/app/programme.$programId.tsx",
		children: void 0,
		preloads: [
			"/assets/programme._programId-QX0_mLQ3.js",
			"/assets/exercise-picker-0iLCXpIr.js",
			"/assets/chevron-left-Cdb6yxfk.js",
			"/assets/trash-2-zYVgCmTS.js"
		]
	},
	"/app/suivi/$workoutId": {
		filePath: "/workspace/src/routes/app/suivi.$workoutId.tsx",
		children: void 0,
		preloads: ["/assets/suivi._workoutId-CJDKxzz2.js"]
	}
} });
//#endregion
export { tsrStartManifest };
