"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  EtapeAcquisition,
  EtapeBudget,
  EtapeEmail,
  EtapePriorites,
  EtapeUsage,
  EtapeVehicule,
} from "./steps";

/** Définition des étapes du wizard. */
const ETAPES = [
  { titre: "Budget", description: "Combien souhaitez-vous investir ?", composant: EtapeBudget },
  { titre: "Usage & trajets", description: "Comment et combien roulez-vous ?", composant: EtapeUsage },
  { titre: "Le véhicule", description: "À quoi doit ressembler votre voiture ?", composant: EtapeVehicule },
  { titre: "Acquisition", description: "Acheter ou louer ? Pour combien de temps ?", composant: EtapeAcquisition },
  { titre: "Priorités", description: "Qu'est-ce qui compte le plus pour vous ?", composant: EtapePriorites },
  { titre: "Vos résultats", description: "Recevez vos recommandations.", composant: EtapeEmail },
];

/**
 * Wizard multi-étapes : barre de progression, navigation avant/arrière,
 * et redirection vers /resultats à la fin.
 *
 * @param etapeInitiale permet d'ouvrir directement une étape (modification
 * depuis la page résultats).
 */
export function Wizard({ etapeInitiale = 0 }: { etapeInitiale?: number }) {
  const router = useRouter();
  const [index, setIndex] = React.useState(
    Math.max(0, Math.min(etapeInitiale, ETAPES.length - 1)),
  );

  const etape = ETAPES[index];
  const Composant = etape.composant;
  const estDerniere = index === ETAPES.length - 1;
  const progression = ((index + 1) / ETAPES.length) * 100;

  function suivant() {
    if (estDerniere) {
      router.push("/resultats");
      return;
    }
    setIndex((i) => i + 1);
    remonter();
  }

  function precedent() {
    setIndex((i) => Math.max(0, i - 1));
    remonter();
  }

  function remonter() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progression */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Étape {index + 1} sur {ETAPES.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progression)} %</span>
        </div>
        <Progress value={progression} />
        {/* Repères d'étapes (desktop) */}
        <ol className="mt-4 hidden grid-cols-6 gap-2 md:grid">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="text-center">
              <span
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  i < index
                    ? "bg-accent text-accent-foreground"
                    : i === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < index ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">{e.titre}</span>
            </li>
          ))}
        </ol>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{etape.titre}</h1>
            <p className="mt-1 text-muted-foreground">{etape.description}</p>
          </div>

          <div className="animate-fade-in" key={index}>
            <Composant />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={precedent} disabled={index === 0}>
          <ArrowLeft className="h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={suivant} variant={estDerniere ? "accent" : "default"}>
          {estDerniere ? "Voir mes résultats" : "Continuer"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
