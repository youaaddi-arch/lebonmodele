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

import { ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehiculeImage } from "@/components/ui/vehicule-image";
import { CarSilhouette } from "@/components/ui/car-silhouette";
import { PlaqueScanner } from "@/components/immatriculation/plaque-scanner";

/** Page d'accueil : proposition de valeur, méthode en 3 étapes, CTA. */
export default function AccueilPage() {
  const etapes = [
    {
      icone: ClipboardList,
      titre: "Vous décrivez vos besoins",
      texte:
        "Votre budget, vos trajets, le nombre de places, les modèles ou énergies que vous aimez. En quelques clics, sans jargon.",
    },
    {
      icone: Car,
      titre: "On trouve vos voitures idéales",
      texte:
        "Notre moteur croise vos critères avec un catalogue de modèles populaires et ne retient que ceux vraiment faits pour vous.",
    },
    {
      icone: Wallet,
      titre: "Et le bon financement, en bonus",
      texte:
        "Une fois la voiture trouvée, on vous indique aussi le meilleur mode d'acquisition (comptant, crédit, LOA, LLD).",
    },
  ];

  const atouts = [
    {
      icone: Scale,
      titre: "La voiture qu'il VOUS faut",
      texte: "On part de vos besoins et de votre budget, pas d'un catalogue à écouler.",
    },
    {
      icone: ShieldCheck,
      titre: "100 % indépendant",
      texte: "Aucun constructeur ne nous mandate. On conseille, on ne vend pas.",
    },
    {
      icone: Sparkles,
      titre: "Simple et gratuit",
      texte: "Des explications en langage clair, sans jargon, en quelques minutes.",
    },
  ];

  return (
    <>
      {/* Héro sombre : ancre visuelle, silhouettes discrètes en fond */}
      <section className="relative overflow-hidden border-b border-border bg-[#0d1117] text-white">
        {/* Fond : silhouettes (sans filigrane) */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-2 opacity-[0.07]">
          <CarSilhouette className="hidden h-[42%] w-auto text-white sm:block" />
          <CarSilhouette className="h-[52%] w-auto text-white" />
          <CarSilhouette className="hidden h-[42%] w-auto text-white sm:block" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,hsl(158_72%_30%/0.18),transparent_70%)]" />

        <div className="container relative py-20 text-center md:py-28">
          <p className="eyebrow flex items-center justify-center gap-2 text-accent">
            <span className="h-px w-8 bg-accent" />
            Votre voiture idéale, selon vous
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
            Trouvez la voiture{" "}
            <span className="text-gradient">qu'il vous faut vraiment.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Dites-nous vos besoins, votre budget et les modèles que vous aimez :
            on vous trouve les voitures faites pour vous. Et, en bonus, le
            meilleur moyen de les financer — sans jargon, sans rien vous vendre.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/questionnaire">
                Trouver ma voiture idéale
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/immatriculation">Scanner une plaque</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-white/60">
            Gratuit · Sans engagement · Environ 3 minutes
          </p>
        </div>
      </section>

      {/* Bannière scanner de plaque */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        <CarSilhouette className="pointer-events-none absolute -right-10 bottom-0 hidden h-3/4 w-auto text-foreground/[0.05] lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-50" />

        <div className="container relative grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow flex items-center gap-2 text-primary">
              <ScanLine className="h-4 w-4" />
              Scanner de plaque
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Déjà une voiture en vue ? Vérifiez-la.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Saisissez la plaque : marque, version, énergie, puissance, CO₂,
              VIN… toute la fiche technique en un instant.
            </p>
          </div>
          <div>
            <PlaqueScanner />
          </div>
        </div>
      </section>

      {/* Bande de chiffres clés */}
      <section className="border-b border-border">
        <div className="container grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            { chiffre: "36", label: "modèles analysés" },
            { chiffre: "4", label: "modes de financement" },
            { chiffre: "100 %", label: "indépendant" },
            { chiffre: "0 €", label: "gratuit, sans engagement" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-10 text-center">
              <p className="font-display text-4xl font-extrabold md:text-5xl">{s.chiffre}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Méthode en 3 étapes */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">La méthode</p>
          <h2 className="mt-4 text-4xl font-bold">Du doute à la décision, en 3 étapes</h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {etapes.map((etape, i) => (
            <div key={etape.titre} className="bg-card p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <etape.icone className="h-6 w-6" />
                </span>
                <span className="font-display text-5xl font-extrabold text-border">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{etape.titre}</h3>
              <p className="mt-2 text-muted-foreground">{etape.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section financement — bande sombre contrastée */}
      <section className="border-y border-border bg-[#0d1117] text-white">
        <div className="container grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-accent">Comptant · Crédit · LOA · LLD</p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Le bon modèle ne suffit pas. Le bon financement change tout.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Selon la durée pendant laquelle vous gardez la voiture, votre
              apport et votre profil, l'écart entre acheter et louer se chiffre
              en milliers d'euros. Nous comparons les quatre modes côte à côte,
              clairement.
            </p>
            <Button asChild size="lg" variant="accent" className="mt-10">
              <Link href="/questionnaire">
                Comparer pour mon profil
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <VehiculeImage
              vehicule={{ id: "peugeot-508", marque: "Peugeot", modele: "508" }}
              alt="Comparaison de financement"
              className="aspect-[4/3] w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Vérifier avant d'acheter */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Avant de signer</p>
          <h2 className="mt-4 text-4xl font-bold">Vérifiez avant d'acheter</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une belle annonce cache parfois un mauvais plan. Pour chaque modèle
            recommandé, on vous donne l'essentiel pour décider en confiance.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              titre: "Fiabilité notée",
              texte:
                "La réputation mécanique du modèle, résumée d'un coup d'œil : ce qui tient dans le temps, ce qui pose souci.",
            },
            {
              titre: "Points faibles connus",
              texte:
                "Les défauts récurrents et limites à connaître avant l'achat, dits clairement — pas seulement les qualités.",
            },
            {
              titre: "Cote et juste prix",
              texte:
                "La fourchette de prix neuf et occasion pour savoir si une offre est intéressante ou surévaluée.",
            },
          ].map((b) => (
            <Card key={b.titre} className="card-hover border-border">
              <CardContent className="p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{b.titre}</h3>
                <p className="mt-2 text-muted-foreground">{b.texte}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Atouts */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-3">
          {atouts.map((atout) => (
            <div key={atout.titre}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border">
                <atout.icone className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{atout.titre}</h3>
              <p className="mt-2 text-muted-foreground">{atout.texte}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA final — bande sombre */}
      <section className="container pb-24 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1117] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_50%_0%,hsl(158_72%_30%/0.25),transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
            <h2 className="max-w-2xl text-4xl font-bold md:text-5xl">
              Prêt à trouver la voiture faite pour vous ?
            </h2>
            <p className="max-w-xl text-lg text-white/70">
              Dites-nous vos besoins : on vous trouve les voitures idéales, et le
              meilleur financement en bonus.
            </p>
            <Button asChild size="lg" variant="accent">
              <Link href="/questionnaire">
                Trouver ma voiture idéale
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
