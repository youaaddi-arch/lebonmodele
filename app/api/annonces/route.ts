import { NextResponse } from "next/server";

import catalogue from "@/data/vehicules.json";
import { rechercherAnnonces } from "@/lib/annonces/adapters";
import type { Vehicule } from "@/lib/types";

/**
 * Route API des annonces d'occasion.
 *
 * Exécutée côté serveur : c'est ici que vivraient les clés d'accès à de vraies
 * sources (API officielle / flux partenaire). Pour l'instant, elle renvoie des
 * annonces d'exemple cohérentes avec le modèle demandé.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let vehiculeId: string | undefined;
  try {
    const corps = (await request.json()) as { vehiculeId?: string };
    vehiculeId = corps.vehiculeId;
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  const vehicule = (catalogue as Vehicule[]).find((v) => v.id === vehiculeId);
  if (!vehicule) {
    return NextResponse.json({ erreur: "Modèle introuvable." }, { status: 404 });
  }

  const annonces = await rechercherAnnonces({
    vehicule: {
      id: vehicule.id,
      marque: vehicule.marque,
      modele: vehicule.modele,
      prixOccasionMin: vehicule.prixOccasionMin,
      prixOccasionMax: vehicule.prixOccasionMax,
    },
    limite: 3,
  });

  return NextResponse.json({ annonces });
}
