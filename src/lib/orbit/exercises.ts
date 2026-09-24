import type { Equipment, Exercise, MuscleGroup, Sex } from "./types";

type Diff = 1 | 2 | 3 | 4 | 5;

function ex(
  id: string,
  name: string,
  group: MuscleGroup,
  primary: string,
  secondary: string[],
  equipment: Equipment[],
  defaultRest: number,
  instructions: string,
  difficulty: Diff,
  elite1RM: number,
  aliases: string[] = [],
): Exercise {
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
    aliases,
  };
}

export const EXERCISES: Exercise[] = [
  // —— Pectoraux
  ex("dc-barre", "Développé couché barre", "pectoraux", "pectoraux", ["triceps", "epaules"], ["barre", "banc"], 150, "Omoplates serrées, pieds ancrés. Barre au bas des pecs, lockout sans rebond.", 3, 180, ["bench", "dc", "bench press", "développé couché"]),
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

  // —— Dos
  ex("sdt", "Soulevé de terre", "dos", "dos", ["jambes", "fessiers"], ["barre"], 180, "Barre collée aux tibias. Hanches et épaules montent ensemble. Lockout sans cambrer.", 5, 280, ["deadlift", "sdt", "dl"]),
  ex("sdt-roumain", "Soulevé de terre roumain", "dos", "ischio", ["fessiers", "dos"], ["barre"], 120, "Genoux souples, hanche recule. Barre rase les cuisses.", 3, 220, ["rdl", "roumain"]),
  ex("row-barre", "Rowing barre", "dos", "dorsaux", ["biceps", "rhomboides"], ["barre"], 120, "Buste ~30°. Tire vers le bas du sternum, coudes près du corps.", 3, 180, ["barbell row", "rowing"]),
  ex("row-haltere", "Rowing haltère", "dos", "dorsaux", ["biceps"], ["halteres", "banc"], 90, "Appui sur banc. Coude au plafond, omoplate serrée.", 2, 90, ["db row"]),
  ex("row-poulie", "Rowing poulie basse", "dos", "dorsaux", ["biceps"], ["poulie"], 90, "Torse droit. Tire vers le nombril, pause d’une seconde.", 2, 140, ["cable row", "tirage horizontal"]),
  ex("tirage-vert", "Tirage vertical", "dos", "dorsaux", ["biceps"], ["machine", "poulie"], 90, "Poitrine haute. Barre à la clavicule, pas derrière la nuque.", 2, 140, ["lat pulldown", "tirage"]),
  ex("tirage-horiz", "Tirage horizontal machine", "dos", "dorsaux", ["rhomboides"], ["machine"], 75, "Poitrine contre le pad. Serre les omoplates sans haussement.", 2, 150, []),
  ex("tractions-pro", "Tractions pronation", "dos", "dorsaux", ["biceps"], ["pdc"], 150, "Épaules basses avant de tirer. Menton au-dessus, descente contrôlée.", 4, 140, ["pull up", "tractions", "pullup"]),
  ex("tractions-sup", "Tractions supination", "dos", "dorsaux", ["biceps"], ["pdc"], 120, "Prise en supination, légèrement plus étroite. Même consigne d’épaules.", 3, 150, ["chin up", "chinup"]),
  ex("shrug", "Shrugs", "dos", "trapezes", [], ["barre", "halteres"], 75, "Élève les épaules verticalement. Pas de rotation.", 1, 220, ["shrug", "haussement"]),
  ex("face-pull", "Face pull", "dos", "rear delt", ["trapezes"], ["poulie", "elastiques"], 60, "Tire vers le visage, rotation externe. Coudes hauts.", 2, 70, ["face pull"]),
  ex("good-morning", "Good morning", "dos", "lombaires", ["ischio"], ["barre"], 90, "Barre haute. Hanche recule, dos neutre, regard fixe.", 4, 140, []),
  ex("tbar-row", "T-bar row", "dos", "dorsaux", ["rhomboides"], ["barre", "machine"], 90, "Poitrine ouverte. Amplitude complète, pas d’élan lombaire.", 3, 170, ["tbar"]),
  ex("pullover-poulie", "Pullover poulie", "dos", "dorsaux", ["pectoraux"], ["poulie"], 60, "Bras presque tendus. Descends vers les hanches.", 2, 80, []),

  // —— Épaules
  ex("mil-barre", "Développé militaire", "epaules", "deltoides", ["triceps"], ["barre"], 150, "Barre au haut de la poitrine. Pousse à la verticale, fessiers serrés.", 4, 110, ["ohp", "militaire", "overhead press", "développé militaire"]),
  ex("mil-halteres", "Développé haltères assis", "epaules", "deltoides", ["triceps"], ["halteres", "banc"], 120, "Dos collé. Haltères au-dessus de la tête, sans se cambrer.", 3, 90, ["db press"]),
  ex("arnold", "Arnold press", "epaules", "deltoides", ["triceps"], ["halteres"], 90, "Rotation paumes-visage vers l’avant pendant la poussée.", 3, 80, ["arnold"]),
  ex("elev-lat", "Élévations latérales", "epaules", "deltoide moyen", [], ["halteres", "elastiques"], 60, "Coudes souples, petit doigt légèrement plus haut. Stop à l’horizontale.", 2, 40, ["lateral raise", "élévations"]),
  ex("elev-front", "Élévations frontales", "epaules", "deltoide antérieur", [], ["halteres"], 60, "Un bras ou deux, jusqu’au niveau des yeux. Pas de swing.", 1, 40, []),
  ex("oiseau", "Oiseau", "epaules", "deltoide postérieur", ["rhomboides"], ["halteres"], 60, "Buste penché. Ouvre les bras dans l’alignement des épaules.", 2, 40, ["reverse fly", "oiseau"]),
  ex("upright-row", "Tirage menton", "epaules", "deltoides", ["trapezes"], ["barre"], 75, "Prise large. Coudes plus hauts que les poignets. Stop aux pecs.", 3, 90, ["upright row"]),
  ex("machine-shoulder", "Développé épaules machine", "epaules", "deltoides", ["triceps"], ["machine"], 90, "Dossier réglé : poignées au niveau des oreilles.", 2, 100, []),
  ex("cuban", "Cuban press", "epaules", "rotateurs", ["deltoides"], ["halteres"], 75, "Tirage menton puis rotation externe et press. Léger.", 3, 35, []),
  ex("rear-delt-machine", "Rear delt machine", "epaules", "deltoide postérieur", [], ["machine"], 60, "Poitrine contre le pad. Ouvre sans haussement.", 1, 70, []),

  // —— Jambes
  ex("squat-barre", "Squat", "jambes", "quadriceps", ["fessiers", "core"], ["barre"], 180, "Barre haute ou basse. Genoux dans l’axe, profondeur au moins parallèle.", 5, 250, ["squat", "back squat", "squat barre"]),
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

  // —— Fessiers
  ex("hip-thrust", "Hip thrust barre", "fessiers", "fessiers", ["ischio"], ["barre", "banc"], 90, "Menton rentré. Extension de hanche complète, pause en haut.", 3, 220, ["hip thrust"]),
  ex("pont", "Pont fessier", "fessiers", "fessiers", ["ischio"], ["pdc"], 45, "Pieds près des fessiers. Monte sans cambrer le bas du dos.", 1, 140, ["glute bridge"]),
  ex("kickback", "Kickback", "fessiers", "fessiers", [], ["poulie", "elastiques"], 45, "Jambe tendue vers l’arrière, bassin fixe.", 1, 50, []),
  ex("abduct", "Abduction hanche", "fessiers", "moyen fessier", [], ["machine", "elastiques"], 45, "Pousse contre la résistance sans basculer le buste.", 1, 80, []),
  ex("step-up", "Step-up", "fessiers", "fessiers", ["quadriceps"], ["halteres", "pdc"], 60, "Pousse dans le talon du pied haut. Contrôle la descente.", 2, 80, []),
  ex("hyperext", "Hyperextensions", "fessiers", "fessiers", ["lombaires"], ["machine", "pdc"], 60, "Enroule jusqu’à l’alignement. Pas d’hyperextension lombaire.", 2, 100, ["back extension"]),

  // —— Biceps
  ex("curl-barre", "Curl biceps", "biceps", "biceps", [], ["barre"], 75, "Coudes collés. Pas de balancier. Squeeze en haut.", 2, 70, ["barbell curl", "curl", "curl barre", "curl biceps"]),
  ex("curl-haltere", "Curl haltères", "biceps", "biceps", [], ["halteres"], 60, "Supination en montant. Épaules basses.", 2, 40, ["db curl"]),
  ex("curl-marteau", "Curl marteau", "biceps", "brachial", ["avant-bras"], ["halteres"], 60, "Prise neutre. Monte sans avancer le coude.", 2, 45, ["hammer curl"]),
  ex("curl-pupitre", "Curl pupitre", "biceps", "biceps", [], ["barre", "machine"], 75, "Aisselles contre le pupitre. Amplitude complète.", 2, 55, ["preacher"]),
  ex("curl-poulie", "Curl poulie", "biceps", "biceps", [], ["poulie"], 45, "Tension continue. Coudes fixes.", 1, 50, []),
  ex("curl-incline", "Curl incliné", "biceps", "biceps", [], ["halteres", "banc"], 75, "Banc 45°. Étirement long, pas d’élan.", 3, 35, []),
  ex("curl-concentre", "Curl concentration", "biceps", "biceps", [], ["halteres"], 45, "Coude contre la cuisse intérieure. Isolation stricte.", 1, 30, []),

  // —— Triceps
  ex("barre-front", "Barre au front", "triceps", "triceps", [], ["barre", "banc"], 75, "Coudes fixes. Barre au front ou derrière la tête, selon mobilité.", 3, 80, ["skullcrusher", "barre au front"]),
  ex("ext-poulie", "Extension poulie", "triceps", "triceps", [], ["poulie"], 45, "Épaules basses. Extension complète, poignets neutres.", 1, 70, ["pushdown", "extension triceps"]),
  ex("ext-nuque", "Extension haltère nuque", "triceps", "triceps", [], ["halteres"], 75, "Coudes au plafond. Descends derrière la tête, reviens sans écarter.", 2, 50, ["overhead tricep"]),
  ex("dips-tri", "Dips triceps", "triceps", "triceps", ["pectoraux"], ["pdc"], 75, "Buste droit, coudes près du corps.", 3, 130, []),
  ex("kickback-tri", "Kickback triceps", "triceps", "triceps", [], ["halteres"], 45, "Bras collé au flanc. Extension complète, pause.", 1, 25, []),
  ex("dc-prise-serree", "Développé prise serrée", "triceps", "triceps", ["pectoraux"], ["barre", "banc"], 120, "Prise largeur épaules. Coudes le long du buste.", 3, 160, ["close grip bench"]),
  ex("overlay-poulie", "Extension poulie corde", "triceps", "triceps", [], ["poulie"], 45, "Écarte la corde en bas. Tension continue.", 1, 60, []),

  // —— Core
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

  // —— Cardio
  ex("tapis", "Course tapis", "cardio", "cardio", ["jambes"], ["machine"], 0, "Logue la vitesse en kg (ex. 12) et les minutes en reps.", 2, 0, ["run", "course"]),
  ex("velo", "Vélo", "cardio", "cardio", ["jambes"], ["machine"], 0, "Cadence stable. Kg = résistance, reps = minutes.", 1, 0, ["bike", "vélo"]),
  ex("rameur", "Rameur", "cardio", "cardio", ["dos", "jambes"], ["machine"], 0, "Jambes puis buste puis bras. Kg = split/10, reps = minutes.", 3, 0, ["row", "rameur"]),
  ex("corde", "Corde à sauter", "cardio", "cardio", ["mollets"], ["pdc"], 0, "Rebonds bas, poignets souples. Reps = sauts ou minutes × 10.", 2, 0, []),
  ex("assault", "Assault bike", "cardio", "cardio", ["corps entier"], ["machine"], 0, "Pousse et tire. Effort calibré. Reps = calories ou minutes.", 4, 0, ["air bike"]),
  ex("elliptique", "Elliptique", "cardio", "cardio", ["jambes"], ["machine"], 0, "Posture haute, sans s’appuyer sur les mains.", 1, 0, []),

  // —— Poids du corps
  ex("burpees", "Burpees", "poids-du-corps", "corps entier", ["cardio"], ["pdc"], 45, "Poitrine au sol, saut franc. Rythme soutenable.", 3, 0, ["burpee"]),
  ex("pompes-diamant", "Pompes diamant", "poids-du-corps", "triceps", ["pectoraux"], ["pdc"], 60, "Pouces et index se touchent. Coudes le long du buste.", 3, 100, []),
  ex("pike-push", "Pike push-up", "poids-du-corps", "deltoides", ["triceps"], ["pdc"], 75, "Fesses hautes. Tête vers le sol, pousse verticale.", 4, 90, []),
  ex("nordic", "Nordic curl", "poids-du-corps", "ischio", [], ["pdc"], 90, "Descente ultra lente. Pousse les mains au dernier moment.", 5, 0, []),
  ex("pistol", "Pistol squat", "poids-du-corps", "quadriceps", ["fessiers"], ["pdc"], 90, "Jambe tendue devant. Contrôle, talon collé.", 5, 80, []),
  ex("hollow", "Hollow hold", "poids-du-corps", "transverse", [], ["pdc"], 45, "Bas du dos collé. Bras et jambes longs. Reps = secondes.", 3, 0, []),
  ex("lsit", "L-sit", "poids-du-corps", "core", ["triceps"], ["pdc"], 45, "Épaules basses, jambes tendues. Reps = secondes.", 5, 0, []),
  ex("inverted-row", "Rowing inversé", "poids-du-corps", "dorsaux", ["biceps"], ["pdc", "barre"], 75, "Corps gainé. Poitrine à la barre, descente lente.", 3, 110, ["inverted row"]),
  ex("jump-squat", "Squat sauté", "poids-du-corps", "quadriceps", ["cardio"], ["pdc"], 45, "Réception souple. Genoux stables.", 3, 0, []),
  ex("pompes-archer", "Pompes archer", "poids-du-corps", "pectoraux", ["triceps"], ["pdc"], 75, "Un bras travaille, l’autre guide. Alterne.", 4, 110, []),
];

export const GROUP_LABEL: Record<MuscleGroup, string> = {
  pectoraux: "Pecs",
  dos: "Dos",
  epaules: "Épaules",
  jambes: "Jambes",
  fessiers: "Fessiers",
  biceps: "Biceps",
  triceps: "Triceps",
  core: "Core",
  cardio: "Cardio",
  "poids-du-corps": "Poids du corps",
};

export const CATALOG_GROUPS: { id: string; label: string; match: MuscleGroup[] }[] = [
  { id: "pectoraux", label: "Pecs", match: ["pectoraux"] },
  { id: "dos", label: "Dos", match: ["dos"] },
  { id: "epaules", label: "Épaules", match: ["epaules"] },
  { id: "jambes", label: "Jambes", match: ["jambes", "fessiers"] },
  { id: "bras", label: "Bras", match: ["biceps", "triceps"] },
  { id: "core", label: "Core", match: ["core"] },
  { id: "poids-du-corps", label: "Poids du corps", match: ["poids-du-corps"] },
];

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  barre: "Barre",
  halteres: "Haltères",
  machine: "Machine",
  pdc: "Poids du corps",
  elastiques: "Élastiques",
  poulie: "Poulie",
  banc: "Banc",
  kettlebell: "Kettlebell",
};

/** 8 classés officiels au load. */
export const CLASSIFIED_LIFTS = [
  "dc-barre",
  "dc-halteres",
  "squat-barre",
  "presse",
  "mil-barre",
  "tirage-vert",
  "curl-barre",
  "curl-marteau",
] as const;

export type ClassifiedLiftId = (typeof CLASSIFIED_LIFTS)[number];

/**
 * 1RM intermédiaire Strength Level (kg). Ne pas modifier.
 * Haltères = un haltère, pas la paire.
 */
export const INTERMEDIATE_REFS: Record<string, { homme: number; femme: number }> = {
  "squat-barre": { homme: 130, femme: 73 },
  "dc-barre": { homme: 98, femme: 51 },
  "dc-halteres": { homme: 40, femme: 20 },
  presse: { homme: 227, femme: 151 },
  "mil-barre": { homme: 65, femme: 35 },
  "tirage-vert": { homme: 82, femme: 48 },
  "curl-barre": { homme: 45, femme: 24 },
  "curl-marteau": { homme: 41, femme: 26 },
};

export const DEFAULT_CATALOG: Exercise[] = EXERCISES.map((e) => {
  const r = INTERMEDIATE_REFS[e.id];
  return {
    ...e,
    official: true,
    classified: !!r,
    refHomme: r?.homme,
    refFemme: r?.femme,
  };
});

export function cloneCatalog(): Exercise[] {
  return DEFAULT_CATALOG.map((e) => ({
    ...e,
    secondary: [...e.secondary],
    equipment: [...e.equipment],
    aliases: [...e.aliases],
  }));
}

export function poolOf(catalog: Exercise[] = [], custom: Exercise[] = []): Exercise[] {
  return [...(catalog.length ? catalog : DEFAULT_CATALOG), ...custom];
}

export function poolFrom(s: { catalog?: Exercise[] | null; customExercises?: Exercise[] | null }): Exercise[] {
  return poolOf(s.catalog?.length ? s.catalog : DEFAULT_CATALOG, s.customExercises ?? []);
}


export function classifiedExercises(pool: Exercise[] = DEFAULT_CATALOG): Exercise[] {
  return poolOf(pool, []).filter((e) => e.classified && (e.refHomme ?? 0) > 0 && (e.refFemme ?? 0) > 0);
}

export function classifiedIds(pool: Exercise[] = DEFAULT_CATALOG): string[] {
  return classifiedExercises(pool).map((e) => e.id);
}

export function isClassifiedLift(id: string, pool: Exercise[] = []): boolean {
  const ex = findExercise(id, pool);
  return !!ex?.classified && (ex.refHomme ?? 0) > 0 && (ex.refFemme ?? 0) > 0;
}

export function refForSex(ex: Exercise, sex: Sex): number {
  const h = ex.refHomme ?? 0;
  const f = ex.refFemme ?? 0;
  if (sex === "femme") return f;
  if (sex === "autre") return Math.round(((h + f) / 2) * 10) / 10;
  return h;
}

export function allExercises(catalog: Exercise[] = [], custom: Exercise[] = []): Exercise[] {
  return poolOf(catalog, custom);
}

export function findExercise(id: string, pool: Exercise[] = []): Exercise | undefined {
  return pool.find((e) => e.id === id) ?? DEFAULT_CATALOG.find((e) => e.id === id);
}

export function searchExercises(q: string, catalog: Exercise[] = [], custom: Exercise[] = []): Exercise[] {
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

export function matchExerciseName(raw: string, catalog: Exercise[] = [], custom: Exercise[] = []): Exercise | undefined {
  const s = raw.trim().toLowerCase();
  const pool = poolOf(catalog, custom);
  return (
    pool.find((e) => e.name.toLowerCase() === s) ||
    pool.find((e) => e.aliases.some((a) => a.toLowerCase() === s)) ||
    pool.find((e) => e.name.toLowerCase().includes(s) || s.includes(e.name.toLowerCase())) ||
    pool.find((e) => e.aliases.some((a) => a.toLowerCase().includes(s) || s.includes(a.toLowerCase())))
  );
}
