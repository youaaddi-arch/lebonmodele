import Link from "next/link";

import { Logo } from "@/components/brand/logo";

/** Pied de page : liens légaux et rappel d'indépendance. */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/40">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Conseil neutre et indépendant pour choisir la voiture qui vous
              correspond et le bon mode de financement. Nous ne vendons rien.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Le site</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/questionnaire" className="hover:text-foreground">Questionnaire</Link></li>
              <li><Link href="/guides/loa-lld-credit-comptant" className="hover:text-foreground">Guide financement</Link></li>
              <li><Link href="/a-propos" className="hover:text-foreground">À propos & méthode</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Informations légales</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/mentions-legales" className="hover:text-foreground">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-foreground">Confidentialité (RGPD)</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          <p>
            Site de conseil indépendant : nous ne sommes mandatés par aucun
            constructeur ni organisme financier. Les simulations de financement
            sont indicatives et ne constituent pas une offre commerciale.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} LeBonModèle — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
