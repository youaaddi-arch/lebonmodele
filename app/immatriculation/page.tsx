import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ScanLine } from "lucide-react";

import { PlaqueScanner } from "@/components/immatriculation/plaque-scanner";
import { Button } from "@/components/ui/button";
import { CarSilhouette } from "@/components/ui/car-silhouette";

export const metadata: Metadata = {
  title: "Scanner de plaque — identifiez un véhicule en un instant",
  description:
    "Entrez une plaque d'immatriculation et obtenez la fiche technique du véhicule : marque, modèle, version, énergie, Crit'Air, puissance, performances, VIN, norme euro.",
};

export default function ImmatriculationPage() {
  return (
    <>
      {/* Bannière scanner */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        <CarSilhouette className="pointer-events-none absolute -right-10 bottom-0 hidden h-3/4 w-auto text-foreground/[0.05] lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-50" />

        <div className="container relative py-16 md:py-24">
          <p className="eyebrow flex items-center gap-2 text-primary">
            <ScanLine className="h-4 w-4" />
            Scanner de plaque
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
            Une plaque. Toute la fiche du véhicule.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Marque, modèle, version, énergie, Crit'Air, puissance, performances,
            VIN, norme euro… Saisissez une immatriculation et obtenez l'essentiel
            en un instant.
          </p>

          <div className="mt-8 max-w-2xl">
            <PlaqueScanner />
          </div>
        </div>
      </section>

      {/* Lien vers le conseil */}
      <section className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Vous cherchez plutôt quelle voiture acheter ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Dites-nous vos besoins et votre budget : on vous trouve les voitures
          idéales pour vous (et le meilleur financement, en bonus).
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/questionnaire">
            Trouver ma voiture idéale
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>
    </>
  );
}
