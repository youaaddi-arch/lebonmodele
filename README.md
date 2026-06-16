# LeBonModèle

**Conseil neutre et indépendant à l'achat automobile.** Un site qui aide à
répondre à deux questions difficiles : *quel modèle de voiture est fait pour
moi ?* et *comment l'acquérir (comptant, crédit, LOA ou LLD) ?*

Le site n'est pas un vendeur, c'est un conseiller. Il repose sur un
questionnaire, un moteur de recommandation déterministe et un comparateur de
financement.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + composants façon **shadcn/ui** (Radix UI)
- **Mobile-first**, responsive et accessible
- Déploiement visé : **Vercel**
- Couche IA **optionnelle** via l'API Anthropic (le site fonctionne sans clé)

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Architecture

```
app/
  page.tsx                              Accueil (proposition de valeur, CTA)
  questionnaire/page.tsx                Wizard multi-étapes
  resultats/page.tsx                    Modèles recommandés + comparateur
  guides/loa-lld-credit-comptant/       Guide pédagogique SEO
  a-propos/                             Positionnement, indépendance, méthode
  mentions-legales/ , confidentialite/  Pages légales (RGPD)
  api/recommander/route.ts              Couche IA optionnelle (serveur uniquement)
components/
  ui/                                   Primitives (button, card, slider…)
  layout/                               Header, footer
  questionnaire/                        Wizard + étapes
  resultats/                            Carte modèle, comparateur financement
  cookie-banner.tsx                     Consentement RGPD
lib/
  types.ts                              Types métier centraux
  scoring.ts                            Moteur de recommandation déterministe
  financement.ts                        Calculateur comptant/crédit/LOA/LLD
  questionnaire-store.tsx               État du wizard (contexte + sessionStorage)
  utils.ts                              Utilitaires (cn, format €)
data/
  vehicules.json                        Catalogue de 36 modèles
config/
  financement.ts                        ⚠️ Paramètres financiers INDICATIFS à ajuster
```

## Points clés

- **Données externalisées** : les caractéristiques des véhicules
  (`data/vehicules.json`) et les paramètres financiers (`config/financement.ts`)
  sont centralisés et faciles à mettre à jour. Rien n'est codé en dur dans les
  composants.
- **Aucune donnée sensible côté client** : la clé `ANTHROPIC_API_KEY` n'est
  utilisée que dans la route API serveur. Sans clé, le site reste pleinement
  fonctionnel grâce au moteur déterministe.
- **Simulations indicatives** : tous les calculs de financement affichent une
  mention « simulation indicative, hors offre commerciale ».

## Couche IA (optionnelle)

Copiez `.env.example` en `.env.local` et renseignez `ANTHROPIC_API_KEY` pour
activer la synthèse personnalisée sur la page de résultats. En l'absence de
clé, la route renvoie 503 et le front masque simplement la synthèse.
