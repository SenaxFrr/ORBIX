import type { Program, ProgramExercise } from "./types";

function line(
  exerciseId: string,
  sets: number,
  reps: number,
  restSeconds: number,
  targetKg: number | null = null,
): ProgramExercise {
  return { exerciseId, sets, reps, restSeconds, targetKg };
}

export const BUILTIN_PROGRAMS: Program[] = [
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
      line("planche", 3, 45, 45),
    ],
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
      line("ext-poulie", 3, 12, 60),
    ],
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
      line("curl-barre", 3, 10, 75),
    ],
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
      line("mollets-debout", 4, 12, 45),
    ],
  },
];

export function findProgram(id: string, all: Program[]): Program | undefined {
  return all.find((p) => p.id === id) ?? BUILTIN_PROGRAMS.find((p) => p.id === id);
}
