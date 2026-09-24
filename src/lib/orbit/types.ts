export type Sex = "homme" | "femme" | "autre";
export type Level = "debutant" | "intermediaire" | "avance";
export type Goal = "force" | "hypertrophie" | "perte" | "athletique";
export type ThemeId = "or" | "teal" | "violet" | "rouge" | "bleu" | "vert";
export type ThemeMode = "sombre" | "clair";
export type MuscleGroup =
  | "pectoraux"
  | "dos"
  | "epaules"
  | "jambes"
  | "fessiers"
  | "biceps"
  | "triceps"
  | "core"
  | "cardio"
  | "poids-du-corps";
export type Equipment =
  | "barre"
  | "halteres"
  | "machine"
  | "pdc"
  | "elastiques"
  | "poulie"
  | "banc"
  | "kettlebell";
export type RankId =
  | "non-classe"
  | "fer"
  | "bronze"
  | "argent"
  | "or"
  | "platine"
  | "diamant"
  | "maitre"
  | "champion";
export type Division = "III" | "II" | "I";
export type PostTag = "Annonce" | "Programme" | "Conseils" | "Event";

export interface User {
  id: string;
  pseudo: string;
  passwordHash: string;
  firstName?: string;
  sex: Sex;
  age: number;
  bodyweight: number;
  height: number;
  level?: Level;
  goal?: Goal;
  theme?: ThemeId;
  themeAccent?: ThemeId;
  themeMode?: ThemeMode;
  bio?: string;
  createdAt: string;
  isAdmin?: boolean;
  isNpc?: boolean;
  npcLifts?: Record<string, { weight: number; reps: number }>;
}

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  primary: string;
  secondary: string[];
  equipment: Equipment[];
  defaultRest: number;
  instructions: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  elite1RM: number;
  aliases: string[];
  custom?: boolean;
  official?: boolean;
  classified?: boolean;
  refHomme?: number;
  refFemme?: number;
  ownerId?: string;
}

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
  targetKg: number | null;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  ownerId: string | null;
  builtin: boolean;
  exercises: ProgramExercise[];
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  startedAt: string;
  finishedAt?: string;
  duration: number;
  status: "in_progress" | "completed" | "abandoned";
  programId?: string;
  programName: string;
}

export interface WorkoutExercise {
  workoutId: string;
  exerciseId: string;
  order: number;
  plannedSets: number;
  plannedReps: number;
  restSeconds: number;
  targetKg: number | null;
}

export interface SetLog {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  restSeconds: number;
  completedAt: string;
}

export interface DeclaredPerf {
  id: string;
  userId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
  updatedAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  kg: number;
  date: string;
}

export interface RestState {
  endsAt: number;
  duration: number;
  exerciseId: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  tag: PostTag | null;
  createdAt: string;
}

export interface RankDef {
  id: RankId;
  name: string;
  min: number;
  max: number;
  color: string;
}

export interface LiftRank {
  exerciseId: string;
  name: string;
  classifiedLift: boolean;
  score: number;
  rank: RankId;
  division: Division | null;
  label: string;
  epley: number;
  refKg: number;
  bestWeight: number;
  bestReps: number;
  at: string | null;
  sentence: string;
}

export interface GlobalOrbit {
  score: number;
  rank: RankId;
  division: Division | null;
  label: string;
  classified: boolean;
  reason: string | null;
  top: LiftRank[];
}

export interface LiftHistoryRow {
  date: string;
  weight: number;
  reps: number;
  epley: number;
  source: "session" | "declared";
}

export type RankEvent =
  | { kind: "exo"; name: string; from: string; to: string; color: string }
  | {
      kind: "global";
      from: string;
      to: string;
      score: number;
      rank: RankId;
      division: Division | null;
      color: string;
    };

export type HoldUntil = number | "manual";

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
  readAt: number;
}

export interface SupportMessage {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
  readAt: number;
}

export interface FriendRequest {
  id: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface StarterPerf {
  exerciseId: string;
  weight: number;
  reps: number;
}

