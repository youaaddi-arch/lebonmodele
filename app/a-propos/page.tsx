import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Lock, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "À propos : notre méthode et notre indépendance",
  description:
    "LeBonModèle est un service de conseil automobile neutre et indépendant. Découvrez notre positionnement, notre méthode de recommandation et nos engagements de transparence.",
};

export default function AProposPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Notre mission : vous aider, pas vous vendre</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            LeBonModèle est né d'un constat simple : choisir une voiture et son
            mode de financement est devenu un casse-tête. Entre les énergies,
            les segments, et le choix entre comptant, crédit, LOA et LLD, il est
            difficile de s'y retrouver seul, et les conseils disponibles sont
            souvent ceux de vendeurs.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icone: Lock,
              titre: "Indépendant",
              texte:
                "Nous ne sommes mandatés par aucun constructeur ni organisme de financement. Nos recommandations ne sont pas influencées par des commissions.",
            },
            {
              icone: Compass,
              titre: "Neutre",
              texte:
                "Notre seul objectif : vous orienter vers la solution réellement adaptée à votre situation, même si c'est de ne rien changer.",
            },
            {
              icone: ListChecks,
              titre: "Transparent",
              texte:
                "Notre méthode de scoring et nos paramètres financiers sont explicites. Les simulations sont clairement présentées comme indicatives.",
            },
          ].map((v) => (
            <Card key={v.titre}>
              <CardContent className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icone className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold">{v.titre}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.texte}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Notre méthode</h2>
          <p className="text-muted-foreground">
            Vos réponses au questionnaire sont croisées avec un catalogue de
            modèles populaires sur le marché français. Chaque modèle reçoit un
            score d'adéquation calculé à partir de vos contraintes (budget,
            nombre de places, énergie, recharge…) et de la pondération de vos
            priorités (prix, fiabilité, confort, écologie…).
          </p>
          <p className="text-muted-foreground">
            En parallèle, nous comparons les quatre modes de financement à partir
            de votre budget, de votre apport et de la durée pendant laquelle vous
            comptez garder la voiture. Les taux et valeurs résiduelles utilisés
            sont des <strong>paramètres indicatifs</strong>, centralisés et
            ajustables : ce ne sont pas des offres commerciales réelles.
          </p>
          <p className="text-muted-foreground">
            Une couche d'intelligence artificielle peut, en option, rédiger une
            synthèse personnalisée. Le service fonctionne intégralement sans
            elle : l'analyse repose avant tout sur une logique transparente.
          </p>
        </section>

        <section className="rounded-lg border bg-secondary/40 p-6">
          <h2 className="text-xl font-bold">Transparence sur notre modèle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Le conseil est gratuit. Si, à l'avenir, nous ajoutons des liens
            partenaires ou d'affiliation, ils seront systématiquement signalés de
            façon claire et n'influenceront jamais l'ordre de nos
            recommandations.
          </p>
        </section>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/questionnaire">Tester le conseil maintenant</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
