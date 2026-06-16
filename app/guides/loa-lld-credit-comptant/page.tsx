import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "LOA, LLD, crédit ou comptant : comment financer sa voiture ?",
  description:
    "Guide clair pour comprendre la différence entre LOA, LLD, crédit auto et achat comptant. Avantages, inconvénients et à qui s'adresse chaque mode de financement automobile.",
};

/** Bloc descriptif d'un mode de financement. */
function ModeSection({
  id,
  titre,
  definition,
  cible,
  avantages,
  inconvenients,
}: {
  id: string;
  titre: string;
  definition: string;
  cible: string;
  avantages: string[];
  inconvenients: string[];
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold">{titre}</h2>
      <p className="mt-3 text-muted-foreground">{definition}</p>
      <p className="mt-3">
        <strong>À qui ça s'adresse :</strong> {cible}
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-accent">Avantages</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {avantages.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-accent">+</span>
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-destructive">Inconvénients</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {inconvenients.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-destructive">−</span>
                  {i}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function GuideFinancementPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-medium text-primary">Guide pédagogique</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            LOA, LLD, crédit ou comptant : comment financer sa voiture ?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Acheter ou louer ? Devenir propriétaire ou privilégier la
            tranquillité ? On vous explique simplement les quatre grands modes
            de financement automobile pour choisir en connaissance de cause.
          </p>
        </header>

        {/* Sommaire */}
        <nav className="mt-8 rounded-lg border bg-secondary/40 p-5" aria-label="Sommaire">
          <p className="font-semibold">Au sommaire</p>
          <ul className="mt-3 grid gap-2 text-sm text-primary sm:grid-cols-2">
            <li><a href="#comptant" className="hover:underline">1. L'achat comptant</a></li>
            <li><a href="#credit" className="hover:underline">2. Le crédit auto</a></li>
            <li><a href="#loa" className="hover:underline">3. La LOA</a></li>
            <li><a href="#lld" className="hover:underline">4. La LLD</a></li>
            <li><a href="#tableau" className="hover:underline">5. Tableau récapitulatif</a></li>
          </ul>
        </nav>

        <div className="prose mt-10 max-w-none space-y-12">
          <ModeSection
            id="comptant"
            titre="1. L'achat comptant"
            definition="Vous payez la totalité du prix de la voiture immédiatement, avec votre épargne. Vous en êtes propriétaire dès le premier jour, sans intérêt ni loyer."
            cible="Les personnes disposant de la trésorerie nécessaire, qui gardent leur voiture longtemps et veulent éviter tout coût de financement."
            avantages={[
              "Aucun intérêt ni frais de financement.",
              "Propriétaire immédiatement, liberté totale (kilométrage, revente).",
              "Budget simple : pas de mensualité à suivre.",
            ]}
            inconvenients={[
              "Grosse sortie de trésorerie d'un coup.",
              "Vous supportez l'intégralité de la décote du véhicule.",
              "Épargne immobilisée, moins disponible pour les imprévus.",
            ]}
          />

          <ModeSection
            id="credit"
            titre="2. Le crédit auto"
            definition="Un organisme vous prête la somme nécessaire, que vous remboursez par mensualités sur une durée déterminée (souvent 12 à 72 mois), avec des intérêts (exprimés en TAEG). À la fin, la voiture est à vous."
            cible="Ceux qui veulent devenir propriétaires sans mobiliser toute leur épargne, et qui gardent la voiture plusieurs années."
            avantages={[
              "Vous devenez propriétaire à la fin du remboursement.",
              "Effort financier lissé dans le temps.",
              "Aucune limite de kilométrage, vous faites ce que vous voulez du véhicule.",
            ]}
            inconvenients={[
              "Coût total supérieur au prix comptant (intérêts).",
              "Engagement sur plusieurs années.",
              "Vous supportez la décote, comme pour le comptant.",
            ]}
          />

          <ModeSection
            id="loa"
            titre="3. La LOA (Location avec Option d'Achat)"
            definition="Vous louez la voiture pendant 2 à 5 ans en payant un loyer mensuel (souvent avec un premier loyer majoré). À la fin, vous choisissez : rendre la voiture, ou l'acheter en payant la valeur résiduelle (l'option d'achat) fixée au départ. Un plafond kilométrique s'applique."
            cible="Ceux qui hésitent à garder ou non la voiture, veulent une mensualité maîtrisée, et apprécient de rouler dans un véhicule récent."
            avantages={[
              "Liberté en fin de contrat : rendre ou acheter.",
              "Mensualités souvent inférieures à un crédit classique.",
              "Possibilité de changer régulièrement de voiture.",
            ]}
            inconvenients={[
              "Plafond kilométrique : les dépassements sont facturés.",
              "Frais possibles en cas de restitution avec usure anormale.",
              "Au total, racheter la voiture revient souvent plus cher qu'un crédit.",
            ]}
          />

          <ModeSection
            id="lld"
            titre="4. La LLD (Location Longue Durée)"
            definition="Vous louez la voiture sur une durée définie avec un loyer mensuel souvent « tout compris » (entretien, assistance, parfois assurance). À la fin, vous restituez le véhicule : il n'y a pas d'option d'achat."
            cible="Ceux qui ont un kilométrage prévisible, changent régulièrement de voiture et veulent un budget mensuel fixe et tranquille, ainsi que les professionnels (avantages fiscaux)."
            avantages={[
              "Budget tout compris et prévisible (entretien souvent inclus).",
              "Tranquillité : vous ne vous occupez ni de la revente ni de la décote.",
              "Avantages fiscaux possibles pour les professionnels.",
            ]}
            inconvenients={[
              "Vous ne devenez jamais propriétaire.",
              "Plafond kilométrique avec surcoût en cas de dépassement.",
              "Engagement ferme : résilier avant terme coûte cher.",
            ]}
          />

          {/* Tableau récapitulatif */}
          <section id="tableau" className="scroll-mt-24">
            <h2 className="text-2xl font-bold">5. Tableau récapitulatif</h2>
            <div className="mt-5 overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50 text-left">
                    <th className="p-3 font-semibold">Critère</th>
                    <th className="p-3 font-semibold">Comptant</th>
                    <th className="p-3 font-semibold">Crédit</th>
                    <th className="p-3 font-semibold">LOA</th>
                    <th className="p-3 font-semibold">LLD</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Propriétaire", "Oui", "Oui (à la fin)", "Optionnel", "Non"],
                    ["Mensualité", "Non", "Moyenne", "Maîtrisée", "Tout compris"],
                    ["Apport initial", "Total", "Faible/moyen", "1er loyer", "Faible"],
                    ["Plafond km", "Non", "Non", "Oui", "Oui"],
                    ["Entretien inclus", "Non", "Non", "Option", "Souvent oui"],
                    ["Idéal si…", "Trésorerie + long terme", "Posséder sans tout payer", "Hésitation", "Km prévisible + changement régulier"],
                  ].map((ligne) => (
                    <tr key={ligne[0]} className="border-b last:border-0">
                      <th className="p-3 text-left font-medium text-muted-foreground">{ligne[0]}</th>
                      {ligne.slice(1).map((cellule, i) => (
                        <td key={i} className="p-3">{cellule}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Ce tableau présente des tendances générales. Les conditions réelles
              dépendent de chaque offre. Nos simulations sont indicatives et ne
              constituent pas une offre commerciale.
            </p>
          </section>
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="text-2xl font-bold">Quel mode est fait pour vous ?</h2>
            <p className="max-w-md text-primary-foreground/80">
              On analyse vos besoins, on vous trouve la voiture idéale et on vous
              recommande le mode de financement le plus adapté, chiffres à l'appui.
            </p>
            <Button asChild variant="accent" size="lg">
              <Link href="/questionnaire">Obtenir mon conseil personnalisé</Link>
            </Button>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
