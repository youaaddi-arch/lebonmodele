"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModelCard } from "@/components/resultats/model-card";
import { ComparateurFinancement } from "@/components/resultats/comparateur-financement";
import { AnnoncesOccasion } from "@/components/resultats/annonces-occasion";
import { AgentDecision } from "@/components/resultats/agent-decision";
import { recommanderModeles } from "@/lib/scoring";
import { calculerFinancement } from "@/lib/financement";
import { lireProfilStocke } from "@/lib/questionnaire-store";
import catalogue from "@/data/vehicules.json";
import type {
  ComparatifFinancement,
  ProfilUtilisateur,
  RecommandationModele,
  Vehicule,
} from "@/lib/types";

export default function ResultatsPage() {
  const router = useRouter();
  const [profil, setProfil] = React.useState<ProfilUtilisateur | null | undefined>(undefined);
  const [recos, setRecos] = React.useState<RecommandationModele[]>([]);
  const [comparatif, setComparatif] = React.useState<ComparatifFinancement | null>(null);

  // Lecture du profil + calcul déterministe au montage.
  React.useEffect(() => {
    const p = lireProfilStocke();
    setProfil(p);
    if (!p) return;

    const r = recommanderModeles(p, catalogue as Vehicule[], 4);
    setRecos(r);

    // Prix de référence du meilleur modèle pour la simulation de financement.
    if (r.length) {
      const prixRef = (r[0].prixIndicatif.min + r[0].prixIndicatif.max) / 2;
      setComparatif(calculerFinancement(p, Math.round(prixRef)));
    }
  }, []);

  // Aucun profil : invitation à remplir le questionnaire.
  if (profil === null) {
    return (
      <div className="container py-20">
        <Card className="mx-auto max-w-lg text-center">
          <CardContent className="p-10">
            <h1 className="text-2xl font-bold">Aucune réponse trouvée</h1>
            <p className="mt-2 text-muted-foreground">
              Décrivez vos besoins pour découvrir les voitures faites pour vous.
            </p>
            <Button asChild className="mt-6">
              <Link href="/questionnaire">Trouver ma voiture idéale</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profil === undefined) {
    return <div className="container py-20 text-center text-muted-foreground">Analyse de votre profil…</div>;
  }

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vos recommandations</h1>
          <p className="mt-1 text-muted-foreground">
            Voici les modèles qui vous correspondent le mieux et la solution de
            financement la plus adaptée.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/questionnaire")}>
          <Pencil className="h-4 w-4" />
          Modifier mes réponses
        </Button>
      </div>

      {/* Décision de l'agent LangGraph (dégrade proprement sans clé IA) */}
      <AgentDecision profil={profil} />

      {/* Modèles recommandés */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Modèles recommandés</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {recos.map((reco, i) => (
            <ModelCard key={reco.vehicule.id} reco={reco} rang={i + 1} />
          ))}
        </div>
      </section>

      {/* Comparateur de financement */}
      {comparatif ? (
        <section className="mt-12">
          <h2 className="mb-1 text-xl font-bold">Comment financer votre voiture ?</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Comparaison basée sur la {recos[0]?.vehicule.marque} {recos[0]?.vehicule.modele}{" "}
            (prix médian estimé). Adaptez via le{" "}
            <Link href="/guides/loa-lld-credit-comptant" className="underline">
              guide financement
            </Link>
            .
          </p>
          <ComparateurFinancement comparatif={comparatif} />
        </section>
      ) : null}

      {/* Occasions repérées pour le meilleur modèle */}
      {recos[0] ? (
        <section className="mt-12">
          <AnnoncesOccasion
            vehiculeId={recos[0].vehicule.id}
            marque={recos[0].vehicule.marque}
            modele={recos[0].vehicule.modele}
          />
        </section>
      ) : null}

      <div className="mt-12 text-center">
        <Button variant="ghost" asChild>
          <Link href="/questionnaire?etape=0">
            <ArrowLeft className="h-4 w-4" />
            Recommencer
          </Link>
        </Button>
      </div>
    </div>
  );
}
