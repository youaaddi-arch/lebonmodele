"use client";

import * as React from "react";

import type { ProfilUtilisateur } from "./types";

/**
 * Gestion d'état du questionnaire côté client.
 *
 * Le profil est conservé en mémoire (contexte React) ET persisté dans le
 * sessionStorage, afin que la page /resultats puisse le relire même après
 * un rechargement, sans backend.
 */

const STORAGE_KEY = "lebonmodele:profil";

/** Valeurs par défaut raisonnables pour démarrer le wizard. */
export const PROFIL_DEFAUT: ProfilUtilisateur = {
  modeBudget: "total",
  budgetTotal: 25000,
  mensualiteMax: 350,
  apport: 3000,
  repriseVehicule: false,
  valeurReprise: undefined,

  kilometrageAnnuel: "10000-20000",
  trajetQuotidienKm: undefined,
  pasDeTrajetRegulier: false,
  typeRoute: "mixte",
  usages: ["quotidien"],
  rechargeDomicile: "ne-sais-pas",

  nombrePlaces: 5,
  besoinCoffre: "moyen",
  carrosseries: [],
  energies: [],
  boite: "indifferent",
  etat: "indifferent",
  marquesPreferees: "",
  marquesAEviter: "",

  ouvertureLocation: "comparer",
  preference: "proprietaire",
  dureeDetention: "4-6",
  importanceTranquillite: 3,
  profilAcheteur: "particulier",

  prioritesOrdre: ["prix", "fiabilite", "confort", "consommation", "securite", "revente", "style", "ecologie"],

  email: "",
  consentementEmail: false,
};

interface QuestionnaireContextValue {
  profil: ProfilUtilisateur;
  /** Met à jour partiellement le profil. */
  update: (patch: Partial<ProfilUtilisateur>) => void;
  /** Réinitialise le profil aux valeurs par défaut. */
  reset: () => void;
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [profil, setProfil] = React.useState<ProfilUtilisateur>(PROFIL_DEFAUT);

  // Réhydratation depuis le sessionStorage au montage.
  React.useEffect(() => {
    try {
      const brut = sessionStorage.getItem(STORAGE_KEY);
      if (brut) setProfil({ ...PROFIL_DEFAUT, ...JSON.parse(brut) });
    } catch {
      // sessionStorage indisponible (mode privé, SSR) : on ignore.
    }
  }, []);

  const update = React.useCallback((patch: Partial<ProfilUtilisateur>) => {
    setProfil((prev) => {
      const suivant = { ...prev, ...patch };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(suivant));
      } catch {
        /* ignore */
      }
      return suivant;
    });
  }, []);

  const reset = React.useCallback(() => {
    setProfil(PROFIL_DEFAUT);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(() => ({ profil, update, reset }), [profil, update, reset]);

  return (
    <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const ctx = React.useContext(QuestionnaireContext);
  if (!ctx) {
    throw new Error("useQuestionnaire doit être utilisé dans un QuestionnaireProvider");
  }
  return ctx;
}

/** Lit le profil directement depuis le sessionStorage (hors contexte). */
export function lireProfilStocke(): ProfilUtilisateur | null {
  try {
    const brut = sessionStorage.getItem(STORAGE_KEY);
    if (!brut) return null;
    return { ...PROFIL_DEFAUT, ...JSON.parse(brut) };
  } catch {
    return null;
  }
}
