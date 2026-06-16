import { Car, Gauge, FileText, Fuel, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEuros } from "@/lib/utils";
import type { FicheVehicule } from "@/lib/immatriculation/types";

function Ligne({ label, valeur }: { label: string; valeur?: React.ReactNode }) {
  if (valeur === undefined || valeur === null || valeur === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold">{valeur}</span>
    </div>
  );
}

function Bloc({
  titre,
  icone: Icone,
  children,
}: {
  titre: string;
  icone: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-2 flex items-center gap-2 font-display text-sm font-bold">
          <Icone className="h-4 w-4 text-accent" />
          {titre}
        </p>
        <div>{children}</div>
      </CardContent>
    </Card>
  );
}

/** Fiche technique complète d'un véhicule (rendu détaillé, page dédiée). */
export function FicheComplete({ fiche }: { fiche: FicheVehicule }) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {fiche.imageUrl ? (
          <div className="flex aspect-[4/3] w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border bg-secondary/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fiche.imageUrl}
              alt={`${fiche.marque} ${fiche.modele}`}
              className="max-h-full w-auto object-contain"
            />
          </div>
        ) : null}
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-md border-2 border-foreground/80 bg-white px-3 py-1 font-display text-xl font-bold tracking-widest text-black">
              {fiche.immatriculation}
            </span>
            {fiche.exemple ? <Badge variant="secondary">Démonstration</Badge> : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
            {fiche.marque} {fiche.modele}
          </h1>
          {fiche.version ? (
            <p className="mt-1 text-lg text-muted-foreground">{fiche.version}</p>
          ) : null}
        </div>
      </div>

      {/* Blocs détaillés */}
      <div className="grid gap-4 md:grid-cols-2">
        <Bloc titre="Identité" icone={Car}>
          <Ligne label="Marque" valeur={fiche.marque} />
          <Ligne label="Modèle" valeur={fiche.modele} />
          <Ligne label="Version" valeur={fiche.version} />
          <Ligne label="Année" valeur={fiche.annee} />
          <Ligne label="1re mise en circulation" valeur={fiche.dateMiseCirculation} />
          <Ligne label="Genre" valeur={fiche.genre} />
          <Ligne label="Carrosserie" valeur={fiche.carrosserie} />
        </Bloc>

        <Bloc titre="Moteur & énergie" icone={Fuel}>
          <Ligne label="Énergie" valeur={fiche.energie} />
          <Ligne label="Crit'Air" valeur={fiche.critair} />
          <Ligne label="Puissance" valeur={fiche.puissanceCh ? `${fiche.puissanceCh} ch` : undefined} />
          <Ligne label="Puissance fiscale" valeur={fiche.puissanceFiscaleCv ? `${fiche.puissanceFiscaleCv} CV` : undefined} />
          <Ligne label="Couple" valeur={fiche.coupleNm ? `${fiche.coupleNm} Nm` : undefined} />
          <Ligne label="Cylindres" valeur={fiche.cylindres} />
          <Ligne label="Boîte de vitesse" valeur={fiche.boite} />
          <Ligne label="Émissions CO₂" valeur={fiche.co2 ? `${fiche.co2} g/km` : undefined} />
          <Ligne label="Norme euro" valeur={fiche.normeEuro} />
          <Ligne label="Prix neuf" valeur={fiche.prixNeuf ? formatEuros(fiche.prixNeuf) : undefined} />
        </Bloc>

        {(fiche.acceleration0a100 || fiche.vitesseMax) && (
          <Bloc titre="Performances" icone={Gauge}>
            <Ligne label="0 à 100 km/h" valeur={fiche.acceleration0a100 ? `${fiche.acceleration0a100} s` : undefined} />
            <Ligne label="Vitesse max" valeur={fiche.vitesseMax ? `${fiche.vitesseMax} km/h` : undefined} />
          </Bloc>
        )}

        <Bloc titre="Administratif" icone={FileText}>
          <Ligne label="N° de série (VIN)" valeur={fiche.vin} />
          <Ligne label="TVV / CNIT" valeur={fiche.tvv} />
        </Bloc>
      </div>

      <p className="flex items-start gap-2 rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Informations fournies à titre indicatif d'après les données disponibles
        pour cette immatriculation. Certaines caractéristiques peuvent varier
        selon la finition exacte du véhicule.
      </p>
    </div>
  );
}
