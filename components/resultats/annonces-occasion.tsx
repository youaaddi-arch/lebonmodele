"use client";

import * as React from "react";
import { Gauge, Info, MapPin, ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEuros } from "@/lib/utils";
import type { AnnonceOccasion, SourceAnnonce } from "@/lib/annonces/types";

const SOURCE_LABEL: Record<SourceAnnonce, string> = {
  leboncoin: "Particuliers & pros",
  lacentrale: "Réseau pro",
};

/** Construit l'URL de recherche Leboncoin (catégorie voitures) pour un modèle. */
function urlLeboncoin(marque: string, modele: string): string {
  const texte = encodeURIComponent(`${marque} ${modele}`);
  return `https://www.leboncoin.fr/recherche?category=2&text=${texte}`;
}

/** Construit l'URL de recherche La Centrale pour un modèle. */
function urlLaCentrale(marque: string, modele: string): string {
  const param = encodeURIComponent(`${marque.toUpperCase()}:${modele}`);
  return `https://www.lacentrale.fr/listing?makesModelsCommercialNames=${param}`;
}

/**
 * Bloc « occasions repérées » pour un modèle.
 * - Boutons : recherche RÉELLE pré-remplie sur Leboncoin et La Centrale
 *   (liens directs, sans scraping — conforme à leurs conditions).
 * - Cartes : exemples indicatifs cohérents avec la cote (illustration du marché),
 *   issus de /api/annonces.
 */
export function AnnoncesOccasion({
  vehiculeId,
  marque,
  modele,
}: {
  vehiculeId: string;
  marque: string;
  modele: string;
}) {
  const [annonces, setAnnonces] = React.useState<AnnonceOccasion[] | null>(null);
  const [chargement, setChargement] = React.useState(true);

  React.useEffect(() => {
    let actif = true;
    setChargement(true);
    fetch("/api/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehiculeId }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (actif) setAnnonces(d?.annonces ?? []);
      })
      .catch(() => actif && setAnnonces([]))
      .finally(() => actif && setChargement(false));
    return () => {
      actif = false;
    };
  }, [vehiculeId]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-xl font-bold">
          Occasions similaires · {marque} {modele}
        </h3>
        <p className="text-sm text-muted-foreground">
          Voyez les annonces réelles de ce modèle en un clic, et un aperçu des
          niveaux de prix du marché.
        </p>
      </div>

      {/* Accès réels aux places de marché (liens pré-remplis) */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <a href={urlLeboncoin(marque, modele)} target="_blank" rel="noopener noreferrer">
            Voir sur Leboncoin
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={urlLaCentrale(marque, modele)} target="_blank" rel="noopener noreferrer">
            Voir sur La Centrale
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Aperçu indicatif des prix */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chargement
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-2/3 rounded bg-secondary" />
                  <div className="h-8 w-1/2 rounded bg-secondary" />
                  <div className="h-4 w-full rounded bg-secondary" />
                </CardContent>
              </Card>
            ))
          : annonces?.map((a) => (
              <Card key={a.id} className="card-hover">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {SOURCE_LABEL[a.source]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{a.annee}</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-primary">
                    {formatEuros(a.prix)}
                  </p>
                  <p className="font-medium">{a.titre}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      {a.kilometrage.toLocaleString("fr-FR")} km
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {a.ville}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {a.carburant} · {a.boite}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <p className="flex items-start gap-2 rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Les boutons ouvrent une recherche réelle pré-remplie sur Leboncoin et La
        Centrale. Les cartes ci-dessus sont des repères de prix indicatifs (cote
        du modèle), pas des annonces réelles.
      </p>
    </div>
  );
}
