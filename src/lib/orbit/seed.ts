import { hashPassword } from "@/lib/utils";
import { cloneCatalog } from "./exercises";
import { BUILTIN_PROGRAMS } from "./programs";
import type { Exercise, Program, User } from "./types";

const ADMIN_HASH = hashPassword("admin123");

export const ADMIN_ID = "user_admin";

export function makeAdmin(now = new Date()): User {
  return {
    id: ADMIN_ID,
    pseudo: "admin",
    passwordHash: ADMIN_HASH,
    sex: "homme",
    age: 29,
    bodyweight: 80,
    height: 180,
    createdAt: new Date(now.getTime() - 120 * 86400000).toISOString(),
    lastSeenAt: 0,
    isAdmin: true,
  };
}

export interface SeedWorld {
  users: User[];
  programs: Program[];
  catalog: Exercise[];
}

export function buildBaseWorld(now = new Date()): SeedWorld {
  const admin = makeAdmin(now);
  return {
    users: [admin],
    programs: BUILTIN_PROGRAMS.map((p) => ({ ...p, exercises: p.exercises.map((e) => ({ ...e })) })),
    catalog: cloneCatalog(),
  };
}
