import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FicheComplete } from "@/components/immatriculation/fiche-complete";
import { rechercherFicheVehicule } from "@/lib/immatriculation/adapters";
import { formaterPlaque, normaliserPlaque } from "@/lib/immatriculation/types";

interface Params {
  params: { plaque: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const plaque = formaterPlaque(decodeURIComponent(params.plaque));
  return {
    title: `Fiche véhicule ${plaque}`,
    description: `Fiche technique du véhicule immatriculé ${plaque} : marque, modèle, énergie, puissance, performances, VIN.`,
  };
}

/** Page dédiée affichant la fiche complète d'un véhicule à partir de sa plaque. */
export default async function FichePlaquePage({ params }: Params) {
  const plaque = decodeURIComponent(params.plaque);
  const fiche = normaliserPlaque(plaque).length >= 5
    ? await rechercherFicheVehicule(plaque)
    : null;

  return (
    <div className="container py-10 md:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/immatriculation">
          <ArrowLeft className="h-4 w-4" />
          Nouvelle recherche
        </Link>
      </Button>

      {fiche ? (
        <>
          <FicheComplete fiche={fiche} />

          {/* Passerelle vers le conseil */}
          <Card className="mt-10 bg-card">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:justify-between md:text-left">
              <div>
                <h2 className="font-display text-xl font-bold">Vous envisagez d'acheter ce type de véhicule ?</h2>
                <p className="mt-1 text-muted-foreground">
                  Découvrez s'il vous correspond et le meilleur mode de financement.
                </p>
              </div>
              <Button asChild variant="accent" className="shrink-0">
                <Link href="/questionnaire">
                  Obtenir mon conseil
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mx-auto max-w-lg text-center">
          <CardContent className="p-10">
            <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Aucune fiche trouvée</h1>
            <p className="mt-2 text-muted-foreground">
              Nous n'avons pas pu identifier le véhicule pour la plaque{" "}
              <strong>{formaterPlaque(plaque)}</strong>. Vérifiez la saisie et réessayez.
            </p>
            <Button asChild className="mt-6">
              <Link href="/immatriculation">Réessayer</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
