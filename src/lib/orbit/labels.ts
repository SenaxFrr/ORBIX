import type { Goal, Level, PostTag, Sex } from "./types";

export const SEX_LABEL: Record<Sex, string> = {
  homme: "Homme",
  femme: "Femme",
  autre: "Autre",
};

export const LEVEL_LABEL: Record<Level, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export const GOAL_LABEL: Record<Goal, string> = {
  force: "Force",
  hypertrophie: "Hypertrophie",
  perte: "Perte de gras",
  athletique: "Athlétique",
};

export const TAG_LABEL: Record<PostTag, string> = {
  Annonce: "Annonce",
  Programme: "Programme",
  Conseils: "Conseils",
  Event: "Event",
};
