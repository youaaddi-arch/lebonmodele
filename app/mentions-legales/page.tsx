import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site LeBonModèle.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Mentions légales</h1>
        <p className="text-sm text-muted-foreground">
          Les informations ci-dessous sont des modèles à compléter avant toute
          mise en production.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Éditeur du site</h2>
          <p className="text-muted-foreground">
            LeBonModèle — [raison sociale], [forme juridique], [capital social].
            Siège social : [adresse]. SIREN : [numéro]. Directeur de la
            publication : [nom].
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">E-mail : [adresse e-mail de contact].</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p className="text-muted-foreground">
            Site hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
            États-Unis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
          <p className="text-muted-foreground">
            L'ensemble des contenus de ce site est protégé. Toute reproduction
            sans autorisation est interdite.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Nature du service</h2>
          <p className="text-muted-foreground">
            LeBonModèle fournit un service de conseil et d'information. Il n'est
            ni vendeur de véhicules, ni intermédiaire en opérations de banque ou
            en financement. Les recommandations et simulations sont fournies à
            titre indicatif et ne constituent pas une offre commerciale ni un
            conseil financier personnalisé au sens réglementaire.
          </p>
        </section>
      </article>
    </div>
  );
}
