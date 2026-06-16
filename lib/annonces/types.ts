/**
 * Types de la couche « annonces d'occasion ».
 *
 * Cette couche est volontairement abstraite : elle modélise des annonces
 * provenant de places de marché (type Leboncoin, La Centrale) SANS dépendre
 * d'aucune d'entre elles en particulier. L'objectif est de pouvoir brancher
 * une vraie source de données (API officielle, flux partenaire / affiliation)
 * le jour où un accès légitime est disponible.
 *
 * IMPORTANT : tant qu'aucune source officielle n'est connectée, les annonces
 * sont des EXEMPLES synthétiques (champ `exemple: true`). On n'expose jamais de
 * lien sortant vers les annonces.
 */

export type SourceAnnonce = "leboncoin" | "lacentrale";

export interface AnnonceOccasion {
  id: string;
  vehiculeId: string;
  titre: string;
  version?: string;
  annee: number;
  kilometrage: number;
  prix: number;
  carburant: string;
  boite: string;
  ville: string;
  source: SourceAnnonce;
  /** Toujours vrai tant qu'une source réelle n'est pas branchée. */
  exemple: boolean;
}

export interface RechercheAnnoncesParams {
  vehicule: {
    id: string;
    marque: string;
    modele: string;
    prixOccasionMin: number;
    prixOccasionMax: number;
  };
  /** Nombre maximum d'annonces souhaitées par source. */
  limite?: number;
}

/**
 * Contrat d'un adaptateur de source d'annonces. Une implémentation réelle
 * appellerait ici l'API officielle de la source (avec une clé côté serveur).
 */
export interface SourceAnnoncesAdapter {
  readonly source: SourceAnnonce;
  readonly label: string;
  rechercher(params: RechercheAnnoncesParams): Promise<AnnonceOccasion[]>;
}
