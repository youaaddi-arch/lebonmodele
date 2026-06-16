import { NextResponse } from "next/server";

import { rechercherFicheVehicule, sourceReelleActive } from "@/lib/immatriculation/adapters";
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
        erreur: sourceReelleActive
          ? "Plaque non reconnue. Vérifiez la saisie (format AA-123-AA, véhicule immatriculé en France) et réessayez."
          : "Aucune fiche trouvée. Configurez une source de données (REGCHECK_USERNAME) côté serveur pour interroger toutes les plaques.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ fiche });
}
