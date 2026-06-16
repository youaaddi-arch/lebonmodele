import { NextResponse } from "next/server";

import type { ProfilUtilisateur } from "@/lib/types";

/**
 * Route API (Phase 2, optionnelle) : génère un résumé personnalisé via l'API
 * Anthropic, exécutée UNIQUEMENT côté serveur.
 *
 * - La clé `ANTHROPIC_API_KEY` n'est jamais exposée au client.
 * - Si la clé est absente, on renvoie 503 : le front ignore alors la synthèse
 *   et le site reste pleinement fonctionnel grâce au moteur déterministe.
 */

export const runtime = "nodejs";

interface CorpsRequete {
  profil: ProfilUtilisateur;
  modeles: { nom: string; score: number }[];
}

export async function POST(request: Request) {
  const cle = process.env.ANTHROPIC_API_KEY;

  // Pas de clé → on signale que l'IA est indisponible (comportement attendu).
  if (!cle) {
    return NextResponse.json(
      { erreur: "Couche IA non configurée. Le conseil déterministe reste disponible." },
      { status: 503 },
    );
  }

  let corps: CorpsRequete;
  try {
    corps = (await request.json()) as CorpsRequete;
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  try {
    // Import dynamique : le SDK n'est chargé que si la clé est présente.
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: cle });

    const modele = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

    const prompt = construirePrompt(corps);

    const reponse = await client.messages.create({
      model: modele,
      max_tokens: 600,
      system:
        "Tu es un conseiller automobile neutre et indépendant. Tu rédiges en français, " +
        "dans un langage clair et bienveillant, sans jargon. Tu ne vends rien : tu aides à décider. " +
        "Tu rappelles que les modèles proposés sont issus d'une analyse et que les chiffres de " +
        "financement sont indicatifs.",
      messages: [{ role: "user", content: prompt }],
    });

    const resume = reponse.content
      .filter((bloc): bloc is { type: "text"; text: string } => bloc.type === "text")
      .map((bloc) => bloc.text)
      .join("\n")
      .trim();

    return NextResponse.json({ resume });
  } catch (err) {
    console.error("Erreur API Anthropic :", err);
    return NextResponse.json(
      { erreur: "La synthèse IA est momentanément indisponible." },
      { status: 502 },
    );
  }
}

/** Construit le prompt utilisateur à partir du profil et des modèles retenus. */
function construirePrompt({ profil, modeles }: CorpsRequete): string {
  const listeModeles = modeles.map((m) => `- ${m.nom} (adéquation ${m.score}/100)`).join("\n");
  return [
    "Voici le profil d'une personne cherchant une voiture :",
    `- Mode de budget : ${profil.modeBudget}`,
    profil.budgetTotal ? `- Budget total : ${profil.budgetTotal} €` : "",
    profil.mensualiteMax ? `- Mensualité max : ${profil.mensualiteMax} €` : "",
    `- Kilométrage annuel : ${profil.kilometrageAnnuel}`,
    `- Usages : ${profil.usages.join(", ")}`,
    `- Recharge possible : ${profil.rechargeDomicile}`,
    `- Places : ${profil.nombrePlaces}`,
    `- Durée de détention envisagée : ${profil.dureeDetention}`,
    `- Ouverture à la location : ${profil.ouvertureLocation}`,
    `- Préférence : ${profil.preference}`,
    `- Profil : ${profil.profilAcheteur}`,
    "",
    "Modèles recommandés par notre moteur :",
    listeModeles,
    "",
    "Rédige une synthèse personnalisée de 4 à 6 phrases : explique pourquoi ces modèles " +
      "conviennent, quel mode de financement privilégier au vu du profil, et un conseil pratique. " +
      "Reste neutre et factuel.",
  ]
    .filter(Boolean)
    .join("\n");
}
