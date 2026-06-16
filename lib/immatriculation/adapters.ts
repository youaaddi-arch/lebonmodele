/**
 * Adaptateurs de source pour la recherche par plaque.
 *
 * ⚠️ Il n'existe pas d'API officielle gratuite et ouverte donnant la fiche
 * technique d'un véhicule à partir de sa plaque : le SIV est réservé aux
 * professionnels habilités, et les services grand public s'appuient sur des
 * fournisseurs de données LICENCIÉS (payants, avec clé d'API).
 *
 * Ce module est prêt à brancher un tel fournisseur : il suffit de définir
 * `PLAQUE_API_URL` et `PLAQUE_API_KEY` côté serveur. La fonction couvre les
 * conventions de réponse les plus courantes ; un petit ajustement du mappage
 * peut être nécessaire selon le fournisseur retenu.
 *
 * Sans clé, on retombe sur `demoAdapter` (plaque de démonstration GW-279-AF).
 */

import {
  formaterPlaque,
  normaliserPlaque,
  type FicheVehicule,
  type SourcePlaqueAdapter,
} from "./types";

// ---------------------------------------------------------------------------
// Démonstration
// ---------------------------------------------------------------------------
const FICHES_DEMO: Record<string, Omit<FicheVehicule, "exemple">> = {
  GW279AF: {
    immatriculation: "GW-279-AF",
    marque: "PEUGEOT",
    modele: "208 phase 1 de 2013",
    annee: 2013,
    version: "1.4 HDI",
    energie: "Gazole",
    critair: "2",
    puissanceCh: 68,
    coupleNm: 160,
    boite: "Manuelle (5 vitesses)",
    prixNeuf: 15450,
    acceleration0a100: 13.5,
    vitesseMax: 163,
    vin: "VF3CC8HR0CT124018",
    tvv: "CC8HR0",
    normeEuro: "EURO5",
  },
};

const demoAdapter: SourcePlaqueAdapter = {
  nom: "demo",
  async rechercher(plaque) {
    const fiche = FICHES_DEMO[normaliserPlaque(plaque)];
    return fiche ? { ...fiche, exemple: true } : null;
  },
};

// ---------------------------------------------------------------------------
// Fournisseur réel (licencié) — activé si PLAQUE_API_KEY est défini
// ---------------------------------------------------------------------------

/** Récupère la première valeur définie parmi plusieurs noms de champs possibles. */
function pick<T = unknown>(obj: Record<string, unknown>, ...cles: string[]): T | undefined {
  for (const c of cles) {
    if (obj[c] !== undefined && obj[c] !== null && obj[c] !== "") return obj[c] as T;
  }
  return undefined;
}

function nombre(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(String(v).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Mappe une réponse fournisseur vers notre fiche.
 * Compatible avec apiplaqueimmatriculation.com (clés parfois préfixées « AWN_ »,
 * données encapsulées dans `data` qui peut être un tableau) et avec d'autres
 * conventions courantes.
 */
function mapVersFiche(plaque: string, json: Record<string, unknown>): FicheVehicule | null {
  // La donnée peut être dans `data` (tableau ou objet), `vehicule` ou `result`.
  let racine: Record<string, unknown> = json;
  const conteneur = pick<unknown>(json, "data", "vehicule", "result");
  if (Array.isArray(conteneur)) {
    if (conteneur.length === 0) return null;
    racine = conteneur[0] as Record<string, unknown>;
  } else if (conteneur && typeof conteneur === "object") {
    racine = conteneur as Record<string, unknown>;
  }

  const marque = pick<string>(racine, "AWN_marque", "marque", "make", "brand");
  const modele = pick<string>(racine, "AWN_modele", "modele", "model", "famille");
  if (!marque && !modele) return null; // réponse vide / erreur

  return {
    immatriculation: formaterPlaque(plaque),
    marque: String(marque ?? "—"),
    modele: String(modele ?? "—"),
    annee: nombre(pick(racine, "annee", "year", "AWN_date_mise_en_circulation")),
    version: pick<string>(racine, "AWN_version", "version", "variante"),
    energie: pick<string>(racine, "AWN_energie", "energie", "energy", "carburant"),
    critair:
      pick(racine, "AWN_critair", "critair", "crit_air") !== undefined
        ? String(pick(racine, "AWN_critair", "critair", "crit_air"))
        : undefined,
    puissanceCh: nombre(
      pick(racine, "AWN_puissance_reelle", "puissance_ch", "puissanceCh", "puissance", "power_ch"),
    ),
    coupleNm: nombre(pick(racine, "AWN_couple", "couple", "coupleNm", "torque")),
    boite: pick<string>(racine, "AWN_boite_vitesse", "boite", "boite_vitesse", "gearbox"),
    prixNeuf: nombre(pick(racine, "AWN_prix_neuf", "prix_neuf", "prixNeuf", "price_new")),
    acceleration0a100: nombre(
      pick(racine, "acceleration", "zero_to_100", "acceleration_0_100"),
    ),
    vitesseMax: nombre(pick(racine, "vitesse_max", "vitesseMax", "top_speed")),
    vin: pick<string>(racine, "AWN_VIN", "vin", "numero_serie"),
    tvv: pick<string>(racine, "AWN_type_mine", "tvv", "type_mine", "type_variante_version"),
    normeEuro: pick<string>(racine, "AWN_norme_euro", "norme_euro", "normeEuro", "euro"),
    exemple: false,
  };
}

// URL par défaut : fournisseur apiplaqueimmatriculation.com (modifiable via env).
const apiUrl =
  process.env.PLAQUE_API_URL || "https://api.apiplaqueimmatriculation.com/plaque";
const apiKey = process.env.PLAQUE_API_KEY;

const apiPlaqueAdapter: SourcePlaqueAdapter | null = apiKey
  ? {
      nom: "api-plaque",
      async rechercher(plaque) {
        try {
          const url = new URL(apiUrl);
          url.searchParams.set("immatriculation", formaterPlaque(plaque));
          url.searchParams.set("plaque", normaliserPlaque(plaque));
          url.searchParams.set("token", apiKey);
          url.searchParams.set("pays", "FR");
          const res = await fetch(url.toString(), {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "X-API-Key": apiKey },
            // Cache court pour limiter les coûts d'API sur des plaques répétées.
            next: { revalidate: 3600 },
          });
          if (!res.ok) return null;
          const json = (await res.json()) as Record<string, unknown>;
          return mapVersFiche(plaque, json);
        } catch {
          return null;
        }
      },
    }
  : null;

/**
 * Source GRATUITE Identi-Car (sans clé ni inscription).
 * Active par défaut : permet d'interroger n'importe quelle plaque sans payer.
 * URL surchargeable via `IDENTICAR_API_URL`.
 */
const identiCarUrl =
  process.env.IDENTICAR_API_URL || "https://api-siv.identi-car.fr/v2/lookup";

const identiCarAdapter: SourcePlaqueAdapter = {
  nom: "identi-car",
  async rechercher(plaque) {
    try {
      const url = new URL(identiCarUrl);
      url.searchParams.set("plaque", normaliserPlaque(plaque));
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const json = (await res.json()) as Record<string, unknown>;
      return mapVersFiche(plaque, json);
    } catch {
      return null;
    }
  },
};

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

/**
 * Recherche une fiche véhicule à partir d'une plaque.
 * Ordre : fournisseur payant (si token) → Identi-Car gratuit → démonstration.
 */
export async function rechercherFicheVehicule(
  plaque: string,
): Promise<FicheVehicule | null> {
  if (apiPlaqueAdapter) {
    const reelle = await apiPlaqueAdapter.rechercher(plaque);
    if (reelle) return reelle;
  }
  // Source gratuite (sans clé) : couvre n'importe quelle plaque.
  const gratuite = await identiCarAdapter.rechercher(plaque);
  if (gratuite) return gratuite;

  return demoAdapter.rechercher(plaque);
}

/** Une source réelle est toujours disponible (payante si token, sinon gratuite). */
export const sourceReelleActive = true;
