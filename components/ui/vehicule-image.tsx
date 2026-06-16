"use client";

import * as React from "react";
import { Car } from "lucide-react";

import { cn } from "@/lib/utils";
import { urlImageVehicule, type InfosImageVehicule } from "@/lib/vehicule-image";

/**
 * Affiche la photo d'un véhicule (CDN imagin.studio) sur un fond dégradé.
 * En cas d'échec de chargement, bascule proprement sur un visuel de repli
 * (silhouette de voiture) pour ne jamais casser la mise en page.
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

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary",
        className,
      )}
    >
      {/* Halo décoratif */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />

      {erreur ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Car className="h-12 w-12" />
          <span className="text-xs">{vehicule.marque} {vehicule.modele}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlImageVehicule(vehicule, angle ? { angle } : undefined)}
          alt={alt}
          loading="lazy"
          onError={() => setErreur(true)}
          className="relative z-10 max-h-full w-auto max-w-[92%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}
