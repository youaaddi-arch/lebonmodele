"use client";

import * as React from "react";
import { Gauge, Info, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEuros } from "@/lib/utils";
import type { AnnonceOccasion, SourceAnnonce } from "@/lib/annonces/types";

const SOURCE_LABEL: Record<SourceAnnonce, string> = {
  leboncoin: "Particuliers & pros",
  lacentrale: "Réseau pro",
};

/**
 * Bloc « occasions repérées » pour un modèle.
 * Interroge la route serveur /api/annonces. Les annonces affichées sont des
 * exemples indicatifs (aucun lien sortant : la mise en relation réelle serait
 * un service payant à brancher ultérieurement).
 */
export function AnnoncesOccasion({
  vehiculeId,
  titreModele,
}: {
  vehiculeId: string;
  titreModele: string;
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

  if (!chargement && (!annonces || annonces.length === 0)) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold">
          Occasions repérées · {titreModele}
        </h3>
        <p className="text-sm text-muted-foreground">
          Un aperçu du marché de l'occasion pour ce modèle, agrégé depuis
          plusieurs places de marché.
        </p>
      </div>

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
        Exemples indicatifs générés à partir de la cote du modèle, destinés à
        illustrer le marché. La mise en relation avec de vraies annonces sera
        proposée ultérieurement via nos partenaires.
      </p>
    </div>
  );
}
