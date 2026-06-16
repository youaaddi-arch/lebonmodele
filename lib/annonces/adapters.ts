/**
 * Adaptateurs de sources d'annonces d'occasion.
 *
 * ⚠️ Leboncoin et La Centrale n'exposent pas d'API publique et leurs
 * conditions d'utilisation interdisent le scraping. On ne se « branche » donc
 * PAS dessus directement. Ces adaptateurs produisent pour l'instant des
 * annonces d'EXEMPLE, déterministes et cohérentes avec la fourchette de prix
 * du modèle, afin de démontrer l'expérience.
 *
 * Pour passer en données réelles : remplacer le corps de `rechercher()` par un
 * appel à l'API officielle / au flux partenaire de la source (clé d'accès
 * stockée côté serveur), en conservant le même type de retour.
 */

import type {
  AnnonceOccasion,
  RechercheAnnoncesParams,
  SourceAnnonce,
  SourceAnnoncesAdapter,
} from "./types";

/** Générateur pseudo-aléatoire déterministe (pour des exemples stables). */
function graine(chaine: string): () => number {
  let h = 1779033703 ^ chaine.length;
  for (let i = 0; i < chaine.length; i++) {
    h = Math.imul(h ^ chaine.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const VILLES = [
  "Paris", "Lyon", "Lille", "Bordeaux", "Toulouse",
  "Nantes", "Marseille", "Strasbourg", "Rennes", "Montpellier",
];

const CARBURANTS = ["Essence", "Diesel", "Hybride"];
const BOITES = ["Manuelle", "Automatique"];

/**
 * Fabrique des annonces d'exemple cohérentes (année, km, prix corrélés) à
 * partir de la fourchette de prix d'occasion du modèle.
 */
function genererExemples(
  source: SourceAnnonce,
  { vehicule, limite = 3 }: RechercheAnnoncesParams,
): AnnonceOccasion[] {
  const rnd = graine(`${source}-${vehicule.id}`);
  const annonces: AnnonceOccasion[] = [];

  for (let i = 0; i < limite; i++) {
    // Facteur d'ancienneté : 0 (récent, cher) → 1 (ancien, bon marché).
    const anciennete = rnd();
    const annee = 2024 - Math.round(1 + anciennete * 6); // 2018 → 2023
    const kilometrage = Math.round((15000 + anciennete * 115000) / 1000) * 1000;
    const prix =
      Math.round(
        (vehicule.prixOccasionMax -
          anciennete * (vehicule.prixOccasionMax - vehicule.prixOccasionMin)) /
          100,
      ) * 100;

    annonces.push({
      id: `${source}-${vehicule.id}-${i}`,
      vehiculeId: vehicule.id,
      titre: `${vehicule.marque} ${vehicule.modele}`,
      version: undefined,
      annee,
      kilometrage,
      prix,
      carburant: CARBURANTS[Math.floor(rnd() * CARBURANTS.length)],
      boite: BOITES[Math.floor(rnd() * BOITES.length)],
      ville: VILLES[Math.floor(rnd() * VILLES.length)],
      source,
      exemple: true,
    });
  }

  return annonces.sort((a, b) => a.prix - b.prix);
}

/** Adaptateur « façon Leboncoin » (exemples pour l'instant). */
export const leboncoinAdapter: SourceAnnoncesAdapter = {
  source: "leboncoin",
  label: "Particuliers & pros",
  async rechercher(params) {
    // TODO : brancher l'API / flux partenaire officiel ici.
    return genererExemples("leboncoin", params);
  },
};

/** Adaptateur « façon La Centrale » (exemples pour l'instant). */
export const lacentraleAdapter: SourceAnnoncesAdapter = {
  source: "lacentrale",
  label: "Réseau professionnels",
  async rechercher(params) {
    // TODO : brancher l'API / flux partenaire officiel ici.
    return genererExemples("lacentrale", params);
  },
};

/** Liste des adaptateurs actifs (facile à étendre). */
export const adaptateursAnnonces: SourceAnnoncesAdapter[] = [
  leboncoinAdapter,
  lacentraleAdapter,
];

/**
 * Agrège les annonces de toutes les sources pour un véhicule donné, triées
 * par prix croissant.
 */
export async function rechercherAnnonces(
  params: RechercheAnnoncesParams,
): Promise<AnnonceOccasion[]> {
  const resultats = await Promise.all(
    adaptateursAnnonces.map((a) => a.rechercher(params)),
  );
  return resultats.flat().sort((a, b) => a.prix - b.prix);
}
