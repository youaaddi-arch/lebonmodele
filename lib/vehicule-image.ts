/**
 * Génération des URLs de photos de véhicules via le CDN imagin.studio.
 *
 * imagin.studio fournit des visuels de voitures par marque / famille de modèle.
 * La clé « customer » est publique côté client : par défaut on utilise la clé
 * de démonstration publique, surchargée en production par la variable
 * NEXT_PUBLIC_IMAGIN_CUSTOMER (clé propre du projet, plus fiable et sans quota
 * de démo).
 *
 * Le mapping marque/modèle → paramètres imagin est centralisé ici. Quelques
 * modèles nécessitent un alias de « famille » différent du nom commercial.
 */

const CUSTOMER =
  process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER?.trim() || "hrjavascript-mastery";

/** Retire les accents et met en minuscules pour coller aux clés imagin. */
function normaliser(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Surcharges marque/famille pour les modèles dont le nom commercial ne
 * correspond pas directement à la nomenclature imagin (versions, suffixes…).
 */
const OVERRIDES: Record<string, { make?: string; family: string }> = {
  "renault-megane-etech": { family: "megane" },
  "tesla-model-3": { family: "model 3" },
  "tesla-model-y": { family: "model y" },
  "bmw-serie-3": { make: "bmw", family: "3 series" },
  "bmw-x1": { make: "bmw", family: "x1" },
  "peugeot-308-sw": { family: "308" },
  "skoda-octavia-combi": { make: "skoda", family: "octavia" },
  "toyota-yaris-cross": { family: "yaris cross" },
  "citroen-c5-aircross": { make: "citroen", family: "c5 aircross" },
  "renault-scenic-etech": { family: "scenic" },
  "mini-cooper": { make: "mini", family: "cooper" },
  "fiat-500": { make: "fiat", family: "500" },
};

export interface InfosImageVehicule {
  id: string;
  marque: string;
  modele: string;
}

/**
 * Construit l'URL de la photo d'un véhicule.
 * @param angle angle de prise de vue imagin (23 = 3/4 avant par défaut).
 */
export function urlImageVehicule(
  v: InfosImageVehicule,
  { angle = "23" }: { angle?: string } = {},
): string {
  const override = OVERRIDES[v.id];
  const make = override?.make ?? normaliser(v.marque);
  const family = override?.family ?? normaliser(v.modele);

  const params = new URLSearchParams({
    customer: CUSTOMER,
    make,
    modelFamily: family,
    angle,
    zoomType: "fullscreen",
    fileType: "png",
  });
  return `https://cdn.imagin.studio/getImage?${params.toString()}`;
}
