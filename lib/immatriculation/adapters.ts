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

/** Mappe une réponse fournisseur (conventions courantes) vers notre fiche. */
function mapVersFiche(plaque: string, d: Record<string, unknown>): FicheVehicule {
  const data = (pick<Record<string, unknown>>(d, "data", "vehicule", "result") ?? d) as Record<string, unknown>;
  return {
    immatriculation: formaterPlaque(plaque),
    marque: String(pick(data, "marque", "make", "brand") ?? "—"),
    modele: String(pick(data, "modele", "model", "modele_version", "famille") ?? "—"),
    annee: nombre(pick(data, "annee", "year", "date_mise_en_circulation_annee")),
    version: pick<string>(data, "version", "variante"),
    energie: pick<string>(data, "energie", "energy", "carburant"),
    critair: pick<string>(data, "critair", "crit_air", "critAir") !== undefined
      ? String(pick(data, "critair", "crit_air", "critAir"))
      : undefined,
    puissanceCh: nombre(pick(data, "puissance_ch", "puissanceCh", "puissance", "power_ch")),
    coupleNm: nombre(pick(data, "couple", "coupleNm", "torque")),
    boite: pick<string>(data, "boite", "boite_vitesse", "gearbox", "transmission"),
    prixNeuf: nombre(pick(data, "prix_neuf", "prixNeuf", "price_new")),
    acceleration0a100: nombre(pick(data, "acceleration", "zero_to_100", "acceleration_0_100")),
    vitesseMax: nombre(pick(data, "vitesse_max", "vitesseMax", "top_speed")),
    vin: pick<string>(data, "vin", "numero_serie"),
    tvv: pick<string>(data, "tvv", "type_variante_version"),
    normeEuro: pick<string>(data, "norme_euro", "normeEuro", "euro"),
    exemple: false,
  };
}

const apiUrl = process.env.PLAQUE_API_URL;
const apiKey = process.env.PLAQUE_API_KEY;

const apiPlaqueAdapter: SourcePlaqueAdapter | null = apiKey
  ? {
      nom: "api-plaque",
      async rechercher(plaque) {
        if (!apiUrl) return null;
        try {
          // Convention générique : {url}?plaque=XX&token=KEY + en-tête Bearer.
          const url = new URL(apiUrl);
          url.searchParams.set("plaque", normaliserPlaque(plaque));
          url.searchParams.set("immatriculation", normaliserPlaque(plaque));
          url.searchParams.set("token", apiKey);
          const res = await fetch(url.toString(), {
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

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

/**
 * Recherche une fiche véhicule à partir d'une plaque.
 * Essaie d'abord la vraie API (si configurée), puis retombe sur la démo.
 */
export async function rechercherFicheVehicule(
  plaque: string,
): Promise<FicheVehicule | null> {
  if (apiPlaqueAdapter) {
    const reelle = await apiPlaqueAdapter.rechercher(plaque);
    if (reelle) return reelle;
  }
  return demoAdapter.rechercher(plaque);
}

/** Indique si une vraie source est configurée (pour l'UI). */
export const sourceReelleActive = Boolean(apiPlaqueAdapter);
