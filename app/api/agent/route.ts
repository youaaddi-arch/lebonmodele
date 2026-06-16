import { NextResponse } from "next/server";

import { executerAgent } from "@/lib/agent/graph";
import type { ProfilUtilisateur } from "@/lib/types";

/**
 * Route de l'agent décisionnel (LangGraph), exécutée côté serveur.
 * Reçoit le profil et renvoie la décision (modèle + financement) et sa synthèse.
 */
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let profil: ProfilUtilisateur | undefined;
  try {
    const corps = (await request.json()) as { profil?: ProfilUtilisateur };
    profil = corps.profil;
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  if (!profil) {
    return NextResponse.json({ erreur: "Profil manquant." }, { status: 400 });
  }

  try {
    const resultat = await executerAgent(profil);
    return NextResponse.json(resultat);
  } catch (err) {
    console.error("Erreur agent :", err);
    return NextResponse.json({ erreur: "L'agent est momentanément indisponible." }, { status: 502 });
  }
}
