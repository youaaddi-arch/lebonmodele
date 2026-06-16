/**
 * ⚠️ PARAMÈTRES INDICATIFS — À AJUSTER ⚠️
 *
 * Ce fichier centralise tous les paramètres financiers utilisés par le
 * comparateur. AUCUN de ces taux ne constitue une offre commerciale réelle :
 * ce sont des ordres de grandeur destinés à produire des ESTIMATIONS.
 *
 * Pour mettre à jour les simulations, il suffit de modifier les valeurs
 * ci-dessous. Le reste de l'application s'appuie exclusivement sur cette
 * configuration (rien n'est codé « en dur » ailleurs).
 */

export const PARAMS_FINANCEMENT = {
  /** Mention affichée systématiquement à côté des résultats financiers. */
  mentionLegale:
    "Simulation indicative, hors offre commerciale. Les montants réels dépendent " +
    "de votre dossier, du véhicule et de l'organisme financeur.",

  credit: {
    /** TAEG moyen indicatif d'un crédit auto (en %). */
    taegPourcent: 5.5,
    /** Durée par défaut d'un crédit auto, en mois. */
    dureeDefautMois: 60,
    /** Durées proposées (mois). */
    dureesPossiblesMois: [24, 36, 48, 60, 72],
  },

  loa: {
    /**
     * Coefficient de loyer mensuel indicatif, en % du prix du véhicule.
     * Loyer ≈ prix × coeffLoyerMensuelPourcent / 100.
     */
    coeffLoyerMensuelPourcent: 1.15,
    /**
     * Valeur résiduelle (option d'achat) en % du prix neuf, selon la durée.
     * Plus le contrat est long, plus la valeur résiduelle baisse.
     */
    valeurResiduellePourcent: {
      24: 58,
      36: 48,
      48: 40,
      60: 34,
    } as Record<number, number>,
    /** Plafond kilométrique annuel par défaut inclus dans le loyer. */
    plafondKmAnnuelDefaut: 15000,
    /** Coût indicatif du kilomètre supplémentaire (en €). */
    coutKmSupplementaire: 0.1,
    dureeDefautMois: 48,
  },

  lld: {
    /**
     * Coefficient de loyer mensuel indicatif (tout compris), en % du prix.
     * La LLD inclut généralement entretien + assistance, d'où un coeff
     * légèrement supérieur à la LOA.
     */
    coeffLoyerMensuelPourcent: 1.35,
    plafondKmAnnuelDefaut: 15000,
    coutKmSupplementaire: 0.12,
    dureeDefautMois: 48,
    /** Entretien et assistance habituellement inclus. */
    entretienInclus: true,
  },

  comptant: {
    /**
     * Décote indicative subie sur la durée de détention (en % du prix neuf).
     * Sert uniquement à illustrer le « coût réel » de la possession.
     */
    decotePourcentParAn: 12,
  },

  /** Avantage fiscal indicatif signalé aux profils professionnels. */
  proFiscalite: {
    messageLOALLD:
      "En tant que professionnel, les loyers de LOA/LLD peuvent être déductibles " +
      "et la TVA partiellement récupérable selon votre régime. Rapprochez-vous de " +
      "votre comptable : l'avantage fiscal rend souvent la location plus attractive.",
  },
} as const;
