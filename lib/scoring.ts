/**
 * Moteur de recommandation déterministe (Phase 1).
 *
 * Croise le profil issu du questionnaire avec les attributs des véhicules du
 * catalogue, en tenant compte des pondérations de l'étape 5 (priorités).
 *
 * Le score final est ramené sur 100. On applique aussi des filtres « durs »
 * (places insuffisantes, énergie incompatible avec la recharge, etc.) qui
 * pénalisent fortement un modèle plutôt que de l'exclure brutalement, afin de
 * toujours pouvoir proposer une short-list.
 */

import type {
  Critere,
  Energie,
  ProfilUtilisateur,
  RecommandationModele,
  Vehicule,
} from "./types";

/** Borne une note dans [0, 1]. */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Transforme l'ordre des priorités (étape 5) en poids normalisés.
 * Le 1er critère pèse le plus, le dernier le moins ; les critères absents
 * reçoivent un poids faible mais non nul.
 */
function poidsCriteres(ordre: Critere[]): Record<Critere, number> {
  const tous: Critere[] = [
    "prix",
    "fiabilite",
    "consommation",
    "ecologie",
    "confort",
    "securite",
    "style",
    "revente",
  ];
  const poids = {} as Record<Critere, number>;
  const n = ordre.length || 1;
  ordre.forEach((c, i) => {
    poids[c] = (n - i) / n; // 1er → 1, dernier → 1/n
  });
  // Critères non classés : poids plancher.
  tous.forEach((c) => {
    if (poids[c] === undefined) poids[c] = 0.15;
  });
  return poids;
}

/** Estime un prix de référence du véhicule selon l'état souhaité. */
export function prixReference(
  vehicule: Vehicule,
  etat: ProfilUtilisateur["etat"],
): { min: number; max: number; neuf: boolean } {
  if (etat === "occasion-recente") {
    return { min: vehicule.prixOccasionMin, max: vehicule.prixOccasionMax, neuf: false };
  }
  if (etat === "neuf") {
    return { min: vehicule.prixNeufMin, max: vehicule.prixNeufMax, neuf: true };
  }
  // Indifférent : on retient l'occasion récente, plus accessible.
  return { min: vehicule.prixOccasionMin, max: vehicule.prixOccasionMax, neuf: false };
}

/** Budget cible déduit du profil (pour comparer aux prix des modèles). */
function budgetCible(profil: ProfilUtilisateur): number | undefined {
  if (profil.modeBudget === "total" && profil.budgetTotal) {
    return profil.budgetTotal + (profil.valeurReprise ?? 0);
  }
  if (profil.modeBudget === "mensualite" && profil.mensualiteMax) {
    // Approximation : mensualité × 48 mois + apport → enveloppe budgétaire.
    return profil.mensualiteMax * 48 + (profil.apport ?? 0);
  }
  return undefined;
}

/**
 * Choisit l'énergie la plus pertinente du véhicule pour ce profil.
 * Tient compte de la possibilité de recharge et du kilométrage.
 */
function energieConseillee(
  vehicule: Vehicule,
  profil: ProfilUtilisateur,
): Energie {
  const dispo = vehicule.energiesDisponibles;
  const peutRecharger = profil.rechargeDomicile === "oui";
  const grosRouleur =
    profil.kilometrageAnnuel === "20000-30000" ||
    profil.kilometrageAnnuel === "plus-30000";
  const petitRouleur =
    profil.kilometrageAnnuel === "moins-5000" ||
    profil.kilometrageAnnuel === "5000-10000";

  // Si l'utilisateur a exprimé des préférences, on les respecte d'abord.
  const prefs = profil.energies;
  const candidates = prefs.length
    ? dispo.filter((e) => prefs.includes(e))
    : dispo;
  const pool = candidates.length ? candidates : dispo;

  // Ordre de préférence selon le contexte.
  const ordre: Energie[] = [];
  if (peutRecharger && !grosRouleur) {
    ordre.push("electrique", "hybride-rechargeable", "hybride");
  } else if (peutRecharger) {
    ordre.push("hybride-rechargeable", "hybride", "electrique");
  } else {
    ordre.push("hybride", "essence");
  }
  if (grosRouleur) ordre.push("diesel");
  if (petitRouleur) ordre.push("essence");
  ordre.push("essence", "diesel", "hybride", "hybride-rechargeable", "electrique");

  for (const e of ordre) {
    if (pool.includes(e)) return e;
  }
  return pool[0];
}

/**
 * Calcule le score d'adéquation (0 → 100) d'un véhicule pour un profil donné,
 * et fournit les sous-scores utiles à la génération de l'explication.
 */
function scorerVehicule(
  vehicule: Vehicule,
  profil: ProfilUtilisateur,
  poids: Record<Critere, number>,
) {
  const prix = prixReference(vehicule, profil.etat);
  const energie = energieConseillee(vehicule, profil);

  // --- Sous-scores par critère (chacun dans [0, 1]) ----------------------

  // Prix : 1 si dans le budget, dégradé au-delà.
  const budget = budgetCible(profil);
  let scorePrix = 0.6;
  if (budget) {
    const prixMoyen = (prix.min + prix.max) / 2;
    scorePrix = prixMoyen <= budget ? 1 : clamp01(1 - (prixMoyen - budget) / budget);
  }

  const scoreFiabilite = vehicule.fiabilite / 5;
  const scoreConfort = vehicule.confort / 5;
  const scoreSecurite = vehicule.securite / 5;
  const scoreRevente = vehicule.revente / 5;

  // Consommation : on favorise hybride/électrique, puis essence, etc.
  const consoMap: Record<Energie, number> = {
    electrique: 1,
    "hybride-rechargeable": 0.9,
    hybride: 0.8,
    essence: 0.5,
    diesel: 0.6,
  };
  const scoreConso = consoMap[energie];

  // Écologie : électrique/hybride mieux notés.
  const ecoMap: Record<Energie, number> = {
    electrique: 1,
    "hybride-rechargeable": 0.85,
    hybride: 0.7,
    diesel: 0.3,
    essence: 0.4,
  };
  const scoreEco = ecoMap[energie];

  // Style : on n'a pas de note dédiée, on s'appuie sur le confort comme proxy léger.
  const scoreStyle = (vehicule.confort + vehicule.securite) / 10;

  const sousScores: Record<Critere, number> = {
    prix: scorePrix,
    fiabilite: scoreFiabilite,
    consommation: scoreConso,
    ecologie: scoreEco,
    confort: scoreConfort,
    securite: scoreSecurite,
    style: scoreStyle,
    revente: scoreRevente,
  };

  // --- Agrégation pondérée -----------------------------------------------
  let sommePoids = 0;
  let sommeScore = 0;
  (Object.keys(sousScores) as Critere[]).forEach((c) => {
    sommeScore += sousScores[c] * poids[c];
    sommePoids += poids[c];
  });
  let base = sommePoids > 0 ? sommeScore / sommePoids : 0;

  // --- Filtres « durs » (bonus / malus) ----------------------------------
  let multiplicateur = 1;

  // Places insuffisantes : forte pénalité.
  if (vehicule.places < profil.nombrePlaces) multiplicateur *= 0.45;

  // Coffre : famille / besoin important vs petit coffre.
  if (profil.besoinCoffre === "important" && vehicule.coffreL < 450) multiplicateur *= 0.8;
  if (profil.besoinCoffre === "faible" && vehicule.coffreL > 550) multiplicateur *= 0.95;

  // Carrosserie souhaitée.
  if (profil.carrosseries.length && !profil.carrosseries.includes(vehicule.carrosserie)) {
    multiplicateur *= 0.6;
  }

  // Énergie souhaitée mais non disponible sur ce modèle.
  if (
    profil.energies.length &&
    !vehicule.energiesDisponibles.some((e) => profil.energies.includes(e))
  ) {
    multiplicateur *= 0.5;
  }

  // Électrique sans possibilité de recharge : on déconseille.
  if (energie === "electrique" && profil.rechargeDomicile === "non") {
    multiplicateur *= 0.7;
  }

  // Gros rouleur en électrique : autonomie potentiellement limitante.
  const grosRouleur =
    profil.kilometrageAnnuel === "20000-30000" ||
    profil.kilometrageAnnuel === "plus-30000";
  if (grosRouleur && energie === "electrique" && (vehicule.autonomieKm ?? 0) < 400) {
    multiplicateur *= 0.85;
  }

  // Marques à éviter / préférées (texte libre, comparaison simple).
  const marqueLower = vehicule.marque.toLowerCase();
  if (profil.marquesAEviter && profil.marquesAEviter.toLowerCase().includes(marqueLower)) {
    multiplicateur *= 0.4;
  }
  if (profil.marquesPreferees && profil.marquesPreferees.toLowerCase().includes(marqueLower)) {
    multiplicateur *= 1.1;
  }

  const score = clamp01(base * multiplicateur) * 100;

  return { score, energie, prix, sousScores, poids };
}

/**
 * Génère une phrase « pourquoi ce modèle vous correspond » à partir des
 * meilleurs sous-scores pondérés.
 */
function genererPourquoi(
  vehicule: Vehicule,
  profil: ProfilUtilisateur,
  energie: Energie,
  sousScores: Record<Critere, number>,
  poids: Record<Critere, number>,
): string {
  const libelles: Record<Critere, string> = {
    prix: "un bon rapport prix / prestations",
    fiabilite: "une fiabilité reconnue",
    consommation: "une consommation contenue",
    ecologie: "un faible impact environnemental",
    confort: "un confort apprécié",
    securite: "un bon niveau de sécurité",
    style: "un design soigné",
    revente: "une bonne tenue de la valeur de revente",
  };

  // On retient les 2 critères les plus contributifs (score × poids).
  const tries = (Object.keys(sousScores) as Critere[])
    .map((c) => ({ c, contrib: sousScores[c] * poids[c] }))
    .sort((a, b) => b.contrib - a.contrib)
    .slice(0, 2)
    .map((x) => libelles[x.c]);

  const energieLabel: Record<Energie, string> = {
    essence: "essence",
    diesel: "diesel",
    hybride: "hybride",
    "hybride-rechargeable": "hybride rechargeable",
    electrique: "électrique",
  };

  const accroches: string[] = [];
  if (vehicule.places >= profil.nombrePlaces) {
    accroches.push(`${vehicule.places} places adaptées à votre besoin`);
  }
  if (profil.usages.includes("famille") && vehicule.coffreL >= 450) {
    accroches.push("un coffre généreux pour la famille");
  }
  if (profil.rechargeDomicile === "oui" && (energie === "electrique" || energie === "hybride-rechargeable")) {
    accroches.push("une motorisation rechargeable cohérente avec votre recharge à domicile");
  }

  const debut = `La ${vehicule.marque} ${vehicule.modele} en ${energieLabel[energie]} offre ${tries.join(" et ")}`;
  const fin = accroches.length ? `, avec ${accroches[0]}.` : ".";
  return debut + fin;
}

/**
 * Point d'entrée : retourne la short-list des meilleurs modèles (3 à 5).
 */
export function recommanderModeles(
  profil: ProfilUtilisateur,
  catalogue: Vehicule[],
  nombre = 4,
): RecommandationModele[] {
  const poids = poidsCriteres(profil.prioritesOrdre);

  const notes = catalogue.map((vehicule) => {
    const { score, energie, prix, sousScores } = scorerVehicule(vehicule, profil, poids);
    return {
      vehicule,
      score: Math.round(score),
      energieConseillee: energie,
      prixIndicatif: prix,
      pourquoi: genererPourquoi(vehicule, profil, energie, sousScores, poids),
    } satisfies RecommandationModele;
  });

  return notes
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, Math.min(5, nombre)));
}
