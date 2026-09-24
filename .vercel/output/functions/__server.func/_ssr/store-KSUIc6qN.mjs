import { n as parseISO, r as format, t as fr } from "../_libs/date-fns.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-KSUIc6qN.js
function ex(id, name, group, primary, secondary, equipment, defaultRest, instructions, difficulty, elite1RM, aliases = []) {
	return {
		id,
		name,
		group,
		primary,
		secondary,
		equipment,
		defaultRest,
		instructions,
		difficulty,
		elite1RM,
		aliases
	};
}
var EXERCISES = [
	ex("dc-barre", "Développé couché barre", "pectoraux", "pectoraux", ["triceps", "epaules"], ["barre", "banc"], 150, "Omoplates serrées, pieds ancrés. Barre au bas des pecs, lockout sans rebond.", 3, 180, [
		"bench",
		"dc",
		"bench press",
		"développé couché"
	]),
	ex("dc-halteres", "Développé couché haltères", "pectoraux", "pectoraux", ["triceps", "epaules"], ["halteres", "banc"], 120, "Haltères au niveau des pecs, trajectoire légèrement arquée. Contrôle la descente.", 3, 160, ["db bench", "développé haltères"]),
	ex("incl-barre", "Développé incliné barre", "pectoraux", "pectoraux", ["epaules", "triceps"], ["barre", "banc"], 150, "Banc 30°. Barre au haut des pecs. Ne cambre pas excessivement.", 4, 150, ["incline bench"]),
	ex("incl-halteres", "Développé incliné haltères", "pectoraux", "pectoraux", ["epaules"], ["halteres", "banc"], 120, "Pouces vers l’intérieur en haut. Étire sans douleur d’épaule.", 3, 140, ["incline db"]),
	ex("decl-barre", "Développé décliné", "pectoraux", "pectoraux", ["triceps"], ["barre", "banc"], 120, "Banc décliné, amplitude complète, poignets droits.", 3, 190, ["decline"]),
	ex("ecart-halteres", "Écarté haltères", "pectoraux", "pectoraux", [], ["halteres", "banc"], 75, "Coudes souples. Descends jusqu’à l’étirement, pas plus bas que le torse.", 2, 70, ["fly", "écarté"]),
	ex("ecart-poulie", "Écarté poulie", "pectoraux", "pectoraux", [], ["poulie"], 60, "Pas en fente légère. Croise les poignées en fin de course.", 2, 60, ["cable fly"]),
	ex("pec-deck", "Pec deck", "pectoraux", "pectoraux", [], ["machine"], 75, "Épaules basses. Serre au centre deux secondes.", 1, 90, ["pec deck", "butterfly"]),
	ex("dips-pecs", "Dips pectoraux", "pectoraux", "pectoraux", ["triceps"], ["pdc"], 90, "Buste penché, coudes à 45°. Descends au niveau des pecs.", 4, 140, ["dips"]),
	ex("pompes", "Pompes", "pectoraux", "pectoraux", ["triceps", "core"], ["pdc"], 60, "Gainage plein. Poitrine au sol, lockout sans hausser les épaules.", 1, 120, ["push up", "pompe"]),
	ex("dc-machine", "Développé machine", "pectoraux", "pectoraux", ["triceps"], ["machine"], 90, "Réglage du siège : poignées au milieu des pecs. Pousse sans décoller le dos.", 2, 160, ["chest press"]),
	ex("pullover", "Pull-over haltère", "pectoraux", "pectoraux", ["dos"], ["halteres", "banc"], 75, "Légère flexion des coudes. Étire la cage, reviens sans casser les poignets.", 2, 70, ["pullover"]),
	ex("sdt", "Soulevé de terre", "dos", "dos", ["jambes", "fessiers"], ["barre"], 180, "Barre collée aux tibias. Hanches et épaules montent ensemble. Lockout sans cambrer.", 5, 280, [
		"deadlift",
		"sdt",
		"dl"
	]),
	ex("sdt-roumain", "Soulevé de terre roumain", "dos", "ischio", ["fessiers", "dos"], ["barre"], 120, "Genoux souples, hanche recule. Barre rase les cuisses.", 3, 220, ["rdl", "roumain"]),
	ex("row-barre", "Rowing barre", "dos", "dorsaux", ["biceps", "rhomboides"], ["barre"], 120, "Buste ~30°. Tire vers le bas du sternum, coudes près du corps.", 3, 180, ["barbell row", "rowing"]),
	ex("row-haltere", "Rowing haltère", "dos", "dorsaux", ["biceps"], ["halteres", "banc"], 90, "Appui sur banc. Coude au plafond, omoplate serrée.", 2, 90, ["db row"]),
	ex("row-poulie", "Rowing poulie basse", "dos", "dorsaux", ["biceps"], ["poulie"], 90, "Torse droit. Tire vers le nombril, pause d’une seconde.", 2, 140, ["cable row", "tirage horizontal"]),
	ex("tirage-vert", "Tirage vertical", "dos", "dorsaux", ["biceps"], ["machine", "poulie"], 90, "Poitrine haute. Barre à la clavicule, pas derrière la nuque.", 2, 140, ["lat pulldown", "tirage"]),
	ex("tirage-horiz", "Tirage horizontal machine", "dos", "dorsaux", ["rhomboides"], ["machine"], 75, "Poitrine contre le pad. Serre les omoplates sans haussement.", 2, 150, []),
	ex("tractions-pro", "Tractions pronation", "dos", "dorsaux", ["biceps"], ["pdc"], 150, "Épaules basses avant de tirer. Menton au-dessus, descente contrôlée.", 4, 140, [
		"pull up",
		"tractions",
		"pullup"
	]),
	ex("tractions-sup", "Tractions supination", "dos", "dorsaux", ["biceps"], ["pdc"], 120, "Prise en supination, légèrement plus étroite. Même consigne d’épaules.", 3, 150, ["chin up", "chinup"]),
	ex("shrug", "Shrugs", "dos", "trapezes", [], ["barre", "halteres"], 75, "Élève les épaules verticalement. Pas de rotation.", 1, 220, ["shrug", "haussement"]),
	ex("face-pull", "Face pull", "dos", "rear delt", ["trapezes"], ["poulie", "elastiques"], 60, "Tire vers le visage, rotation externe. Coudes hauts.", 2, 70, ["face pull"]),
	ex("good-morning", "Good morning", "dos", "lombaires", ["ischio"], ["barre"], 90, "Barre haute. Hanche recule, dos neutre, regard fixe.", 4, 140, []),
	ex("tbar-row", "T-bar row", "dos", "dorsaux", ["rhomboides"], ["barre", "machine"], 90, "Poitrine ouverte. Amplitude complète, pas d’élan lombaire.", 3, 170, ["tbar"]),
	ex("pullover-poulie", "Pullover poulie", "dos", "dorsaux", ["pectoraux"], ["poulie"], 60, "Bras presque tendus. Descends vers les hanches.", 2, 80, []),
	ex("mil-barre", "Développé militaire", "epaules", "deltoides", ["triceps"], ["barre"], 150, "Barre au haut de la poitrine. Pousse à la verticale, fessiers serrés.", 4, 110, [
		"ohp",
		"militaire",
		"overhead press",
		"développé militaire"
	]),
	ex("mil-halteres", "Développé haltères assis", "epaules", "deltoides", ["triceps"], ["halteres", "banc"], 120, "Dos collé. Haltères au-dessus de la tête, sans se cambrer.", 3, 90, ["db press"]),
	ex("arnold", "Arnold press", "epaules", "deltoides", ["triceps"], ["halteres"], 90, "Rotation paumes-visage vers l’avant pendant la poussée.", 3, 80, ["arnold"]),
	ex("elev-lat", "Élévations latérales", "epaules", "deltoide moyen", [], ["halteres", "elastiques"], 60, "Coudes souples, petit doigt légèrement plus haut. Stop à l’horizontale.", 2, 40, ["lateral raise", "élévations"]),
	ex("elev-front", "Élévations frontales", "epaules", "deltoide antérieur", [], ["halteres"], 60, "Un bras ou deux, jusqu’au niveau des yeux. Pas de swing.", 1, 40, []),
	ex("oiseau", "Oiseau", "epaules", "deltoide postérieur", ["rhomboides"], ["halteres"], 60, "Buste penché. Ouvre les bras dans l’alignement des épaules.", 2, 40, ["reverse fly", "oiseau"]),
	ex("upright-row", "Tirage menton", "epaules", "deltoides", ["trapezes"], ["barre"], 75, "Prise large. Coudes plus hauts que les poignets. Stop aux pecs.", 3, 90, ["upright row"]),
	ex("machine-shoulder", "Développé épaules machine", "epaules", "deltoides", ["triceps"], ["machine"], 90, "Dossier réglé : poignées au niveau des oreilles.", 2, 100, []),
	ex("cuban", "Cuban press", "epaules", "rotateurs", ["deltoides"], ["halteres"], 75, "Tirage menton puis rotation externe et press. Léger.", 3, 35, []),
	ex("rear-delt-machine", "Rear delt machine", "epaules", "deltoide postérieur", [], ["machine"], 60, "Poitrine contre le pad. Ouvre sans haussement.", 1, 70, []),
	ex("squat-barre", "Squat", "jambes", "quadriceps", ["fessiers", "core"], ["barre"], 180, "Barre haute ou basse. Genoux dans l’axe, profondeur au moins parallèle.", 5, 250, [
		"squat",
		"back squat",
		"squat barre"
	]),
	ex("squat-avant", "Squat avant", "jambes", "quadriceps", ["core"], ["barre"], 150, "Coudes hauts, torse vertical. Descends entre les hanches.", 5, 210, ["front squat"]),
	ex("squat-goblet", "Squat goblet", "jambes", "quadriceps", ["fessiers"], ["halteres", "kettlebell"], 75, "Charge contre la poitrine. Coudes à l’intérieur des genoux.", 2, 80, ["goblet"]),
	ex("squat-bulgare", "Squat bulgare", "jambes", "quadriceps", ["fessiers"], ["halteres", "banc"], 90, "Pied arrière sur banc. Tibia avant vertical, buste légèrement penché.", 4, 90, ["bulgarian"]),
	ex("presse", "Presse à cuisses", "jambes", "quadriceps", ["fessiers"], ["machine"], 120, "Pieds milieu de plaque. Ne verrouille pas les genoux sèchement.", 2, 400, ["leg press", "presse"]),
	ex("hack-squat", "Hack squat", "jambes", "quadriceps", ["fessiers"], ["machine"], 120, "Dos collé. Descends profond, pousse à travers le milieu du pied.", 3, 280, ["hack"]),
	ex("fentes", "Fentes haltères", "jambes", "quadriceps", ["fessiers"], ["halteres"], 75, "Grand pas, genou arrière vers le sol. Torse droit.", 3, 80, ["lunge", "fentes"]),
	ex("fentes-marche", "Fentes marchées", "jambes", "quadriceps", ["fessiers"], ["halteres", "pdc"], 75, "Enchaîne les pas. Bassin stable, regard loin.", 3, 70, []),
	ex("ext-quad", "Leg extension", "jambes", "quadriceps", [], ["machine"], 60, "Dos collé. Extension complète, deux secondes en haut.", 1, 120, ["leg extension"]),
	ex("curl-ischio", "Leg curl", "jambes", "ischio", [], ["machine"], 60, "Hanches collées au pad. Curl jusqu’à la fesse, contrôle le retour.", 1, 110, ["leg curl"]),
	ex("mollets-debout", "Mollets debout", "jambes", "mollets", [], ["machine", "barre"], 45, "Étirement bas, contraction haute. Pas de rebond.", 1, 180, ["calf", "mollets"]),
	ex("mollets-assis", "Mollets assis", "jambes", "soléaire", [], ["machine"], 45, "Genoux à 90°. Amplitude max, pause en bas.", 1, 140, []),
	ex("sdt-jambe-tendue", "SDT jambes tendues", "jambes", "ischio", ["fessiers"], ["barre", "halteres"], 90, "Genoux presque tendus. Descends tant que le dos reste plat.", 3, 180, ["stiff deadlift"]),
	ex("sissy", "Sissy squat", "jambes", "quadriceps", [], ["pdc", "machine"], 60, "Genoux avancent, buste recule. Tenue courte, contrôlée.", 4, 80, []),
	ex("hip-thrust", "Hip thrust barre", "fessiers", "fessiers", ["ischio"], ["barre", "banc"], 90, "Menton rentré. Extension de hanche complète, pause en haut.", 3, 220, ["hip thrust"]),
	ex("pont", "Pont fessier", "fessiers", "fessiers", ["ischio"], ["pdc"], 45, "Pieds près des fessiers. Monte sans cambrer le bas du dos.", 1, 140, ["glute bridge"]),
	ex("kickback", "Kickback", "fessiers", "fessiers", [], ["poulie", "elastiques"], 45, "Jambe tendue vers l’arrière, bassin fixe.", 1, 50, []),
	ex("abduct", "Abduction hanche", "fessiers", "moyen fessier", [], ["machine", "elastiques"], 45, "Pousse contre la résistance sans basculer le buste.", 1, 80, []),
	ex("step-up", "Step-up", "fessiers", "fessiers", ["quadriceps"], ["halteres", "pdc"], 60, "Pousse dans le talon du pied haut. Contrôle la descente.", 2, 80, []),
	ex("hyperext", "Hyperextensions", "fessiers", "fessiers", ["lombaires"], ["machine", "pdc"], 60, "Enroule jusqu’à l’alignement. Pas d’hyperextension lombaire.", 2, 100, ["back extension"]),
	ex("curl-barre", "Curl biceps", "biceps", "biceps", [], ["barre"], 75, "Coudes collés. Pas de balancier. Squeeze en haut.", 2, 70, [
		"barbell curl",
		"curl",
		"curl barre",
		"curl biceps"
	]),
	ex("curl-haltere", "Curl haltères", "biceps", "biceps", [], ["halteres"], 60, "Supination en montant. Épaules basses.", 2, 40, ["db curl"]),
	ex("curl-marteau", "Curl marteau", "biceps", "brachial", ["avant-bras"], ["halteres"], 60, "Prise neutre. Monte sans avancer le coude.", 2, 45, ["hammer curl"]),
	ex("curl-pupitre", "Curl pupitre", "biceps", "biceps", [], ["barre", "machine"], 75, "Aisselles contre le pupitre. Amplitude complète.", 2, 55, ["preacher"]),
	ex("curl-poulie", "Curl poulie", "biceps", "biceps", [], ["poulie"], 45, "Tension continue. Coudes fixes.", 1, 50, []),
	ex("curl-incline", "Curl incliné", "biceps", "biceps", [], ["halteres", "banc"], 75, "Banc 45°. Étirement long, pas d’élan.", 3, 35, []),
	ex("curl-concentre", "Curl concentration", "biceps", "biceps", [], ["halteres"], 45, "Coude contre la cuisse intérieure. Isolation stricte.", 1, 30, []),
	ex("barre-front", "Barre au front", "triceps", "triceps", [], ["barre", "banc"], 75, "Coudes fixes. Barre au front ou derrière la tête, selon mobilité.", 3, 80, ["skullcrusher", "barre au front"]),
	ex("ext-poulie", "Extension poulie", "triceps", "triceps", [], ["poulie"], 45, "Épaules basses. Extension complète, poignets neutres.", 1, 70, ["pushdown", "extension triceps"]),
	ex("ext-nuque", "Extension haltère nuque", "triceps", "triceps", [], ["halteres"], 75, "Coudes au plafond. Descends derrière la tête, reviens sans écarter.", 2, 50, ["overhead tricep"]),
	ex("dips-tri", "Dips triceps", "triceps", "triceps", ["pectoraux"], ["pdc"], 75, "Buste droit, coudes près du corps.", 3, 130, []),
	ex("kickback-tri", "Kickback triceps", "triceps", "triceps", [], ["halteres"], 45, "Bras collé au flanc. Extension complète, pause.", 1, 25, []),
	ex("dc-prise-serree", "Développé prise serrée", "triceps", "triceps", ["pectoraux"], ["barre", "banc"], 120, "Prise largeur épaules. Coudes le long du buste.", 3, 160, ["close grip bench"]),
	ex("overlay-poulie", "Extension poulie corde", "triceps", "triceps", [], ["poulie"], 45, "Écarte la corde en bas. Tension continue.", 1, 60, []),
	ex("planche", "Planche", "core", "transverse", ["epaules"], ["pdc"], 45, "Coudes sous épaules, bassin neutre. Respire. Logue les secondes en reps.", 2, 0, ["plank", "gainage"]),
	ex("side-plank", "Planche latérale", "core", "obliques", [], ["pdc"], 45, "Épaule-hanche-cheville alignées. Bassin haut.", 2, 0, []),
	ex("crunch", "Crunch", "core", "abdominaux", [], ["pdc"], 45, "Lumbar collé. Expire en haut, ne tire pas sur la nuque.", 1, 0, []),
	ex("releves", "Relevés de jambes", "core", "abdominaux", ["flexors"], ["pdc"], 45, "Bas du dos collé. Monte les jambes sans élan.", 3, 0, ["leg raise"]),
	ex("hanging-knee", "Relevés genoux suspendu", "core", "abdominaux", ["avant-bras"], ["pdc"], 60, "Épaules actives. Genoux à la poitrine, pas de balancier.", 3, 0, []),
	ex("ab-wheel", "Roue abdominale", "core", "transverse", ["lombaires"], ["pdc"], 75, "Bassin rétroversé. N’avance que tant que le dos reste plat.", 4, 0, ["ab wheel"]),
	ex("russian", "Russian twist", "core", "obliques", [], ["pdc", "halteres"], 45, "Talons décollés. Rotation du buste, pas des bras.", 2, 0, []),
	ex("pallof", "Pallof press", "core", "anti-rotation", [], ["poulie", "elastiques"], 45, "Pousse les bras, résiste à la rotation. Gainage dur.", 2, 40, ["pallof"]),
	ex("dead-bug", "Dead bug", "core", "transverse", [], ["pdc"], 45, "Bas du dos collé. Oppose bras et jambe, lent.", 1, 0, []),
	ex("mountain", "Mountain climber", "core", "abdominaux", ["cardio"], ["pdc"], 30, "Planche stricte. Genoux vers la poitrine, rythme régulier.", 2, 0, []),
	ex("tapis", "Course tapis", "cardio", "cardio", ["jambes"], ["machine"], 0, "Logue la vitesse en kg (ex. 12) et les minutes en reps.", 2, 0, ["run", "course"]),
	ex("velo", "Vélo", "cardio", "cardio", ["jambes"], ["machine"], 0, "Cadence stable. Kg = résistance, reps = minutes.", 1, 0, ["bike", "vélo"]),
	ex("rameur", "Rameur", "cardio", "cardio", ["dos", "jambes"], ["machine"], 0, "Jambes puis buste puis bras. Kg = split/10, reps = minutes.", 3, 0, ["row", "rameur"]),
	ex("corde", "Corde à sauter", "cardio", "cardio", ["mollets"], ["pdc"], 0, "Rebonds bas, poignets souples. Reps = sauts ou minutes × 10.", 2, 0, []),
	ex("assault", "Assault bike", "cardio", "cardio", ["corps entier"], ["machine"], 0, "Pousse et tire. Effort calibré. Reps = calories ou minutes.", 4, 0, ["air bike"]),
	ex("elliptique", "Elliptique", "cardio", "cardio", ["jambes"], ["machine"], 0, "Posture haute, sans s’appuyer sur les mains.", 1, 0, []),
	ex("burpees", "Burpees", "poids-du-corps", "corps entier", ["cardio"], ["pdc"], 45, "Poitrine au sol, saut franc. Rythme soutenable.", 3, 0, ["burpee"]),
	ex("pompes-diamant", "Pompes diamant", "poids-du-corps", "triceps", ["pectoraux"], ["pdc"], 60, "Pouces et index se touchent. Coudes le long du buste.", 3, 100, []),
	ex("pike-push", "Pike push-up", "poids-du-corps", "deltoides", ["triceps"], ["pdc"], 75, "Fesses hautes. Tête vers le sol, pousse verticale.", 4, 90, []),
	ex("nordic", "Nordic curl", "poids-du-corps", "ischio", [], ["pdc"], 90, "Descente ultra lente. Pousse les mains au dernier moment.", 5, 0, []),
	ex("pistol", "Pistol squat", "poids-du-corps", "quadriceps", ["fessiers"], ["pdc"], 90, "Jambe tendue devant. Contrôle, talon collé.", 5, 80, []),
	ex("hollow", "Hollow hold", "poids-du-corps", "transverse", [], ["pdc"], 45, "Bas du dos collé. Bras et jambes longs. Reps = secondes.", 3, 0, []),
	ex("lsit", "L-sit", "poids-du-corps", "core", ["triceps"], ["pdc"], 45, "Épaules basses, jambes tendues. Reps = secondes.", 5, 0, []),
	ex("inverted-row", "Rowing inversé", "poids-du-corps", "dorsaux", ["biceps"], ["pdc", "barre"], 75, "Corps gainé. Poitrine à la barre, descente lente.", 3, 110, ["inverted row"]),
	ex("jump-squat", "Squat sauté", "poids-du-corps", "quadriceps", ["cardio"], ["pdc"], 45, "Réception souple. Genoux stables.", 3, 0, []),
	ex("pompes-archer", "Pompes archer", "poids-du-corps", "pectoraux", ["triceps"], ["pdc"], 75, "Un bras travaille, l’autre guide. Alterne.", 4, 110, [])
];
var GROUP_LABEL = {
	pectoraux: "Pecs",
	dos: "Dos",
	epaules: "Épaules",
	jambes: "Jambes",
	fessiers: "Fessiers",
	biceps: "Biceps",
	triceps: "Triceps",
	core: "Core",
	cardio: "Cardio",
	"poids-du-corps": "Poids du corps"
};
var CATALOG_GROUPS = [
	{
		id: "pectoraux",
		label: "Pecs",
		match: ["pectoraux"]
	},
	{
		id: "dos",
		label: "Dos",
		match: ["dos"]
	},
	{
		id: "epaules",
		label: "Épaules",
		match: ["epaules"]
	},
	{
		id: "jambes",
		label: "Jambes",
		match: ["jambes", "fessiers"]
	},
	{
		id: "bras",
		label: "Bras",
		match: ["biceps", "triceps"]
	},
	{
		id: "core",
		label: "Core",
		match: ["core"]
	},
	{
		id: "poids-du-corps",
		label: "Poids du corps",
		match: ["poids-du-corps"]
	}
];
/**
* 1RM intermédiaire Strength Level (kg). Ne pas modifier.
* Haltères = un haltère, pas la paire.
*/
var INTERMEDIATE_REFS = {
	"squat-barre": {
		homme: 130,
		femme: 73
	},
	"dc-barre": {
		homme: 98,
		femme: 51
	},
	"dc-halteres": {
		homme: 40,
		femme: 20
	},
	presse: {
		homme: 227,
		femme: 151
	},
	"mil-barre": {
		homme: 65,
		femme: 35
	},
	"tirage-vert": {
		homme: 82,
		femme: 48
	},
	"curl-barre": {
		homme: 45,
		femme: 24
	},
	"curl-marteau": {
		homme: 41,
		femme: 26
	}
};
var DEFAULT_CATALOG = EXERCISES.map((e) => {
	const r = INTERMEDIATE_REFS[e.id];
	return {
		...e,
		official: true,
		classified: !!r,
		refHomme: r?.homme,
		refFemme: r?.femme
	};
});
function cloneCatalog() {
	return DEFAULT_CATALOG.map((e) => ({
		...e,
		secondary: [...e.secondary],
		equipment: [...e.equipment],
		aliases: [...e.aliases]
	}));
}
function poolOf(catalog = [], custom = []) {
	return [...catalog.length ? catalog : DEFAULT_CATALOG, ...custom];
}
function poolFrom(s) {
	return poolOf(s.catalog?.length ? s.catalog : DEFAULT_CATALOG, s.customExercises ?? []);
}
function classifiedExercises(pool = DEFAULT_CATALOG) {
	return poolOf(pool, []).filter((e) => e.classified && (e.refHomme ?? 0) > 0 && (e.refFemme ?? 0) > 0);
}
function classifiedIds(pool = DEFAULT_CATALOG) {
	return classifiedExercises(pool).map((e) => e.id);
}
function isClassifiedLift(id, pool = []) {
	const ex = findExercise(id, pool);
	return !!ex?.classified && (ex.refHomme ?? 0) > 0 && (ex.refFemme ?? 0) > 0;
}
function refForSex(ex, sex) {
	const h = ex.refHomme ?? 0;
	const f = ex.refFemme ?? 0;
	if (sex === "femme") return f;
	if (sex === "autre") return Math.round((h + f) / 2 * 10) / 10;
	return h;
}
function allExercises(catalog = [], custom = []) {
	return poolOf(catalog, custom);
}
function findExercise(id, pool = []) {
	return pool.find((e) => e.id === id) ?? DEFAULT_CATALOG.find((e) => e.id === id);
}
function searchExercises(q, catalog = [], custom = []) {
	const s = q.trim().toLowerCase();
	const pool = poolOf(catalog, custom);
	if (!s) return pool;
	return pool.filter((e) => {
		if (e.name.toLowerCase().includes(s)) return true;
		if (e.primary.toLowerCase().includes(s)) return true;
		if (e.group.includes(s)) return true;
		return e.aliases.some((a) => a.toLowerCase().includes(s));
	});
}
function formatFr(n, digits = 0) {
	return new Intl.NumberFormat("fr-FR", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(n);
}
function roundKg(kg) {
	return Math.round(kg * 4) / 4;
}
function formatRm(kg, withUnit = true) {
	const v = Math.round(kg * 10) / 10;
	const n = formatFr(v, Number.isInteger(v) ? 0 : 1);
	return withUnit ? `${n} kg` : n;
}
function formatWeight(kg, withUnit = true) {
	const v = roundKg(kg);
	const n = formatFr(v, Number.isInteger(v) ? 0 : 1);
	return withUnit ? `${n} kg` : n;
}
function formatBodyweight(kg) {
	return `${formatFr(Math.round(kg * 10) / 10, 1)} kg`;
}
function formatReps(n) {
	return `${formatFr(n, 0)} rep${n > 1 ? "s" : ""}`;
}
function formatSeries(n) {
	return `${formatFr(n, 0)} série${n > 1 ? "s" : ""}`;
}
function formatRest(seconds) {
	const s = Math.max(0, Math.round(seconds));
	const m = Math.floor(s / 60);
	const r = s % 60;
	if (m === 0) return `${r} s`;
	if (r === 0) return `${m} min`;
	return `${m} min ${r} s`;
}
function formatHeight(cm) {
	return `${formatFr(Math.round(cm), 0)} cm`;
}
function formatAge(age) {
	return `${formatFr(age, 0)} ans`;
}
function formatVolume(kg) {
	return `${formatFr(Math.round(kg), 0)} kg`;
}
function formatSet(weight, reps) {
	return `${formatWeight(weight)} × ${formatReps(reps)}`;
}
function formatDuration(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function formatDate(iso) {
	try {
		return format(parseISO(iso.slice(0, 10)), "d MMM", { locale: fr });
	} catch {
		return iso;
	}
}
function formatDateLong(iso) {
	try {
		return format(parseISO(iso.slice(0, 10)), "EEEE d MMMM", { locale: fr });
	} catch {
		return iso;
	}
}
function formatDateFull(iso) {
	try {
		return format(parseISO(iso.slice(0, 10)), "d MMM yyyy", { locale: fr });
	} catch {
		return iso;
	}
}
function parisParts(d = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Paris",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		weekday: "short",
		hour12: false
	}).formatToParts(d);
	const g = (t) => parts.find((p) => p.type === t)?.value ?? "";
	return {
		year: Number(g("year")),
		month: Number(g("month")),
		day: Number(g("day")),
		hour: Number(g("hour") === "24" ? "0" : g("hour")),
		minute: Number(g("minute")),
		second: Number(g("second")),
		weekday: g("weekday")
	};
}
function parisDateKey(d = /* @__PURE__ */ new Date()) {
	const p = parisParts(d);
	return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
function todayKey(d = /* @__PURE__ */ new Date()) {
	return parisDateKey(d);
}
function formatClock(iso) {
	const p = parisParts(new Date(iso));
	const hm = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
	const today = parisDateKey();
	const key = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
	if (key === today) return hm;
	return `${formatDate(key)} ${hm}`;
}
function formatHold(until, now = Date.now()) {
	if (until == null) return "";
	if (until === "manual") return "jusqu’à levée";
	const ms = Math.max(0, until - now);
	const m = Math.ceil(ms / 6e4);
	if (m <= 1) return "1 min";
	if (m < 60) return `${m} min`;
	const h = Math.ceil(m / 60);
	return h === 1 ? "1 h" : `${h} h`;
}
var RANKS = [
	{
		id: "fer",
		name: "Fer",
		min: 0,
		max: 39,
		color: "#8A8F98"
	},
	{
		id: "bronze",
		name: "Bronze",
		min: 40,
		max: 54,
		color: "#C47A4A"
	},
	{
		id: "argent",
		name: "Argent",
		min: 55,
		max: 74,
		color: "#C5CDD8"
	},
	{
		id: "or",
		name: "Or",
		min: 75,
		max: 99,
		color: "#E4B84A"
	},
	{
		id: "platine",
		name: "Platine",
		min: 100,
		max: 119,
		color: "#B8D4E8"
	},
	{
		id: "diamant",
		name: "Diamant",
		min: 120,
		max: 139,
		color: "#5EE0F0"
	},
	{
		id: "maitre",
		name: "Maître",
		min: 140,
		max: 159,
		color: "#9B7CFF"
	},
	{
		id: "champion",
		name: "Champion",
		min: 160,
		max: 199,
		color: "#C4454A"
	}
];
var UNRANKED = {
	id: "non-classe",
	name: "Non classé",
	min: 0,
	max: 0,
	color: "#5C6478"
};
var SCORE_FORMULA = [
	"1RM = charge × (1 + reps / 30)  ·  si 1 rep → 1RM = charge",
	"score = 100 × (1RM / réf intermédiaire Strength Level)",
	"puis × coef âge : 13–15 → 1,15 · 16–18 → 1,08 · 19–35 → 1,00 · 36–49 → 1,06 · 50+ → 1,12",
	"100 = intermédiaire Strength Level. Haltères : un haltère, pas la paire."
].join("\n");
function rankById(id) {
	if (id === "non-classe") return UNRANKED;
	return RANKS.find((r) => r.id === id) ?? RANKS[0];
}
function epley(weight, reps) {
	if (weight <= 0 || reps <= 0) return 0;
	if (reps === 1) return weight;
	return weight * (1 + reps / 30);
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function coefAge(age) {
	if (age <= 15) return 1.15;
	if (age <= 18) return 1.08;
	if (age <= 35) return 1;
	if (age <= 49) return 1.06;
	return 1.12;
}
function scoreExo(opts) {
	if (opts.epley1RM <= 0 || opts.refKg <= 0) return 0;
	return round1(round1(100 * round1(opts.epley1RM) / opts.refKg) * coefAge(opts.age));
}
function divisionFor(score, def) {
	const slice = Math.max(1, def.max - def.min + 1) / 3;
	const rel = score - def.min;
	if (rel < slice) return "III";
	if (rel < slice * 2) return "II";
	return "I";
}
function rankFromScore(score, classified) {
	if (!classified || score <= 0) return {
		def: UNRANKED,
		division: null
	};
	let current = RANKS[0];
	for (const r of RANKS) if (score >= r.min) current = r;
	return {
		def: current,
		division: divisionFor(score, current)
	};
}
function rankLabel(id, division) {
	const name = rankById(id).name;
	if (id === "non-classe" || !division) return name;
	return `${name} ${division}`;
}
function rankTier(rank, division) {
	if (rank === "non-classe") return -1;
	const i = RANKS.findIndex((r) => r.id === rank);
	const d = division === "I" ? 2 : division === "II" ? 1 : 0;
	return i * 3 + d;
}
function rose(from, to) {
	return rankTier(to.rank, to.division) > rankTier(from.rank, from.division);
}
function nextRankInfo(score, classified) {
	if (!classified || score <= 0) return {
		pct: 0,
		label: "3 exos classés pour un rang",
		nextName: null
	};
	const { def } = rankFromScore(score, true);
	const next = RANKS[RANKS.findIndex((r) => r.id === def.id) + 1];
	if (!next) return {
		pct: 100,
		label: "Palier max",
		nextName: null
	};
	const span = Math.max(.1, next.min - def.min);
	return {
		pct: Math.max(0, Math.min(100, (score - def.min) / span * 100)),
		label: `${formatFr(Math.max(0, round1(next.min - score)), 1)} pts vers ${next.name}`,
		nextName: next.name
	};
}
function bestSetForExercise(sets, workouts, userId, exerciseId, declared = []) {
	const wIds = new Set(workouts.filter((w) => w.userId === userId && w.status === "completed").map((w) => w.id));
	let best = null;
	for (const s of sets) {
		if (s.exerciseId !== exerciseId || !wIds.has(s.workoutId)) continue;
		const e = epley(s.weight, s.reps);
		if (!best || e > best.epley) best = {
			weight: s.weight,
			reps: s.reps,
			epley: e,
			at: s.completedAt
		};
	}
	for (const d of declared) {
		if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
		const e = epley(d.weight, d.reps);
		if (!best || e > best.epley) best = {
			weight: d.weight,
			reps: d.reps,
			epley: e,
			at: d.date
		};
	}
	return best;
}
function lastSetForExercise(sets, workouts, userId, exerciseId, declared = []) {
	const allowed = new Set(workouts.filter((w) => w.userId === userId && w.status !== "abandoned").map((w) => w.id));
	const mine = sets.filter((s) => s.exerciseId === exerciseId && allowed.has(s.workoutId)).map((s) => ({
		weight: s.weight,
		reps: s.reps,
		at: s.completedAt
	}));
	for (const d of declared) {
		if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
		mine.push({
			weight: d.weight,
			reps: d.reps,
			at: d.updatedAt || d.date
		});
	}
	mine.sort((a, b) => +new Date(b.at) - +new Date(a.at));
	return mine[0] ?? null;
}
function liftRankFor(user, exerciseId, sets, workouts, declared = [], pool = DEFAULT_CATALOG) {
	const ex = findExercise(exerciseId, pool);
	const classifiedLift = isClassifiedLift(exerciseId, pool);
	const refKg = ex && classifiedLift ? refForSex(ex, user.sex) : 0;
	const raw = bestSetForExercise(sets, workouts, user.id, exerciseId, declared);
	const rm = raw?.epley ?? 0;
	const rawScore = classifiedLift ? scoreExo({
		epley1RM: rm,
		refKg,
		age: user.age
	}) : 0;
	const ranked = classifiedLift && rawScore > 0;
	const score = ranked ? rawScore : 0;
	const { def, division } = rankFromScore(score, ranked);
	const label = rankLabel(def.id, division);
	const name = ex?.name ?? exerciseId;
	const sentence = raw && raw.weight > 0 ? classifiedLift ? `${name} ${formatWeight(raw.weight)} × ${raw.reps} · 1RM ${formatRm(rm)} · réf intermédiaire ${formatRm(refKg)} · score ${formatFr(score, 1)} · ${label}` : `${name} ${formatWeight(raw.weight)} × ${raw.reps} · 1RM ${formatRm(rm)} · Non classé` : `${name} — pas encore de série.`;
	return {
		exerciseId,
		name,
		classifiedLift,
		score,
		rank: def.id,
		division,
		label,
		epley: rm,
		refKg,
		bestWeight: raw?.weight ?? 0,
		bestReps: raw?.reps ?? 0,
		at: raw?.at ?? null,
		sentence
	};
}
function classifiedLoggedIds(user, sets, workouts, declared = [], pool = DEFAULT_CATALOG) {
	return classifiedIds(pool).filter((id) => {
		const lift = liftRankFor(user, id, sets, workouts, declared, pool);
		return lift.bestWeight > 0 || lift.epley > 0;
	});
}
function computeGlobalOrbit(user, sets, workouts, declared = [], pool = DEFAULT_CATALOG) {
	const lifts = classifiedLoggedIds(user, sets, workouts, declared, pool).map((id) => liftRankFor(user, id, sets, workouts, declared, pool)).filter((l) => l.classifiedLift && l.score > 0);
	lifts.sort((a, b) => b.score - a.score);
	if (lifts.length < 3) return {
		score: 0,
		rank: "non-classe",
		division: null,
		label: "Non classé",
		classified: false,
		reason: "Renseigne au moins 3 exos classés pour un rang global.",
		top: lifts
	};
	const score = round1(lifts.reduce((a, l) => a + l.score, 0) / lifts.length);
	const { def, division } = rankFromScore(score, true);
	return {
		score,
		rank: def.id,
		division,
		label: rankLabel(def.id, division),
		classified: true,
		reason: null,
		top: lifts
	};
}
function historyForExercise(userId, exerciseId, sets, workouts, declared = [], limit = 10) {
	const done = workouts.filter((w) => w.userId === userId && w.status === "completed").sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
	const out = [];
	for (const w of done) {
		const ss = sets.filter((s) => s.workoutId === w.id && s.exerciseId === exerciseId);
		if (!ss.length) continue;
		let best = ss[0];
		let bestE = epley(best.weight, best.reps);
		for (const s of ss) {
			const e = epley(s.weight, s.reps);
			if (e > bestE) {
				best = s;
				bestE = e;
			}
		}
		out.push({
			date: w.date,
			weight: best.weight,
			reps: best.reps,
			epley: bestE,
			source: "session"
		});
	}
	for (const d of declared) {
		if (d.userId !== userId || d.exerciseId !== exerciseId) continue;
		out.push({
			date: d.date,
			weight: d.weight,
			reps: d.reps,
			epley: epley(d.weight, d.reps),
			source: "declared"
		});
	}
	out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
	return out.slice(0, limit);
}
function diffRankEvents(before, after, focusId) {
	const events = [];
	const ids = focusId ? [focusId] : [...new Set([...before.lifts, ...after.lifts].map((l) => l.exerciseId))];
	for (const id of ids) {
		const b = before.lifts.find((l) => l.exerciseId === id);
		const a = after.lifts.find((l) => l.exerciseId === id);
		if (!a || !b) continue;
		if (rose(b, a)) events.push({
			kind: "exo",
			name: a.name,
			from: b.label,
			to: a.label
		});
	}
	if (rose(before.global, after.global)) events.push({
		kind: "global",
		from: before.global.label,
		to: after.global.label,
		score: after.global.score,
		rank: after.global.rank,
		division: after.global.division,
		color: rankById(after.global.rank).color
	});
	return events;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
function hashPassword(password) {
	let h = 2166136261;
	const s = `orbit.v1:${password}`;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
}
function line(exerciseId, sets, reps, restSeconds, targetKg = null) {
	return {
		exerciseId,
		sets,
		reps,
		restSeconds,
		targetKg
	};
}
var BUILTIN_PROGRAMS = [
	{
		id: "tpl-full",
		name: "Full body",
		description: "Cinq mouvements, tout le corps. Idéal 2 à 3 fois par semaine.",
		ownerId: null,
		builtin: true,
		exercises: [
			line("squat-barre", 4, 8, 120),
			line("dc-barre", 3, 8, 120),
			line("row-barre", 3, 8, 90),
			line("mil-halteres", 3, 10, 90),
			line("planche", 3, 45, 45)
		]
	},
	{
		id: "tpl-push",
		name: "Push",
		description: "Pecs, épaules, triceps. Charge sur le développé, volume sur les isolations.",
		ownerId: null,
		builtin: true,
		exercises: [
			line("dc-barre", 4, 6, 150),
			line("incl-halteres", 3, 8, 120),
			line("mil-barre", 3, 6, 150),
			line("dips-pecs", 3, 8, 90),
			line("ext-poulie", 3, 12, 60)
		]
	},
	{
		id: "tpl-pull",
		name: "Pull",
		description: "Dos et biceps. Soulevé, tractions, rowing.",
		ownerId: null,
		builtin: true,
		exercises: [
			line("sdt", 4, 5, 180),
			line("tractions-pro", 4, 6, 120),
			line("row-barre", 3, 8, 90),
			line("face-pull", 3, 15, 60),
			line("curl-barre", 3, 10, 75)
		]
	},
	{
		id: "tpl-jambes",
		name: "Jambes",
		description: "Squat lourd, postérieur de chaîne, mollets.",
		ownerId: null,
		builtin: true,
		exercises: [
			line("squat-barre", 5, 5, 180),
			line("sdt-roumain", 3, 8, 120),
			line("fentes", 3, 10, 90),
			line("hip-thrust", 3, 8, 90),
			line("curl-ischio", 3, 12, 60),
			line("mollets-debout", 4, 12, 45)
		]
	}
];
var ADMIN_HASH = hashPassword("admin123");
var ADMIN_ID = "user_admin";
function makeAdmin(now = /* @__PURE__ */ new Date()) {
	return {
		id: ADMIN_ID,
		pseudo: "admin",
		passwordHash: ADMIN_HASH,
		sex: "homme",
		age: 29,
		bodyweight: 80,
		height: 180,
		createdAt: (/* @__PURE__ */ new Date(now.getTime() - 10368e6)).toISOString(),
		isAdmin: true
	};
}
function buildBaseWorld(now = /* @__PURE__ */ new Date()) {
	return {
		users: [makeAdmin(now)],
		programs: BUILTIN_PROGRAMS.map((p) => ({
			...p,
			exercises: p.exercises.map((e) => ({ ...e }))
		})),
		catalog: cloneCatalog()
	};
}
var empty = {
	users: [],
	sessionUserId: null,
	workouts: [],
	sets: [],
	workoutExercises: [],
	programs: [],
	customExercises: [],
	posts: [],
	likes: {},
	friendsByUser: {},
	restByUser: {},
	declaredPerfs: [],
	weightLogs: [],
	catalog: [],
	messages: [],
	mutedUntil: {},
	chatClosedUntil: null,
	lastSentAt: {},
	lastText: {},
	floodUntil: {}
};
function isHeld(until, now = Date.now()) {
	if (until == null) return false;
	if (until === "manual") return true;
	return until > now;
}
function toHold(minutes) {
	if (minutes === "manual") return "manual";
	return Date.now() + minutes * 6e4;
}
function sessionUser(s) {
	return s.users.find((u) => u.id === s.sessionUserId && !u.isNpc);
}
function canMutateProgram(s, programId) {
	const user = sessionUser(s);
	const p = s.programs.find((x) => x.id === programId);
	if (!user || !p) return null;
	if (p.builtin) return user.isAdmin ? p : null;
	return p.ownerId === user.id ? p : null;
}
function applyBodyweight(s, userId, kg, date) {
	const logs = s.weightLogs.some((l) => l.userId === userId && l.date === date) ? s.weightLogs.map((l) => l.userId === userId && l.date === date ? {
		...l,
		kg
	} : l) : [...s.weightLogs, {
		id: uid(),
		userId,
		kg,
		date
	}];
	const mine = logs.filter((l) => l.userId === userId).sort((a, b) => a.date.localeCompare(b.date));
	const latest = mine[mine.length - 1];
	return {
		weightLogs: logs,
		users: s.users.map((u) => u.id === userId && latest ? {
			...u,
			bodyweight: latest.kg
		} : u)
	};
}
function classifiedCount(catalog) {
	return catalog.filter((e) => e.classified && (e.refHomme ?? 0) > 0 && (e.refFemme ?? 0) > 0).length;
}
function migrateCatalog(catalog) {
	if (!Array.isArray(catalog) || catalog.length === 0) return cloneCatalog();
	let changed = false;
	const next = catalog.map((e) => {
		const r = INTERMEDIATE_REFS[e.id];
		if (!r) return e;
		const missingRefs = !(e.refHomme > 0) || !(e.refFemme > 0);
		const classifiedUnset = e.classified == null;
		if (!missingRefs && !classifiedUnset) {
			if (e.official) return e;
			changed = true;
			return {
				...e,
				official: true
			};
		}
		changed = true;
		return {
			...e,
			official: true,
			classified: classifiedUnset ? true : !!e.classified,
			refHomme: e.refHomme > 0 ? e.refHomme : r.homme,
			refFemme: e.refFemme > 0 ? e.refFemme : r.femme
		};
	});
	const have = new Set(next.map((e) => e.id));
	for (const e of cloneCatalog()) if (!have.has(e.id)) {
		next.push(e);
		changed = true;
	}
	if (classifiedCount(next) < 1) for (let i = 0; i < next.length; i++) {
		const r = INTERMEDIATE_REFS[next[i].id];
		if (!r) continue;
		next[i] = {
			...next[i],
			classified: true,
			official: true,
			refHomme: r.homme,
			refFemme: r.femme
		};
		changed = true;
	}
	return changed ? next : catalog;
}
function purgeUserFrom(s, userId) {
	const workouts = s.workouts.filter((w) => w.userId !== userId);
	const wids = new Set(workouts.map((w) => w.id));
	const friendsByUser = {};
	for (const [k, v] of Object.entries(s.friendsByUser)) {
		if (k === userId) continue;
		friendsByUser[k] = v.filter((id) => id !== userId);
	}
	const restByUser = { ...s.restByUser };
	delete restByUser[userId];
	const mutedUntil = { ...s.mutedUntil };
	delete mutedUntil[userId];
	const lastSentAt = { ...s.lastSentAt };
	delete lastSentAt[userId];
	const lastText = { ...s.lastText };
	delete lastText[userId];
	const floodUntil = { ...s.floodUntil };
	delete floodUntil[userId];
	const likes = {};
	for (const [k, v] of Object.entries(s.likes)) likes[k] = v.filter((id) => id !== userId);
	return {
		users: s.users.filter((u) => u.id !== userId),
		workouts,
		sets: s.sets.filter((x) => wids.has(x.workoutId)),
		workoutExercises: s.workoutExercises.filter((x) => wids.has(x.workoutId)),
		programs: s.programs.filter((p) => p.builtin || p.ownerId !== userId),
		customExercises: s.customExercises.filter((e) => e.ownerId !== userId),
		posts: s.posts.filter((p) => p.authorId !== userId),
		likes,
		friendsByUser,
		restByUser,
		declaredPerfs: s.declaredPerfs.filter((d) => d.userId !== userId),
		weightLogs: s.weightLogs.filter((l) => l.userId !== userId),
		messages: s.messages.filter((m) => m.userId !== userId),
		mutedUntil,
		lastSentAt,
		lastText,
		floodUntil,
		sessionUserId: s.sessionUserId === userId ? null : s.sessionUserId
	};
}
function snap(s, user) {
	const pool = poolFrom(s);
	const lifts = pool.filter((e) => e.classified).map((e) => liftRankFor(user, e.id, s.sets, s.workouts, s.declaredPerfs, pool));
	return {
		global: computeGlobalOrbit(user, s.sets, s.workouts, s.declaredPerfs, pool),
		lifts
	};
}
var useOrbitStore = create()(persist((set, get) => ({
	...empty,
	hydrated: false,
	notice: null,
	rankQueue: [],
	markHydrated: () => set({ hydrated: true }),
	ensureSeed: () => {
		const s = get();
		const world = buildBaseWorld();
		const kept = (s.users ?? []).filter((u) => !u.isNpc && u.pseudo.toLowerCase() !== "demo" && u.id !== "user_demo").map((u) => {
			if (!u.npcLifts && !u.firstName) return u;
			const next = { ...u };
			delete next.npcLifts;
			if (next.isAdmin) delete next.firstName;
			return next;
		});
		const admin = kept.find((u) => u.isAdmin && u.pseudo === "admin") ?? makeAdmin();
		const users = [admin, ...kept.filter((u) => u.id !== admin.id && u.pseudo.toLowerCase() !== "admin")];
		const keep = new Set(users.map((u) => u.id));
		const workouts = (s.workouts ?? []).filter((w) => keep.has(w.userId));
		const wids = new Set(workouts.map((w) => w.id));
		const programs = [...BUILTIN_PROGRAMS.every((b) => (s.programs ?? []).some((p) => p.id === b.id)) ? [] : BUILTIN_PROGRAMS.filter((b) => !(s.programs ?? []).some((p) => p.id === b.id)), ...(s.programs ?? []).filter((p) => p.builtin || p.ownerId && keep.has(p.ownerId))];
		const friendsByUser = {};
		for (const u of users) friendsByUser[u.id] = (s.friendsByUser?.[u.id] ?? []).filter((id) => keep.has(id));
		const restByUser = {};
		for (const u of users) restByUser[u.id] = s.restByUser?.[u.id] ?? null;
		set({
			users,
			sessionUserId: s.sessionUserId && keep.has(s.sessionUserId) ? s.sessionUserId : null,
			workouts,
			sets: (s.sets ?? []).filter((x) => wids.has(x.workoutId)),
			workoutExercises: (s.workoutExercises ?? []).filter((x) => wids.has(x.workoutId)),
			programs: programs.length ? programs : world.programs,
			customExercises: (s.customExercises ?? []).filter((e) => !e.ownerId || keep.has(e.ownerId)),
			posts: (s.posts ?? []).filter((p) => keep.has(p.authorId)),
			likes: Object.fromEntries(Object.entries(s.likes ?? {}).map(([k, v]) => [k, v.filter((id) => keep.has(id))])),
			friendsByUser,
			restByUser,
			declaredPerfs: (s.declaredPerfs ?? []).filter((d) => keep.has(d.userId)),
			weightLogs: (s.weightLogs ?? []).filter((l) => keep.has(l.userId)),
			catalog: migrateCatalog(s.catalog),
			messages: (s.messages ?? []).filter((m) => keep.has(m.userId)),
			mutedUntil: s.mutedUntil ?? {},
			chatClosedUntil: s.chatClosedUntil ?? null,
			lastSentAt: s.lastSentAt ?? {},
			lastText: s.lastText ?? {},
			floodUntil: s.floodUntil ?? {}
		});
	},
	register: (opts) => {
		const p = opts.pseudo.trim().toLowerCase();
		if (p.length < 2) return {
			ok: false,
			error: "Pseudo trop court."
		};
		if (p === "admin" || p === "demo") return {
			ok: false,
			error: "Ce pseudo est réservé."
		};
		if (get().users.some((u) => u.pseudo.toLowerCase() === p)) return {
			ok: false,
			error: "Ce pseudo est déjà pris."
		};
		if (opts.password.length < 4) return {
			ok: false,
			error: "Mot de passe trop court."
		};
		if (!opts.sex || opts.age < 13 || opts.age > 80 || opts.height < 120 || opts.bodyweight < 30) return {
			ok: false,
			error: "Profil incomplet."
		};
		const user = {
			id: uid(),
			pseudo: opts.pseudo.trim(),
			passwordHash: hashPassword(opts.password),
			sex: opts.sex,
			age: opts.age,
			bodyweight: opts.bodyweight,
			height: opts.height,
			level: "debutant",
			goal: "force",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const today = todayKey();
		set((s) => ({
			users: [...s.users, user],
			sessionUserId: user.id,
			friendsByUser: {
				...s.friendsByUser,
				[user.id]: []
			},
			weightLogs: [...s.weightLogs, {
				id: uid(),
				userId: user.id,
				kg: opts.bodyweight,
				date: today
			}]
		}));
		return {
			ok: true,
			user
		};
	},
	login: (pseudo, password) => {
		const p = pseudo.trim().toLowerCase();
		const user = get().users.find((u) => u.pseudo.toLowerCase() === p && !u.isNpc);
		if (!user || user.passwordHash !== hashPassword(password)) return {
			ok: false,
			error: "Pseudo ou mot de passe incorrect."
		};
		set({ sessionUserId: user.id });
		return {
			ok: true,
			user
		};
	},
	logout: () => set({ sessionUserId: null }),
	updateProfile: (patch) => {
		const id = get().sessionUserId;
		if (!id) return;
		const today = todayKey();
		set((s) => {
			let extra = {};
			if (typeof patch.bodyweight === "number") extra = applyBodyweight(s, id, Math.round(patch.bodyweight * 10) / 10, today);
			const users = (extra.users ?? s.users).map((u) => u.id === id ? {
				...u,
				...patch
			} : u);
			return {
				...extra,
				users,
				notice: typeof patch.bodyweight === "number" ? "Poids mis à jour" : "Profil mis à jour"
			};
		});
	},
	changePassword: (current, next) => {
		const user = sessionUser(get());
		if (!user) return {
			ok: false,
			error: "Pas de session."
		};
		if (user.passwordHash !== hashPassword(current)) return {
			ok: false,
			error: "Mot de passe actuel incorrect."
		};
		if (next.length < 4) return {
			ok: false,
			error: "Nouveau mot de passe trop court."
		};
		set((s) => ({
			users: s.users.map((u) => u.id === user.id ? {
				...u,
				passwordHash: hashPassword(next)
			} : u),
			notice: "Mot de passe mis à jour"
		}));
		return { ok: true };
	},
	addFriend: (pseudo) => {
		const id = get().sessionUserId;
		if (!id) return {
			ok: false,
			error: "Pas de session."
		};
		const p = pseudo.trim().toLowerCase();
		const other = get().users.find((u) => u.pseudo.toLowerCase() === p && !u.isNpc);
		if (!other) return {
			ok: false,
			error: "Aucun compte avec ce pseudo."
		};
		if (other.id === id) return {
			ok: false,
			error: "C’est toi."
		};
		if ((get().friendsByUser[id] ?? []).includes(other.id)) return {
			ok: false,
			error: "Déjà dans tes amis."
		};
		set((s) => ({ friendsByUser: {
			...s.friendsByUser,
			[id]: [...s.friendsByUser[id] ?? [], other.id]
		} }));
		return { ok: true };
	},
	removeFriend: (fid) => {
		const id = get().sessionUserId;
		if (!id) return;
		set((s) => ({ friendsByUser: {
			...s.friendsByUser,
			[id]: (s.friendsByUser[id] ?? []).filter((x) => x !== fid)
		} }));
	},
	createProgram: (name, from) => {
		const userId = get().sessionUserId;
		if (!userId) return "";
		const id = uid();
		const program = {
			id,
			name: name.trim() || "Sans nom",
			description: from?.description,
			ownerId: userId,
			builtin: false,
			exercises: from ? from.exercises.map((e) => ({ ...e })) : []
		};
		set((s) => ({ programs: [...s.programs, program] }));
		return id;
	},
	createOfficialProgram: (name, description) => {
		if (!sessionUser(get())?.isAdmin) return "";
		const id = uid();
		const program = {
			id,
			name: name.trim() || "Sans nom",
			description: description?.trim() || "",
			ownerId: null,
			builtin: true,
			exercises: []
		};
		set((s) => ({ programs: [...s.programs, program] }));
		return id;
	},
	updateProgram: (id, patch) => {
		set((s) => {
			if (!canMutateProgram(s, id)) return s;
			return { programs: s.programs.map((p) => p.id === id ? {
				...p,
				...patch
			} : p) };
		});
	},
	deleteProgram: (id) => {
		set((s) => {
			const p = s.programs.find((x) => x.id === id);
			if (!p) return s;
			const user = sessionUser(s);
			if (!user) return s;
			if (p.builtin && !user.isAdmin) return s;
			if (!p.builtin && p.ownerId !== user.id) return s;
			return { programs: s.programs.filter((x) => x.id !== id) };
		});
	},
	duplicateProgram: (id) => {
		const src = get().programs.find((p) => p.id === id);
		if (!src) return "";
		return get().createProgram(`${src.name} (copie)`, src);
	},
	addExerciseToProgram: (programId, exerciseId) => {
		set((s) => {
			const p = canMutateProgram(s, programId);
			if (!p) return s;
			if (p.exercises.some((e) => e.exerciseId === exerciseId)) return s;
			const row = {
				exerciseId,
				sets: 3,
				reps: 8,
				restSeconds: findExercise(exerciseId, poolFrom(s))?.defaultRest ?? 90,
				targetKg: null
			};
			return { programs: s.programs.map((x) => x.id === programId ? {
				...x,
				exercises: [...x.exercises, row]
			} : x) };
		});
	},
	removeExerciseFromProgram: (programId, exerciseId) => {
		set((s) => {
			if (!canMutateProgram(s, programId)) return s;
			return { programs: s.programs.map((p) => p.id === programId ? {
				...p,
				exercises: p.exercises.filter((e) => e.exerciseId !== exerciseId)
			} : p) };
		});
	},
	moveProgramExercise: (programId, exerciseId, dir) => {
		set((s) => {
			const p = canMutateProgram(s, programId);
			if (!p) return s;
			const i = p.exercises.findIndex((e) => e.exerciseId === exerciseId);
			const j = i + dir;
			if (i < 0 || j < 0 || j >= p.exercises.length) return s;
			const next = [...p.exercises];
			const tmp = next[i];
			next[i] = next[j];
			next[j] = tmp;
			return { programs: s.programs.map((x) => x.id === programId ? {
				...x,
				exercises: next
			} : x) };
		});
	},
	addCustomExercise: (name, group) => {
		const id = `c_${uid()}`;
		const userId = get().sessionUserId ?? void 0;
		set((s) => ({ customExercises: [...s.customExercises, {
			id,
			name: name.trim(),
			group,
			primary: group,
			secondary: [],
			equipment: [],
			defaultRest: 90,
			instructions: "",
			difficulty: 2,
			elite1RM: 0,
			aliases: [],
			custom: true,
			official: false,
			classified: false,
			ownerId: userId
		}] }));
		return id;
	},
	deleteCustomExercise: (id) => {
		const user = sessionUser(get());
		if (!user) return;
		set((s) => ({ customExercises: s.customExercises.filter((e) => !(e.id === id && e.ownerId === user.id)) }));
	},
	createOfficialExercise: (opts) => {
		if (!sessionUser(get())?.isAdmin) return {
			ok: false,
			error: "Admin seulement."
		};
		if (!opts.name.trim()) return {
			ok: false,
			error: "Nom requis."
		};
		if (opts.classified && (!(opts.refHomme > 0) || !(opts.refFemme > 0))) return {
			ok: false,
			error: "Réf homme et femme obligatoires."
		};
		const id = `ex_${uid()}`;
		const row = {
			id,
			name: opts.name.trim(),
			group: opts.group,
			primary: opts.group,
			secondary: [],
			equipment: [],
			defaultRest: 90,
			instructions: "",
			difficulty: 2,
			elite1RM: 0,
			aliases: [],
			official: true,
			classified: opts.classified,
			refHomme: opts.classified ? opts.refHomme : void 0,
			refFemme: opts.classified ? opts.refFemme : void 0
		};
		set((s) => ({ catalog: [...s.catalog.length ? s.catalog : cloneCatalog(), row] }));
		return {
			ok: true,
			id
		};
	},
	updateOfficialExercise: (id, patch) => {
		if (!sessionUser(get())?.isAdmin) return {
			ok: false,
			error: "Admin seulement."
		};
		const s = get();
		const catalog = s.catalog.length ? s.catalog : cloneCatalog();
		const cur = catalog.find((e) => e.id === id);
		if (!cur || cur.custom) return {
			ok: false,
			error: "Exo introuvable."
		};
		const next = {
			...cur,
			...patch
		};
		if (next.classified && (!(next.refHomme > 0) || !(next.refFemme > 0))) return {
			ok: false,
			error: "Réf homme et femme obligatoires."
		};
		const would = catalog.map((e) => e.id === id ? next : e);
		if (classifiedCount(would) < 1) return {
			ok: false,
			error: "Il doit rester 1 exo classé."
		};
		set({ catalog: would });
		return { ok: true };
	},
	deleteOfficialExercise: (id) => {
		if (!sessionUser(get())?.isAdmin) return {
			ok: false,
			error: "Admin seulement."
		};
		const s = get();
		const would = (s.catalog.length ? s.catalog : cloneCatalog()).filter((e) => e.id !== id);
		if (classifiedCount(would) < 1) return {
			ok: false,
			error: "Il doit rester 1 exo classé."
		};
		set({ catalog: would });
		return { ok: true };
	},
	startWorkout: (programId) => {
		const userId = get().sessionUserId;
		if (!userId) return "";
		const existing = get().workouts.find((w) => w.userId === userId && w.status === "in_progress");
		if (existing) return existing.id;
		const program = get().programs.find((p) => p.id === programId);
		if (!program) return "";
		const id = uid();
		const now = /* @__PURE__ */ new Date();
		const workout = {
			id,
			userId,
			date: todayKey(now),
			startedAt: now.toISOString(),
			duration: 0,
			status: "in_progress",
			programId: program.id,
			programName: program.name
		};
		const we = program.exercises.map((e, order) => ({
			workoutId: id,
			exerciseId: e.exerciseId,
			order,
			plannedSets: e.sets,
			plannedReps: e.reps,
			restSeconds: e.restSeconds,
			targetKg: e.targetKg
		}));
		set((s) => ({
			workouts: [...s.workouts, workout],
			workoutExercises: [...s.workoutExercises, ...we]
		}));
		return id;
	},
	addSet: ({ workoutId, exerciseId, weight, reps }) => {
		const s = get();
		const userId = s.sessionUserId;
		if (!userId) return;
		const planned = s.workoutExercises.find((w) => w.workoutId === workoutId && w.exerciseId === exerciseId);
		const existing = s.sets.filter((x) => x.workoutId === workoutId && x.exerciseId === exerciseId);
		const rest = planned?.restSeconds ?? findExercise(exerciseId, poolFrom(s))?.defaultRest ?? 90;
		const log = {
			id: uid(),
			workoutId,
			exerciseId,
			setNumber: existing.length + 1,
			weight,
			reps,
			restSeconds: rest,
			completedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set({
			sets: [...s.sets, log],
			restByUser: {
				...s.restByUser,
				[userId]: rest > 0 ? {
					endsAt: Date.now() + rest * 1e3,
					duration: rest,
					exerciseId
				} : null
			}
		});
	},
	finishWorkout: (workoutId) => {
		const s = get();
		const workout = s.workouts.find((w) => w.id === workoutId);
		if (!workout) return;
		const duration = Math.max(60, Math.round((Date.now() - new Date(workout.startedAt).getTime()) / 1e3));
		const userId = s.sessionUserId;
		const user = sessionUser(s);
		const before = user ? snap(s, user) : null;
		const workouts = s.workouts.map((w) => w.id === workoutId ? {
			...w,
			status: "completed",
			finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
			duration
		} : w);
		const restByUser = userId ? {
			...s.restByUser,
			[userId]: null
		} : s.restByUser;
		const afterState = {
			...s,
			workouts,
			restByUser
		};
		const events = user ? diffRankEvents(before, snap(afterState, user)) : [];
		set({
			workouts,
			restByUser,
			rankQueue: events.length ? [...s.rankQueue, ...events] : s.rankQueue
		});
	},
	abandonWorkout: (id) => {
		const userId = get().sessionUserId;
		set((s) => ({
			workouts: s.workouts.map((w) => w.id === id ? {
				...w,
				status: "abandoned",
				finishedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : w),
			restByUser: userId ? {
				...s.restByUser,
				[userId]: null
			} : s.restByUser
		}));
	},
	skipRest: () => {
		const id = get().sessionUserId;
		if (!id) return;
		set((s) => ({ restByUser: {
			...s.restByUser,
			[id]: null
		} }));
	},
	createPost: ({ title, body, tag }) => {
		const s = get();
		const user = sessionUser(s);
		if (!user?.isAdmin) return;
		set({ posts: [{
			id: uid(),
			authorId: user.id,
			title: title.trim(),
			body: body.trim(),
			tag,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...s.posts] });
	},
	updatePost: (id, patch) => {
		const s = get();
		if (!sessionUser(s)?.isAdmin) return;
		set({ posts: s.posts.map((p) => p.id === id ? {
			...p,
			...patch
		} : p) });
	},
	deletePost: (id) => {
		const s = get();
		if (!sessionUser(s)?.isAdmin) return;
		const likes = { ...s.likes };
		delete likes[id];
		set({
			posts: s.posts.filter((p) => p.id !== id),
			likes
		});
	},
	toggleLike: (postId) => {
		const id = get().sessionUserId;
		if (!id) return;
		set((s) => {
			const cur = s.likes[postId] ?? [];
			const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
			return { likes: {
				...s.likes,
				[postId]: next
			} };
		});
	},
	declarePerf: ({ exerciseId, weight, reps, date }) => {
		const s = get();
		const user = sessionUser(s);
		if (!user) return {
			ok: false,
			error: "Pas de session."
		};
		const pool = poolFrom(s);
		if (!isClassifiedLift(exerciseId, pool)) return {
			ok: false,
			error: "Cet exo n’est pas classé."
		};
		if (!(weight > 0) || reps < 1 || reps > 30) return {
			ok: false,
			error: "Charge > 0 kg, reps 1–30."
		};
		const day = date.slice(0, 10);
		const row = {
			id: uid(),
			userId: user.id,
			exerciseId,
			weight,
			reps,
			date: day,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const next = s.declaredPerfs.filter((d) => !(d.userId === user.id && d.exerciseId === exerciseId && d.date === day));
		next.push(row);
		const afterState = {
			...s,
			declaredPerfs: next
		};
		const events = diffRankEvents(snap(s, user), snap(afterState, user), exerciseId);
		const lift = liftRankFor(user, exerciseId, s.sets, s.workouts, next, pool);
		const name = findExercise(exerciseId, pool)?.name ?? "exo";
		set({
			declaredPerfs: next,
			rankQueue: events.length ? [...s.rankQueue, ...events] : s.rankQueue,
			notice: events.some((e) => e.kind === "exo") ? null : `Perf ${name} enregistrée · ${lift.label}`
		});
		return {
			ok: true,
			label: lift.label
		};
	},
	upsertWeight: (kg, date) => {
		const user = sessionUser(get());
		if (!user) return {
			ok: false,
			error: "Pas de session."
		};
		if (!(kg >= 30) || kg > 250) return {
			ok: false,
			error: "Poids invalide."
		};
		const day = date.slice(0, 10);
		const rounded = Math.round(kg * 10) / 10;
		set((s) => ({
			...applyBodyweight(s, user.id, rounded, day),
			notice: "Poids mis à jour"
		}));
		return { ok: true };
	},
	sendMessage: (text) => {
		const s = get();
		const user = sessionUser(s);
		if (!user) return {
			ok: false,
			error: "Pas de session."
		};
		const now = Date.now();
		const t = text.replace(/\s+/g, " ").trim();
		if (!t) return {
			ok: false,
			error: "Message vide."
		};
		if (t.length > 200) return {
			ok: false,
			error: "200 caractères max."
		};
		if (isHeld(s.chatClosedUntil, now)) return {
			ok: false,
			error: "Chat fermé par un modo."
		};
		if (isHeld(s.mutedUntil[user.id], now)) return {
			ok: false,
			error: "Tu es muet."
		};
		if ((s.floodUntil[user.id] ?? 0) > now) return {
			ok: false,
			error: "Ralentis."
		};
		const last = s.lastSentAt[user.id] ?? 0;
		if (last && now - last < 8e3) {
			set({ floodUntil: {
				...s.floodUntil,
				[user.id]: now + 6e4
			} });
			return {
				ok: false,
				error: "Ralentis."
			};
		}
		if ((s.lastText[user.id] ?? "") === t) return {
			ok: false,
			error: "Pas le même message."
		};
		const msg = {
			id: uid(),
			userId: user.id,
			text: t,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set({
			messages: [...s.messages, msg],
			lastSentAt: {
				...s.lastSentAt,
				[user.id]: now
			},
			lastText: {
				...s.lastText,
				[user.id]: t
			}
		});
		return { ok: true };
	},
	deleteMessage: (id) => {
		if (!sessionUser(get())?.isAdmin) return;
		set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
	},
	muteUser: (userId, minutes) => {
		const user = sessionUser(get());
		if (!user?.isAdmin) return;
		if (userId === user.id || userId === "user_admin") return;
		set((s) => ({ mutedUntil: {
			...s.mutedUntil,
			[userId]: toHold(minutes)
		} }));
	},
	unmuteUser: (userId) => {
		if (!sessionUser(get())?.isAdmin) return;
		set((s) => {
			const mutedUntil = { ...s.mutedUntil };
			delete mutedUntil[userId];
			return { mutedUntil };
		});
	},
	closeChat: (minutes) => {
		if (!sessionUser(get())?.isAdmin) return;
		set({ chatClosedUntil: toHold(minutes) });
	},
	openChat: () => {
		if (!sessionUser(get())?.isAdmin) return;
		set({ chatClosedUntil: null });
	},
	deleteAccount: (userId) => {
		const user = sessionUser(get());
		if (!user?.isAdmin) return {
			ok: false,
			error: "Admin seulement."
		};
		const target = get().users.find((u) => u.id === userId);
		if (!target) return {
			ok: false,
			error: "Compte introuvable."
		};
		if (target.isAdmin || target.id === user.id || target.pseudo === "admin") return {
			ok: false,
			error: "Impossible de supprimer l’admin."
		};
		set((s) => ({
			...purgeUserFrom(s, userId),
			notice: `@${target.pseudo} supprimé`
		}));
		return { ok: true };
	},
	dismissNotice: () => set({ notice: null }),
	shiftRankEvent: () => set((s) => ({ rankQueue: s.rankQueue.slice(1) }))
}), {
	name: "orbit-v7",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (s) => ({
		users: s.users,
		sessionUserId: s.sessionUserId,
		workouts: s.workouts,
		sets: s.sets,
		workoutExercises: s.workoutExercises,
		programs: s.programs,
		customExercises: s.customExercises,
		posts: s.posts,
		likes: s.likes,
		friendsByUser: s.friendsByUser,
		restByUser: s.restByUser,
		declaredPerfs: s.declaredPerfs,
		weightLogs: s.weightLogs,
		catalog: s.catalog,
		messages: s.messages,
		mutedUntil: s.mutedUntil,
		chatClosedUntil: s.chatClosedUntil,
		lastSentAt: s.lastSentAt,
		lastText: s.lastText,
		floodUntil: s.floodUntil
	})
}));
function useSessionUser() {
	return useOrbitStore((s) => s.users.find((u) => u.id === s.sessionUserId && !u.isNpc) ?? null);
}
function usePool() {
	return poolFrom({
		catalog: useOrbitStore((s) => s.catalog),
		customExercises: useOrbitStore((s) => s.customExercises)
	});
}
//#endregion
export { lastSetForExercise as A, todayKey as B, formatSeries as C, historyForExercise as D, formatWeight as E, rankLabel as F, usePool as H, refForSex as I, roundKg as L, nextRankInfo as M, poolFrom as N, isClassifiedLift as O, rankById as P, scoreExo as R, formatRm as S, formatVolume as T, useSessionUser as U, useOrbitStore as V, formatDuration as _, classifiedExercises as a, formatHold as b, computeGlobalOrbit as c, formatAge as d, formatBodyweight as f, formatDateLong as g, formatDateFull as h, allExercises as i, liftRankFor as j, isHeld as k, epley as l, formatDate as m, GROUP_LABEL as n, classifiedIds as o, formatClock as p, SCORE_FORMULA as r, cn as s, CATALOG_GROUPS as t, findExercise as u, formatFr as v, formatSet as w, formatRest as x, formatHeight as y, searchExercises as z };
