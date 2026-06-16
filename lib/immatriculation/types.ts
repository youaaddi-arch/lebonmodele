/**
 * Types de la fonctionnalité « recherche par plaque d'immatriculation ».
 *
 * On modélise une fiche technique complète de véhicule obtenue à partir d'une
 * plaque. La source réelle est une API de plaque officielle/licenciée
 * (branchée via une clé côté serveur). Tant qu'aucune clé n'est configurée,
 * on renvoie des fiches d'EXEMPLE (champ `exemple: true`).
 */

export interface FicheVehicule {
  immatriculation: string;
  marque: string;
  modele: string;
  annee?: number;
  version?: string;
  energie?: string;
  critair?: string;
  puissanceCh?: number;
  coupleNm?: number;
  boite?: string;
  prixNeuf?: number;
  // Performances
  acceleration0a100?: number; // en secondes
  vitesseMax?: number; // km/h
  // Caractéristiques complémentaires
  puissanceFiscaleCv?: number;
  cylindres?: number;
  co2?: number; // g/km
  dateMiseCirculation?: string; // JJ/MM/AAAA
  genre?: string; // ex. VP
  carrosserie?: string;
  imageUrl?: string;
  // Divers
  vin?: string;
  tvv?: string;
  normeEuro?: string;
  /** Vrai tant qu'aucune source réelle n'est branchée. */
  exemple: boolean;
}

export interface SourcePlaqueAdapter {
  readonly nom: string;
  /** Retourne la fiche d'un véhicule, ou null si la plaque est inconnue. */
  rechercher(plaque: string): Promise<FicheVehicule | null>;
}

/** Normalise une plaque : majuscules, sans espaces ni tirets. */
export function normaliserPlaque(plaque: string): string {
  return plaque.toUpperCase().replace(/[\s-]/g, "").trim();
}

/** Formate une plaque au format SIV « AA-123-AA » si possible. */
export function formaterPlaque(plaque: string): string {
  const p = normaliserPlaque(plaque);
  const m = p.match(/^([A-Z]{2})(\d{3})([A-Z]{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : plaque.toUpperCase();
}
