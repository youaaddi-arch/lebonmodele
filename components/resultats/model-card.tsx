import { Check, X } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            {rang === 1 ? (
              <Badge variant="accent" className="mb-2">
                Notre meilleure adéquation
              </Badge>
            ) : null}
            <h3 className="text-xl font-bold">
              {vehicule.marque} {vehicule.modele}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {vehicule.carrosserie} · {ENERGIE_LABEL[energieConseillee]} ·{" "}
              {vehicule.places} places
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-xl font-bold">{score}</span>
              <span className="text-[10px] uppercase tracking-wide">/ 100</span>
            </div>
            <span className="mt-1 block text-[11px] text-muted-foreground">Adéquation</span>
          </div>
        </div>
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
