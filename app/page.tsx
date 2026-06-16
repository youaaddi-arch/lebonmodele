import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Car,
  Wallet,
  ShieldCheck,
  Scale,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehiculeImage } from "@/components/ui/vehicule-image";

/** Page d'accueil : proposition de valeur, méthode en 3 étapes, CTA. */
export default function AccueilPage() {
  const etapes = [
    {
      icone: ClipboardList,
      titre: "1. Vous répondez",
      texte:
        "Un questionnaire court sur votre budget, vos trajets et vos priorités. Aucune connaissance auto requise.",
    },
    {
      icone: Car,
      titre: "2. On analyse",
      texte:
        "Notre moteur croise vos réponses avec un catalogue de modèles populaires pour ne garder que ceux faits pour vous.",
    },
    {
      icone: Wallet,
      titre: "3. Vous décidez",
      texte:
        "Une short-list de voitures + une comparaison personnalisée comptant / crédit / LOA / LLD pour choisir sereinement.",
    },
  ];

  const atouts = [
    {
      icone: ShieldCheck,
      titre: "100 % indépendant",
      texte: "Aucun constructeur ne nous mandate. On conseille, on ne vend pas.",
    },
    {
      icone: Scale,
      titre: "Modèle ET financement",
      texte: "La seule approche qui répond aux deux vraies questions en même temps.",
    },
    {
      icone: Sparkles,
      titre: "Simple et gratuit",
      texte: "Des explications en langage clair, sans jargon, en quelques minutes.",
    },
  ];

  return (
    <>
      {/* Section héro */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="blob -left-20 top-0 h-72 w-72 bg-primary/30" />
        <div className="blob right-0 top-32 h-80 w-80 bg-accent/20" />
        <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          {/* Colonne texte */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Conseil neutre et indépendant
            </span>
            <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">
              La voiture parfaite pour vous,
              <br />
              <span className="text-gradient">et le bon financement.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
              Choisir un modèle et décider entre comptant, crédit, LOA ou LLD,
              c'est compliqué. On vous guide pas à pas, sans rien vous vendre,
              pour trouver la solution réellement adaptée à votre situation.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg">
                <Link href="/questionnaire">
                  Trouver ma voiture
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/guides/loa-lld-credit-comptant">
                  Comprendre LOA, LLD & crédit
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Gratuit · Sans engagement · Environ 3 minutes
            </p>
          </div>

          {/* Colonne visuel : voiture mise en avant */}
          <div className="group relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent blur-3xl" />
            <Card className="gradient-border overflow-hidden border-none shadow-2xl">
              <VehiculeImage
                vehicule={{ id: "peugeot-3008", marque: "Peugeot", modele: "3008" }}
                alt="Exemple de modèle recommandé"
                className="aspect-[4/3] w-full"
              />
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Exemple de recommandation</p>
                  <p className="font-display text-lg font-semibold">Peugeot 3008 · Hybride</p>
                </div>
                <span className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-lg font-bold">94</span>
                  <span className="text-[9px] uppercase">/100</span>
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bande de chiffres clés */}
      <section className="border-b border-white/10">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            { chiffre: "36", label: "modèles analysés" },
            { chiffre: "4", label: "modes de financement comparés" },
            { chiffre: "100%", label: "indépendant" },
            { chiffre: "0 €", label: "gratuit, sans engagement" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-gradient md:text-4xl">
                {s.chiffre}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Méthode en 3 étapes */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Comment ça marche ?</h2>
          <p className="mt-3 text-muted-foreground">
            Trois étapes pour passer du doute à une décision éclairée.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {etapes.map((etape) => (
            <Card key={etape.titre} className="card-hover text-center">
              <CardContent className="pt-8">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30">
                  <etape.icone className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{etape.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{etape.texte}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Atouts */}
      <section className="relative overflow-hidden border-y border-white/10 bg-card/30">
        <div className="blob -right-10 top-0 h-72 w-72 bg-primary/15" />
        <div className="container py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {atouts.map((atout) => (
              <div key={atout.titre} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <atout.icone className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-semibold">{atout.titre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{atout.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container py-20">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary via-violet-600 to-accent text-primary-foreground">
          <div className="blob -left-10 -top-10 h-60 w-60 bg-white/20" />
          <div className="blob -bottom-10 right-0 h-60 w-60 bg-accent/30" />
          <CardContent className="relative flex flex-col items-center gap-6 p-10 text-center md:p-16">
            <h2 className="max-w-xl text-3xl font-bold">
              Prêt à trouver la voiture faite pour vous ?
            </h2>
            <p className="max-w-xl text-primary-foreground/80">
              Quelques questions suffisent. Vous obtenez une short-list de
              modèles et une comparaison de financement personnalisée.
            </p>
            <Button asChild size="lg" variant="accent">
              <Link href="/questionnaire">
                Démarrer le questionnaire
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
