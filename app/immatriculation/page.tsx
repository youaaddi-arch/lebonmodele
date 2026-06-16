import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ScanLine } from "lucide-react";

import { PlaqueScanner } from "@/components/immatriculation/plaque-scanner";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scanner de plaque — identifiez un véhicule en un instant",
  description:
    "Entrez une plaque d'immatriculation et obtenez la fiche technique du véhicule : marque, modèle, version, énergie, Crit'Air, puissance, performances, VIN, norme euro.",
};

export default function ImmatriculationPage() {
  return (
    <>
      {/* Bannière : grille en transparence sur fond image (voiture) */}
      <section className="relative overflow-hidden bg-foreground text-background">
        {/* Fond image (voiture) en filigrane */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://cdn.imagin.studio/getImage?customer=hrjavascript-mastery&make=peugeot&modelFamily=208&angle=23&zoomType=fullscreen&fileType=png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
          }}
        />
        {/* Grille en transparence */}
        <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-70" />
        {/* Voile dégradé pour la lisibilité */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent" />

        <div className="container relative py-16 md:py-24">
          <p className="eyebrow flex items-center gap-2 text-background/70">
            <ScanLine className="h-4 w-4" />
            Scanner de plaque
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold md:text-5xl">
            Une plaque. Toute la fiche du véhicule.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-background/70">
            Marque, modèle, version, énergie, Crit'Air, puissance, performances,
            VIN, norme euro… Saisissez une immatriculation et obtenez l'essentiel
            en un instant.
          </p>

          <div className="mt-8 max-w-2xl">
            <PlaqueScanner variante="sombre" />
          </div>
        </div>
      </section>

      {/* Lien vers le conseil */}
      <section className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Vous cherchez plutôt quelle voiture acheter ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Notre questionnaire vous recommande les modèles faits pour vous et le
          meilleur mode de financement.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/questionnaire">
            Trouver ma voiture
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>
    </>
  );
}
