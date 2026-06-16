import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité (RGPD)",
  description:
    "Politique de confidentialité du site LeBonModèle : quelles données sont collectées, pourquoi, et comment exercer vos droits.",
};

export default function ConfidentialitePage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground">
          Cette politique décrit le traitement de vos données personnelles
          conformément au Règlement Général sur la Protection des Données (RGPD).
          Document à faire valider juridiquement avant mise en production.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Données collectées</h2>
          <p className="text-muted-foreground">
            Les réponses au questionnaire sont traitées <strong>localement dans
            votre navigateur</strong> (stockage de session) pour calculer vos
            recommandations. Elles ne sont pas envoyées à un serveur, sauf si
            vous activez la synthèse par intelligence artificielle.
          </p>
          <p className="text-muted-foreground">
            Si vous renseignez votre adresse e-mail et cochez le consentement
            correspondant, celle-ci est utilisée uniquement pour vous envoyer vos
            résultats et des conseils. Ce champ est facultatif et n'est jamais
            pré-coché.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Finalités et base légale</h2>
          <p className="text-muted-foreground">
            Le traitement repose sur votre consentement (e-mail) et sur l'intérêt
            légitime de fournir un service de conseil. Aucune donnée n'est vendue
            à des tiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p className="text-muted-foreground">
            Seuls les cookies nécessaires au fonctionnement sont déposés par
            défaut. Toute mesure d'audience éventuelle n'est activée qu'avec votre
            accord, et le refus est aussi simple que l'acceptation via la bannière
            de consentement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Durée de conservation</h2>
          <p className="text-muted-foreground">
            Les réponses du questionnaire sont effacées à la fermeture de l'onglet
            (stockage de session). Une adresse e-mail communiquée est conservée
            jusqu'à votre désinscription.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Vos droits</h2>
          <p className="text-muted-foreground">
            Vous disposez d'un droit d'accès, de rectification, d'effacement,
            d'opposition et de portabilité de vos données. Pour les exercer,
            contactez-nous à [adresse e-mail]. Vous pouvez également introduire une
            réclamation auprès de la CNIL.
          </p>
        </section>
      </article>
    </div>
  );
}
