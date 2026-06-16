"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  imagesReellesActives,
  urlImageVehicule,
  type InfosImageVehicule,
} from "@/lib/vehicule-image";
import { CarSilhouette } from "@/components/ui/car-silhouette";

/**
 * Affiche la photo d'un véhicule (CDN imagin.studio) sur un fond dégradé.
 *
 * - Si aucune clé imagin propre n'est configurée (clé de démo filigranée), on
 *   affiche une silhouette propre SANS filigrane plutôt qu'une photo marquée.
 * - En cas d'échec de chargement d'une vraie photo, repli sur la silhouette.
 */
export function VehiculeImage({
  vehicule,
  alt,
  className,
  angle,
}: {
  vehicule: InfosImageVehicule;
  alt: string;
  className?: string;
  angle?: string;
}) {
  const [erreur, setErreur] = React.useState(false);
  const afficherPhoto = imagesReellesActives && !erreur;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />

      {afficherPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlImageVehicule(vehicule, angle ? { angle } : undefined)}
          alt={alt}
          loading="lazy"
          onError={() => setErreur(true)}
          className="relative z-10 max-h-full w-auto max-w-[92%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="relative z-10 flex w-full flex-col items-center gap-2 px-6">
          <CarSilhouette className="w-3/4 max-w-[220px] text-muted-foreground/35" />
          <span className="text-xs font-medium text-muted-foreground">
            {vehicule.marque} {vehicule.modele}
          </span>
        </div>
      )}
    </div>
  );
}
