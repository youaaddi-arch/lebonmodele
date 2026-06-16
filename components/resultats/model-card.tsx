import { Check, X } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehiculeImage } from "@/components/ui/vehicule-image";
import { formatEuros } from "@/lib/utils";
import type { Energie, RecommandationModele } from "@/lib/types";

const ENERGIE_LABEL: Record<Energie, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  "hybride-rechargeable": "Hybride rechargeable",
  electrique: "Électrique",
};

/** Carte d'un modèle recommandé avec score, explication et points clés. */
export function ModelCard({
  reco,
  rang,
}: {
  reco: RecommandationModele;
  rang: number;
}) {
  const { vehicule, score, pourquoi, energieConseillee, prixIndicatif } = reco;

  return (
    <Card className="group flex h-full flex-col overflow-hidden card-hover">
      {/* Photo du modèle */}
      <div className="relative">
        <VehiculeImage
          vehicule={{ id: vehicule.id, marque: vehicule.marque, modele: vehicule.modele }}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          className="aspect-[16/10] w-full border-b"
        />
        {rang === 1 ? (
          <Badge variant="accent" className="absolute left-3 top-3 shadow-sm">
            Notre meilleure adéquation
          </Badge>
        ) : null}
        {/* Pastille de score */}
        <div className="absolute right-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-card/90 text-primary shadow-md backdrop-blur">
          <span className="text-lg font-bold leading-none">{score}</span>
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground">/100</span>
        </div>
      </div>

      <CardHeader>
        <h3 className="font-display text-xl font-bold">
          {vehicule.marque} {vehicule.modele}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">
          {vehicule.carrosserie} · {ENERGIE_LABEL[energieConseillee]} ·{" "}
          {vehicule.places} places
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="rounded-md bg-secondary/60 p-3 text-sm">{pourquoi}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Prix indicatif {prixIndicatif.neuf ? "(neuf)" : "(occasion)"}</p>
            <p className="font-semibold">
              {formatEuros(prixIndicatif.min)} – {formatEuros(prixIndicatif.max)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Coffre / conso</p>
            <p className="font-semibold">
              {vehicule.coffreL} L · {vehicule.consommation}
            </p>
          </div>
        </div>

        <div className="mt-auto grid gap-3 sm:grid-cols-2">
          <ul className="space-y-1.5 text-sm">
            {vehicule.pointsForts.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-1.5 text-sm">
            {vehicule.pointsFaibles.map((p) => (
              <li key={p} className="flex items-start gap-2 text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
