import { NextResponse } from "next/server";

import { rechercherFicheVehicule } from "@/lib/immatriculation/adapters";
import { normaliserPlaque } from "@/lib/immatriculation/types";

/**
 * Route API de recherche par plaque d'immatriculation.
 * Exécutée côté serveur : c'est ici que vivrait la clé d'une API de plaque
 * officielle. Renvoie une fiche d'exemple tant qu'aucune source réelle n'est
 * branchée.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let plaque: string | undefined;
  try {
    const corps = (await request.json()) as { plaque?: string };
    plaque = corps.plaque;
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  if (!plaque || normaliserPlaque(plaque).length < 5) {
    return NextResponse.json(
      { erreur: "Plaque invalide. Format attendu : AA-123-AA." },
      { status: 400 },
    );
  }

  const fiche = await rechercherFicheVehicule(plaque);
  if (!fiche) {
    return NextResponse.json(
      {
        erreur:
          "Aucune fiche trouvée pour cette plaque. La base de démonstration ne " +
          "contient que la plaque GW-279-AF. Connectez une API de plaque officielle " +
          "(variable PLAQUE_API_KEY) pour des résultats réels.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ fiche });
}
