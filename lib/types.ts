/**
 * Types centraux de l'application.
 * On y regroupe le profil issu du questionnaire, le modèle de véhicule du
 * catalogue, et les structures de résultats (recommandation + financement).
 */

// ---------------------------------------------------------------------------
// Énumérations métier
// ---------------------------------------------------------------------------

export type Carrosserie =
  | "citadine"
  | "berline"
  | "break"
  | "suv"
  | "monospace"
  | "ludospace";

export type Energie =
  | "essence"
  | "diesel"
  | "hybride"
  | "hybride-rechargeable"
  | "electrique";

export type BoiteVitesses = "manuelle" | "automatique" | "indifferent";

export type EtatVehicule = "neuf" | "occasion-recente" | "indifferent";

export type ModeBudget = "total" | "mensualite";

export type TrancheKilometrage =
  | "moins-5000"
  | "5000-10000"
  | "10000-20000"
  | "20000-30000"
  | "plus-30000";

export type TypeRoute = "ville" | "mixte" | "route-autoroute";

export type UsagePrincipal = "quotidien" | "famille" | "loisirs" | "professionnel";

export type RechargeDomicile = "oui" | "non" | "ne-sais-pas";

export type BesoinCoffre = "faible" | "moyen" | "important";

export type OuvertureLocation = "oui" | "non" | "comparer";

export type PreferencePropriete = "proprietaire" | "flexibilite";

export type DureeDetention = "moins-2" | "2-4" | "4-6" | "plus-6";

export type ProfilAcheteur = "particulier" | "tns" | "societe";

/** Critères pondérables à l'étape 5. */
export type Critere =
  | "prix"
  | "fiabilite"
  | "consommation"
  | "ecologie"
  | "confort"
  | "securite"
  | "style"
  | "revente";

export const CRITERES: { id: Critere; label: string }[] = [
  { id: "prix", label: "Prix" },
  { id: "fiabilite", label: "Fiabilité" },
  { id: "consommation", label: "Faible consommation" },
  { id: "ecologie", label: "Écologie / émissions" },
  { id: "confort", label: "Confort" },
  { id: "securite", label: "Sécurité" },
  { id: "style", label: "Style / design" },
  { id: "revente", label: "Valeur de revente" },
];

// ---------------------------------------------------------------------------
// Profil utilisateur (sortie du questionnaire)
// ---------------------------------------------------------------------------

export interface ProfilUtilisateur {
  // Étape 1 — Budget
  modeBudget: ModeBudget;
  budgetTotal?: number;
  mensualiteMax?: number;
  apport?: number;
  repriseVehicule: boolean;
  valeurReprise?: number;

  // Étape 2 — Usage et trajets
  kilometrageAnnuel: TrancheKilometrage;
  trajetQuotidienKm?: number;
  pasDeTrajetRegulier: boolean;
  typeRoute: TypeRoute;
  usages: UsagePrincipal[];
  rechargeDomicile: RechargeDomicile;

  // Étape 3 — Le véhicule souhaité
  nombrePlaces: number;
  besoinCoffre: BesoinCoffre;
  carrosseries: Carrosserie[]; // vide = indifférent
  energies: Energie[]; // vide = indifférent
  boite: BoiteVitesses;
  etat: EtatVehicule;
  marquesPreferees?: string;
  marquesAEviter?: string;

  // Étape 4 — Mode d'acquisition et profil
  ouvertureLocation: OuvertureLocation;
  preference: PreferencePropriete;
  dureeDetention: DureeDetention;
  importanceTranquillite: number; // 1 (faible) → 5 (forte)
  profilAcheteur: ProfilAcheteur;

  // Étape 5 — Priorités (ordre = importance décroissante)
  prioritesOrdre: Critere[];

  // Fin
  email?: string;
  consentementEmail: boolean;
}

// ---------------------------------------------------------------------------
// Catalogue véhicules (data/vehicules.json)
// ---------------------------------------------------------------------------

export interface Vehicule {
  id: string;
  marque: string;
  modele: string;
  carrosserie: Carrosserie;
  energiesDisponibles: Energie[];
  places: number;
  coffreL: number; // volume de coffre indicatif en litres
  consommation: string; // ex. "5,2 L/100 km" ou "16 kWh/100 km"
  autonomieKm?: number; // pour électrique / hybride rechargeable
  prixNeufMin: number;
  prixNeufMax: number;
  prixOccasionMin: number;
  prixOccasionMax: number;
  fiabilite: number; // note /5
  confort: number; // note /5
  securite: number; // note /5
  revente: number; // note /5 (tenue de la valeur de revente)
  pointsForts: string[];
  pointsFaibles: string[];
}

// ---------------------------------------------------------------------------
// Résultats
// ---------------------------------------------------------------------------

export interface RecommandationModele {
  vehicule: Vehicule;
  score: number; // 0 → 100
  pourquoi: string; // phrase « pourquoi ce modèle vous correspond »
  energieConseillee: Energie;
  prixIndicatif: { min: number; max: number; neuf: boolean };
}

export type ModeFinancement = "comptant" | "credit" | "loa" | "lld";

export interface ResultatFinancement {
  mode: ModeFinancement;
  libelle: string;
  mensualite?: number; // null pour comptant
  apport: number;
  coutTotal: number; // coût total estimé sur la durée
  coutInterets?: number; // surcoût lié aux intérêts / loyers
  optionAchat?: number; // valeur résiduelle (LOA)
  proprietaireFin: boolean;
  plafondKm?: number;
  inclusEntretien: boolean;
  points: string[]; // points clés à retenir
}

export interface ComparatifFinancement {
  prixVehicule: number;
  dureeMois: number;
  resultats: ResultatFinancement[];
  modeRecommande: ModeFinancement;
  justification: string;
}
