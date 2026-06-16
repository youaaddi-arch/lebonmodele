"use client";

import * as React from "react";
import { Search, Loader2, Car, Gauge, FileText, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formaterPlaque, type FicheVehicule } from "@/lib/immatriculation/types";
import { formatEuros } from "@/lib/utils";

/**
 * Scanner de plaque : on saisit une plaque, on obtient la fiche technique
 * complète du véhicule (même fonctionnalité qu'une app de scan de plaque).
 * Variante visuelle « clair » (sur fond clair) ou « sombre » (sur bannière).
 */
export function PlaqueScanner({ variante = "clair" }: { variante?: "clair" | "sombre" }) {
  const [plaque, setPlaque] = React.useState("");
  const [fiche, setFiche] = React.useState<FicheVehicule | null>(null);
  const [erreur, setErreur] = React.useState<string | null>(null);
  const [chargement, setChargement] = React.useState(false);

  async function rechercher(e: React.FormEvent) {
    e.preventDefault();
    if (!plaque.trim()) return;
    setChargement(true);
    setErreur(null);
    setFiche(null);
    try {
      const res = await fetch("/api/immatriculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plaque }),
      });
      const data = await res.json();
      if (!res.ok) setErreur(data.erreur ?? "Une erreur est survenue.");
      else setFiche(data.fiche as FicheVehicule);
    } catch {
      setErreur("Service momentanément indisponible.");
    } finally {
      setChargement(false);
    }
  }

  const sombre = variante === "sombre";

  return (
    <div className="w-full">
      {/* Champ plaque + bouton */}
      <form onSubmit={rechercher} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 overflow-hidden rounded-lg border-2 border-foreground/80 bg-white shadow-sm">
          <span className="flex w-10 flex-col items-center justify-center bg-[#003399] text-[10px] font-bold text-white">
            <span className="text-yellow-300">★</span>
            F
          </span>
          <input
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
            placeholder="GW-279-AF"
            aria-label="Plaque d'immatriculation"
            maxLength={12}
            className="w-full bg-white px-4 py-3 text-center font-display text-2xl font-bold uppercase tracking-widest text-black placeholder:text-black/30 focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg" disabled={chargement} variant={sombre ? "accent" : "default"}>
          {chargement ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          Identifier
        </Button>
      </form>

      {erreur ? (
        <p className={`mt-3 text-sm ${sombre ? "text-background/80" : "text-destructive"}`}>{erreur}</p>
      ) : null}

      {/* Fiche résultat */}
      {fiche ? <FicheResultat fiche={fiche} /> : null}
    </div>
  );
}

function Ligne({ label, valeur }: { label: string; valeur?: React.ReactNode }) {
  if (valeur === undefined || valeur === null || valeur === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold">{valeur}</span>
    </div>
  );
}

function Section({ titre, icone: Icone, children }: { titre: string; icone: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 font-display text-sm font-bold">
        <Icone className="h-4 w-4 text-accent" />
        {titre}
      </p>
      <div className="rounded-lg border border-border bg-card px-4">{children}</div>
    </div>
  );
}

function FicheResultat({ fiche }: { fiche: FicheVehicule }) {
  return (
    <Card className="mt-6 overflow-hidden text-left">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Immatriculation</p>
            <p className="font-display text-2xl font-extrabold">
              {formaterPlaque(fiche.immatriculation)}
            </p>
          </div>
          {fiche.exemple ? <Badge variant="secondary">Démonstration</Badge> : null}
        </div>

        <p className="font-display text-xl font-bold">
          🚗 {fiche.marque} {fiche.modele}
        </p>

        <Section titre="Véhicule" icone={Car}>
          <Ligne label="Version" valeur={fiche.version} />
          <Ligne label="Énergie" valeur={fiche.energie} />
          <Ligne label="Crit'Air" valeur={fiche.critair} />
          <Ligne label="Puissance" valeur={fiche.puissanceCh ? `${fiche.puissanceCh} CH` : undefined} />
          <Ligne label="Couple" valeur={fiche.coupleNm ? `${fiche.coupleNm} Nm` : undefined} />
          <Ligne label="Boîte de vitesse" valeur={fiche.boite} />
          <Ligne label="Prix neuf" valeur={fiche.prixNeuf ? formatEuros(fiche.prixNeuf) : undefined} />
        </Section>

        {(fiche.acceleration0a100 || fiche.vitesseMax) && (
          <Section titre="Performances" icone={Gauge}>
            <Ligne label="0 à 100 km/h" valeur={fiche.acceleration0a100 ? `${fiche.acceleration0a100} sec` : undefined} />
            <Ligne label="Vitesse max" valeur={fiche.vitesseMax ? `${fiche.vitesseMax} km/h` : undefined} />
          </Section>
        )}

        <Section titre="Divers" icone={FileText}>
          <Ligne label="VIN" valeur={fiche.vin} />
          <Ligne label="TVV" valeur={fiche.tvv} />
          <Ligne label="Norme euro" valeur={fiche.normeEuro} />
        </Section>

        {fiche.exemple ? (
          <p className="flex items-start gap-2 rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Fiche de démonstration. Connectez une API de plaque officielle
            (clé serveur) pour interroger n'importe quelle plaque en temps réel.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
