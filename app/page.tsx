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
import { urlImageVehicule } from "@/lib/vehicule-image";
import { PlaqueScanner } from "@/components/immatriculation/plaque-scanner";

/** SUV grand public 2025 affichés en fond de la bannière d'accueil. */
const SUV_2025 = [
  { id: "dacia-duster", marque: "Dacia", modele: "Duster" },
  { id: "peugeot-3008", marque: "Peugeot", modele: "3008" },
  { id: "tesla-model-y", marque: "Tesla", modele: "Model Y" },
  { id: "renault-austral", marque: "Renault", modele: "Austral" },
  { id: "volkswagen-tiguan", marque: "Volkswagen", modele: "Tiguan" },
];

/** Page d'accueil : proposition de valeur, méthode en 3 étapes, CTA. */
export default function AccueilPage() {
  const etapes = [
    {
      icone: ClipboardList,
      titre: "Vous répondez",
      texte:
        "Un questionnaire court sur votre budget, vos trajets et vos priorités. Aucune connaissance auto requise.",
    },
    {
      icone: Car,
      titre: "On analyse",
      texte:
        "Notre moteur croise vos réponses avec un catalogue de modèles populaires pour ne garder que ceux faits pour vous.",
    },
    {
      icone: Wallet,
      titre: "Vous décidez",
      texte:
        "Une short-list de voitures et une comparaison comptant / crédit / LOA / LLD pour choisir sereinement.",
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
      {/* Héro : banderole noire transparente sur fond de SUV grand public 2025 */}
      <section className="relative overflow-hidden border-b border-border bg-[#0E0F12]">
        {/* Fond : modèles SUV 2025 */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
          {SUV_2025.map((v) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={v.id}
              src={urlImageVehicule(v, { angle: "23" })}
              alt=""
              aria-hidden="true"
              className="h-[48%] w-auto max-w-[42%] -mx-6 object-contain opacity-[0.28] drop-shadow-2xl md:h-[58%] md:opacity-40"
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E0F12] via-[#0E0F12]/80 to-[#0E0F12]/40" />

        <div className="container relative py-20 md:py-28">
          {/* Banderole noire transparente */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/45 p-8 text-center shadow-2xl backdrop-blur-md md:p-12">
            <p className="eyebrow flex items-center justify-center gap-2 text-primary">
              <span className="h-px w-8 bg-primary" />
              Le conseil auto, enfin clair
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-6xl">
              Trouvez la bonne voiture.
              <br />
              <span className="text-gradient">Vérifiez avant d'acheter.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Que vous n'y connaissiez rien ou que vous soyez passionné,
              LeBonModèle vous dit quel modèle vous correspond, ce qu'il vaut
              vraiment et comment le financer au mieux — sans jargon, sans rien
              vous vendre.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/questionnaire">
                  Trouver ma voiture
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/immatriculation">Scanner une plaque</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Gratuit · Sans engagement · Environ 3 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Bannière scanner de plaque : grille en transparence sur fond image */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(https://cdn.imagin.studio/getImage?customer=hrjavascript-mastery&make=peugeot&modelFamily=3008&angle=23&zoomType=fullscreen&fileType=png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />

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
            <PlaqueScanner variante="sombre" />
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

      {/* Section financement — bande contrastée */}
      <section className="border-y border-border bg-card">
        <div className="container grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary">Comptant · Crédit · LOA · LLD</p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Le bon modèle ne suffit pas. Le bon financement change tout.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
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

      {/* CTA final */}
      <section className="container pb-24">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
            <h2 className="max-w-2xl text-4xl font-bold md:text-5xl">
              Prêt à trouver la voiture faite pour vous ?
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              Quelques questions suffisent. Vous obtenez une short-list de
              modèles et une comparaison de financement personnalisée.
            </p>
            <Button asChild size="lg">
              <Link href="/questionnaire">
                Démarrer le questionnaire
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
