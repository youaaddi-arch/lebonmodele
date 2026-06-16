/**
 * Calculateur de financement.
 *
 * Produit, à partir du profil utilisateur et d'un prix de véhicule, une
 * comparaison estimative des 4 modes d'acquisition : comptant, crédit, LOA, LLD.
 *
 * Tous les paramètres proviennent de `config/financement.ts` — rien n'est
 * codé en dur ici. Les résultats sont des ESTIMATIONS.
 */

import { PARAMS_FINANCEMENT } from "@/config/financement";
import type {
  ComparatifFinancement,
  DureeDetention,
  ModeFinancement,
  ProfilUtilisateur,
  ResultatFinancement,
  TrancheKilometrage,
} from "./types";

/** Convertit la tranche de détention en nombre de mois (médiane indicative). */
function dureeDetentionEnMois(duree: DureeDetention): number {
  switch (duree) {
    case "moins-2":
      return 24;
    case "2-4":
      return 36;
    case "4-6":
      return 60;
    case "plus-6":
      return 84;
  }
}

/** Estimation du kilométrage annuel (borne haute de la tranche) pour les plafonds. */
function kilometrageAnnuelEstime(tranche: TrancheKilometrage): number {
  switch (tranche) {
    case "moins-5000":
      return 5000;
    case "5000-10000":
      return 10000;
    case "10000-20000":
      return 20000;
    case "20000-30000":
      return 30000;
    case "plus-30000":
      return 35000;
  }
}

/**
 * Calcule la mensualité d'un prêt amortissable classique.
 * @param capital montant emprunté
 * @param taegAnnuelPourcent TAEG en %
 * @param dureeMois durée en mois
 */
function mensualitePret(
  capital: number,
  taegAnnuelPourcent: number,
  dureeMois: number,
): number {
  const tauxMensuel = taegAnnuelPourcent / 100 / 12;
  if (tauxMensuel === 0) return capital / dureeMois;
  return (
    (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois))
  );
}

/** Arrondit à l'euro le plus proche. */
const r = (n: number) => Math.round(n);

/**
 * Détermine la valeur résiduelle LOA pour une durée donnée (interpolation
 * sur la durée disponible la plus proche).
 */
function valeurResiduellePourcent(dureeMois: number): number {
  const table = PARAMS_FINANCEMENT.loa.valeurResiduellePourcent;
  const durees = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  // On prend la durée tabulée la plus proche de la durée demandée.
  let choisie = durees[0];
  for (const d of durees) {
    if (Math.abs(d - dureeMois) < Math.abs(choisie - dureeMois)) choisie = d;
  }
  return table[choisie];
}

/**
 * Construit le comparatif des 4 modes de financement.
 */
export function calculerFinancement(
  profil: ProfilUtilisateur,
  prixVehicule: number,
): ComparatifFinancement {
  const { credit, loa, lld, comptant } = PARAMS_FINANCEMENT;

  const dureeMois = dureeDetentionEnMois(profil.dureeDetention);
  const apport = profil.apport ?? 0;
  const kmAnnuel = kilometrageAnnuelEstime(profil.kilometrageAnnuel);

  const resultats: ResultatFinancement[] = [];

  // --- Comptant -----------------------------------------------------------
  const anneesDetention = dureeMois / 12;
  const decote = Math.min(
    prixVehicule,
    prixVehicule * (comptant.decotePourcentParAn / 100) * anneesDetention,
  );
  resultats.push({
    mode: "comptant",
    libelle: "Comptant",
    apport: prixVehicule,
    coutTotal: prixVehicule,
    coutInterets: 0,
    proprietaireFin: true,
    inclusEntretien: false,
    points: [
      "Aucun intérêt à payer, vous êtes immédiatement propriétaire.",
      `Sortie de trésorerie importante : ${r(prixVehicule).toLocaleString("fr-FR")} € d'un coup.`,
      `Décote estimée sur ${anneesDetention.toFixed(0)} an(s) : environ ${r(decote).toLocaleString("fr-FR")} € de valeur perdue.`,
    ],
  });

  // --- Crédit auto --------------------------------------------------------
  const capitalEmprunte = Math.max(0, prixVehicule - apport);
  const dureeCredit = Math.min(credit.dureeDefautMois, dureeMois) || credit.dureeDefautMois;
  const mensCredit = mensualitePret(capitalEmprunte, credit.taegPourcent, dureeCredit);
  const coutTotalCredit = apport + mensCredit * dureeCredit;
  resultats.push({
    mode: "credit",
    libelle: "Crédit auto",
    mensualite: r(mensCredit),
    apport,
    coutTotal: r(coutTotalCredit),
    coutInterets: r(coutTotalCredit - prixVehicule),
    proprietaireFin: true,
    inclusEntretien: false,
    points: [
      `Mensualité estimée d'environ ${r(mensCredit).toLocaleString("fr-FR")} € sur ${dureeCredit} mois (TAEG indicatif ${credit.taegPourcent} %).`,
      `Surcoût lié aux intérêts : environ ${r(coutTotalCredit - prixVehicule).toLocaleString("fr-FR")} €.`,
      "Vous êtes propriétaire à la fin du remboursement.",
    ],
  });

  // --- LOA ----------------------------------------------------------------
  const dureeLoa = Math.min(loa.dureeDefautMois, dureeMois) || loa.dureeDefautMois;
  const loyerLoa = (prixVehicule * loa.coeffLoyerMensuelPourcent) / 100;
  const optionAchat = (prixVehicule * valeurResiduellePourcent(dureeLoa)) / 100;
  const coutTotalLoa = apport + loyerLoa * dureeLoa;
  const surcoutKmLoa =
    kmAnnuel > loa.plafondKmAnnuelDefaut
      ? (kmAnnuel - loa.plafondKmAnnuelDefaut) * (dureeLoa / 12) * loa.coutKmSupplementaire
      : 0;
  resultats.push({
    mode: "loa",
    libelle: "LOA (location avec option d'achat)",
    mensualite: r(loyerLoa),
    apport,
    coutTotal: r(coutTotalLoa + surcoutKmLoa),
    optionAchat: r(optionAchat),
    proprietaireFin: false,
    plafondKm: loa.plafondKmAnnuelDefaut,
    inclusEntretien: false,
    points: [
      `Loyer estimé d'environ ${r(loyerLoa).toLocaleString("fr-FR")} €/mois sur ${dureeLoa} mois.`,
      `Option d'achat en fin de contrat : environ ${r(optionAchat).toLocaleString("fr-FR")} €.`,
      `Plafond kilométrique de ${loa.plafondKmAnnuelDefaut.toLocaleString("fr-FR")} km/an${surcoutKmLoa > 0 ? ` (dépassement estimé : +${r(surcoutKmLoa).toLocaleString("fr-FR")} €)` : ""}.`,
      "Bon compromis si vous hésitez à garder ou non la voiture.",
    ],
  });

  // --- LLD ----------------------------------------------------------------
  const dureeLld = Math.min(lld.dureeDefautMois, dureeMois) || lld.dureeDefautMois;
  const loyerLld = (prixVehicule * lld.coeffLoyerMensuelPourcent) / 100;
  const coutTotalLld = apport + loyerLld * dureeLld;
  const surcoutKmLld =
    kmAnnuel > lld.plafondKmAnnuelDefaut
      ? (kmAnnuel - lld.plafondKmAnnuelDefaut) * (dureeLld / 12) * lld.coutKmSupplementaire
      : 0;
  resultats.push({
    mode: "lld",
    libelle: "LLD (location longue durée)",
    mensualite: r(loyerLld),
    apport,
    coutTotal: r(coutTotalLld + surcoutKmLld),
    proprietaireFin: false,
    plafondKm: lld.plafondKmAnnuelDefaut,
    inclusEntretien: lld.entretienInclus,
    points: [
      `Loyer tout compris estimé d'environ ${r(loyerLld).toLocaleString("fr-FR")} €/mois sur ${dureeLld} mois.`,
      "Entretien et assistance généralement inclus : budget mensuel prévisible.",
      "Restitution du véhicule en fin de contrat, pas d'option d'achat.",
      `Idéal pour un kilométrage prévisible et un changement régulier de voiture.`,
    ],
  });

  // --- Recommandation -----------------------------------------------------
  const { modeRecommande, justification } = choisirModeRecommande(profil, dureeMois);

  return {
    prixVehicule,
    dureeMois,
    resultats,
    modeRecommande,
    justification,
  };
}

/**
 * Logique de recommandation du mode de financement le plus adapté.
 * - Détention courte + ouverture à la location → LOA/LLD
 * - Volonté de posséder + détention longue → comptant/crédit
 * - Profil pro → on oriente vers la location pour l'intérêt fiscal
 */
export function choisirModeRecommande(
  profil: ProfilUtilisateur,
  dureeMois: number,
): { modeRecommande: ModeFinancement; justification: string } {
  const detentionCourte = dureeMois <= 48;
  const veutLouer = profil.ouvertureLocation !== "non";
  const veutPosseder = profil.preference === "proprietaire";
  const tranquilliteForte = profil.importanceTranquillite >= 4;
  const estPro = profil.profilAcheteur !== "particulier";
  const kmEleve =
    profil.kilometrageAnnuel === "20000-30000" ||
    profil.kilometrageAnnuel === "plus-30000";

  // Profil pro ouvert à la location → fiscalité LOA/LLD
  if (estPro && veutLouer) {
    if (tranquilliteForte || !kmEleve) {
      return {
        modeRecommande: "lld",
        justification:
          "Profil professionnel privilégiant la tranquillité : la LLD offre un budget " +
          "mensuel tout compris et un avantage fiscal potentiel (loyers déductibles, " +
          "TVA partiellement récupérable selon votre régime).",
      };
    }
    return {
      modeRecommande: "loa",
      justification:
        "Profil professionnel ouvert à la location : la LOA conserve une option d'achat " +
        "tout en offrant un cadre fiscal souvent avantageux. À valider avec votre comptable.",
    };
  }

  // Détention courte + ouverture location → LOA ou LLD
  if (detentionCourte && veutLouer) {
    if (tranquilliteForte && !kmEleve) {
      return {
        modeRecommande: "lld",
        justification:
          "Vous gardez la voiture peu de temps et privilégiez la tranquillité : la LLD " +
          "(loyer tout compris, restitution en fin de contrat) correspond parfaitement.",
      };
    }
    return {
      modeRecommande: "loa",
      justification:
        "Détention courte et ouverture à la location : la LOA vous laisse le choix en fin " +
        "de contrat (rendre ou acheter), un bon compromis quand on hésite.",
    };
  }

  // Volonté de posséder + détention longue
  if (veutPosseder || dureeMois > 60) {
    if (profil.apport && profil.budgetTotal && profil.apport >= profil.budgetTotal * 0.9) {
      return {
        modeRecommande: "comptant",
        justification:
          "Vous souhaitez devenir propriétaire, gardez longtemps la voiture et disposez de " +
          "la trésorerie : l'achat comptant évite tout intérêt.",
      };
    }
    return {
      modeRecommande: "credit",
      justification:
        "Vous voulez devenir propriétaire et conserver la voiture longtemps : le crédit auto " +
        "vous rend propriétaire tout en lissant l'effort financier dans le temps.",
    };
  }

  // Cas par défaut
  return {
    modeRecommande: "credit",
    justification:
      "D'après votre profil, le crédit auto offre un bon équilibre entre propriété et " +
      "mensualités maîtrisées. Comparez toutefois avec la LOA si vous hésitez à garder la voiture.",
  };
}
