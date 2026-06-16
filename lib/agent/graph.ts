/**
 * Agent décisionnel LangGraph.
 *
 * Orchestre la décision en un graphe d'états :
 *   recommander → financer → décider → rédiger
 *
 * Chaque nœud s'appuie sur la logique déterministe du site (scoring,
 * financement), si bien que l'agent « prend les bonnes décisions » même SANS
 * clé IA. Si `ANTHROPIC_API_KEY` est présent, le dernier nœud enrichit la
 * justification en langage naturel.
 */

import { Annotation, StateGraph, START, END } from "@langchain/langgraph";

import catalogue from "@/data/vehicules.json";
import { recommanderModeles } from "@/lib/scoring";
import { calculerFinancement } from "@/lib/financement";
import type {
  ComparatifFinancement,
  Energie,
  ModeFinancement,
  ProfilUtilisateur,
  RecommandationModele,
  Vehicule,
} from "@/lib/types";

export interface DecisionAgent {
  modele: { id: string; marque: string; modele: string; score: number };
  energie: Energie;
  financement: ModeFinancement;
  justificationFinancement: string;
}

export interface ResultatAgent {
  decision: DecisionAgent | null;
  recommandations: RecommandationModele[];
  comparatif: ComparatifFinancement | null;
  synthese: string;
}

// État partagé entre les nœuds du graphe.
const EtatAgent = Annotation.Root({
  profil: Annotation<ProfilUtilisateur>(),
  recommandations: Annotation<RecommandationModele[]>({
    reducer: (_, n) => n,
    default: () => [],
  }),
  comparatif: Annotation<ComparatifFinancement | null>({
    reducer: (_, n) => n,
    default: () => null,
  }),
  decision: Annotation<DecisionAgent | null>({
    reducer: (_, n) => n,
    default: () => null,
  }),
  synthese: Annotation<string>({ reducer: (_, n) => n, default: () => "" }),
});

const LABEL_MODE: Record<ModeFinancement, string> = {
  comptant: "achat comptant",
  credit: "crédit auto",
  loa: "LOA",
  lld: "LLD",
};

const LABEL_ENERGIE: Record<Energie, string> = {
  essence: "essence",
  diesel: "diesel",
  hybride: "hybride",
  "hybride-rechargeable": "hybride rechargeable",
  electrique: "électrique",
};

/**
 * Construit et exécute le graphe décisionnel pour un profil donné.
 */
export async function executerAgent(profil: ProfilUtilisateur): Promise<ResultatAgent> {
  const graphe = new StateGraph(EtatAgent)
    // 1) Recommander les modèles via le moteur de scoring.
    .addNode("recommander", async (s) => ({
      recommandations: recommanderModeles(s.profil, catalogue as Vehicule[], 4),
    }))
    // 2) Calculer le financement sur le meilleur modèle.
    .addNode("financer", async (s) => {
      const top = s.recommandations[0];
      if (!top) return { comparatif: null };
      const prix = Math.round((top.prixIndicatif.min + top.prixIndicatif.max) / 2);
      return { comparatif: calculerFinancement(s.profil, prix) };
    })
    // 3) Arrêter la décision (modèle + mode de financement).
    .addNode("decider", async (s) => {
      const top = s.recommandations[0];
      if (!top || !s.comparatif) return { decision: null };
      const decision: DecisionAgent = {
        modele: {
          id: top.vehicule.id,
          marque: top.vehicule.marque,
          modele: top.vehicule.modele,
          score: top.score,
        },
        energie: top.energieConseillee,
        financement: s.comparatif.modeRecommande,
        justificationFinancement: s.comparatif.justification,
      };
      return { decision };
    })
    // 4) Rédiger la synthèse (déterministe, enrichie par l'IA si dispo).
    .addNode("rediger", async (s) => {
      if (!s.decision) return { synthese: "" };
      const base = syntheseDeterministe(s.decision, s.recommandations);
      const enrichie = await syntheseIA(s.profil, s.decision, s.recommandations);
      return { synthese: enrichie ?? base };
    })
    .addEdge(START, "recommander")
    .addEdge("recommander", "financer")
    .addEdge("financer", "decider")
    .addEdge("decider", "rediger")
    .addEdge("rediger", END)
    .compile();

  const etat = await graphe.invoke({ profil });

  return {
    decision: etat.decision,
    recommandations: etat.recommandations,
    comparatif: etat.comparatif,
    synthese: etat.synthese,
  };
}

/** Synthèse rédigée sans IA (toujours disponible). */
function syntheseDeterministe(
  decision: DecisionAgent,
  recommandations: RecommandationModele[],
): string {
  const alternatives = recommandations
    .slice(1, 3)
    .map((r) => `${r.vehicule.marque} ${r.vehicule.modele}`)
    .join(", ");
  return (
    `Pour votre profil, le meilleur choix est la ${decision.modele.marque} ${decision.modele.modele} ` +
    `en ${LABEL_ENERGIE[decision.energie]} (adéquation ${decision.modele.score}/100), ` +
    `financée idéalement en ${LABEL_MODE[decision.financement]}. ${decision.justificationFinancement}` +
    (alternatives ? ` À considérer aussi : ${alternatives}.` : "")
  );
}

/** Synthèse enrichie par l'API Anthropic (optionnelle, côté serveur). */
async function syntheseIA(
  profil: ProfilUtilisateur,
  decision: DecisionAgent,
  recommandations: RecommandationModele[],
): Promise<string | null> {
  const cle = process.env.ANTHROPIC_API_KEY;
  if (!cle) return null;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: cle });
    const modele = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
    const liste = recommandations
      .map((r) => `- ${r.vehicule.marque} ${r.vehicule.modele} (${r.score}/100)`)
      .join("\n");
    const reponse = await client.messages.create({
      model: modele,
      max_tokens: 400,
      system:
        "Tu es un conseiller automobile neutre et indépendant. Tu rédiges en français, " +
        "clair et bienveillant, sans jargon. Tu justifies une décision déjà prise.",
      messages: [
        {
          role: "user",
          content:
            `Profil : kilométrage ${profil.kilometrageAnnuel}, détention ${profil.dureeDetention}, ` +
            `recharge ${profil.rechargeDomicile}, profil ${profil.profilAcheteur}, ` +
            `préférence ${profil.preference}.\n` +
            `Décision : ${decision.modele.marque} ${decision.modele.modele} en ${LABEL_ENERGIE[decision.energie]}, ` +
            `financement en ${LABEL_MODE[decision.financement]}.\n` +
            `Modèles candidats :\n${liste}\n\n` +
            "Rédige une synthèse de 3-4 phrases expliquant pourquoi ce choix est le bon pour cette personne.",
        },
      ],
    });
    const texte = reponse.content
      .filter((b): b is { type: "text"; text: string } => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return texte || null;
  } catch {
    return null;
  }
}
