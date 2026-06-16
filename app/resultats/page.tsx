"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModelCard } from "@/components/resultats/model-card";
import { ComparateurFinancement } from "@/components/resultats/comparateur-financement";
import { AnnoncesOccasion } from "@/components/resultats/annonces-occasion";
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
              Remplissez le questionnaire pour découvrir les modèles et le
              financement adaptés à votre profil.
            </p>
            <Button asChild className="mt-6">
              <Link href="/questionnaire">Démarrer le questionnaire</Link>
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

      {/* Résumé IA optionnel (dégradé proprement sans clé API) */}
      <ResumeIA profil={profil} recos={recos} />

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
            titreModele={`${recos[0].vehicule.marque} ${recos[0].vehicule.modele}`}
          />
        </section>
      ) : null}

      <div className="mt-12 text-center">
        <Button variant="ghost" asChild>
          <Link href="/questionnaire?etape=0">
            <ArrowLeft className="h-4 w-4" />
            Refaire le questionnaire
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Bloc « résumé personnalisé ». Tente d'appeler la route IA ; si la clé API
 * n'est pas configurée (réponse 503), on n'affiche tout simplement rien :
 * le site reste pleinement fonctionnel sans IA.
 */
function ResumeIA({
  profil,
  recos,
}: {
  profil: ProfilUtilisateur;
  recos: RecommandationModele[];
}) {
  const [resume, setResume] = React.useState<string | null>(null);
  const [chargement, setChargement] = React.useState(false);
  const dejaAppele = React.useRef(false);

  React.useEffect(() => {
    if (!recos.length || dejaAppele.current) return;
    dejaAppele.current = true;
    setChargement(true);

    fetch("/api/recommander", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profil,
        modeles: recos.map((r) => ({
          nom: `${r.vehicule.marque} ${r.vehicule.modele}`,
          score: r.score,
        })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.resume as string | undefined;
      })
      .then((r) => setResume(r ?? null))
      .catch(() => setResume(null))
      .finally(() => setChargement(false));
  }, [profil, recos]);

  if (!chargement && !resume) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-start gap-3 p-5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold">Votre synthèse personnalisée</p>
          {chargement ? (
            <p className="mt-1 text-sm text-muted-foreground">Rédaction de votre conseil sur mesure…</p>
          ) : (
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{resume}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
