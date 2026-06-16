"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Champ, OptionPilule } from "./field";
import { useQuestionnaire } from "@/lib/questionnaire-store";
import {
  CRITERES,
  type Carrosserie,
  type Critere,
  type Energie,
  type UsagePrincipal,
} from "@/lib/types";
import { formatEuros } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Étape 1 — Budget
// ---------------------------------------------------------------------------
export function EtapeBudget() {
  const { profil, update } = useQuestionnaire();
  return (
    <div className="space-y-6">
      <Champ
        label="Comment raisonnez-vous ?"
        aide="Choisissez selon votre façon de penser votre budget : une enveloppe globale, ou ce que vous pouvez consacrer chaque mois."
      >
        <div className="flex flex-wrap gap-3">
          <OptionPilule
            active={profil.modeBudget === "total"}
            onClick={() => update({ modeBudget: "total" })}
          >
            Je raisonne en budget total
          </OptionPilule>
          <OptionPilule
            active={profil.modeBudget === "mensualite"}
            onClick={() => update({ modeBudget: "mensualite" })}
          >
            Je raisonne en mensualité
          </OptionPilule>
        </div>
      </Champ>

      {profil.modeBudget === "total" ? (
        <Champ
          label="Budget total"
          htmlFor="budgetTotal"
          aide="Le montant maximum que vous pouvez mettre dans la voiture, achat comptant ou crédit compris."
        >
          <div className="flex items-center gap-3">
            <Input
              id="budgetTotal"
              type="number"
              min={0}
              step={500}
              value={profil.budgetTotal ?? ""}
              onChange={(e) => update({ budgetTotal: Number(e.target.value) })}
              className="max-w-[200px]"
            />
            <span className="text-sm text-muted-foreground">
              {profil.budgetTotal ? formatEuros(profil.budgetTotal) : "—"}
            </span>
          </div>
        </Champ>
      ) : (
        <Champ
          label="Mensualité maximale"
          htmlFor="mensualiteMax"
          aide="Ce que vous pouvez consacrer chaque mois (crédit, LOA ou LLD)."
        >
          <div className="flex items-center gap-3">
            <Input
              id="mensualiteMax"
              type="number"
              min={0}
              step={10}
              value={profil.mensualiteMax ?? ""}
              onChange={(e) => update({ mensualiteMax: Number(e.target.value) })}
              className="max-w-[200px]"
            />
            <span className="text-sm text-muted-foreground">€ / mois</span>
          </div>
        </Champ>
      )}

      <Champ
        label="Apport disponible"
        htmlFor="apport"
        aide="La somme que vous pouvez verser au départ. Un apport réduit les mensualités ou le capital à financer."
      >
        <Input
          id="apport"
          type="number"
          min={0}
          step={500}
          value={profil.apport ?? ""}
          onChange={(e) => update({ apport: Number(e.target.value) })}
          className="max-w-[200px]"
        />
      </Champ>

      <Champ
        label="Avez-vous un véhicule à reprendre ?"
        aide="La reprise de votre voiture actuelle peut financer une partie de l'achat."
      >
        <div className="flex flex-wrap gap-3">
          <OptionPilule active={profil.repriseVehicule} onClick={() => update({ repriseVehicule: true })}>
            Oui
          </OptionPilule>
          <OptionPilule
            active={!profil.repriseVehicule}
            onClick={() => update({ repriseVehicule: false, valeurReprise: undefined })}
          >
            Non
          </OptionPilule>
        </div>
      </Champ>

      {profil.repriseVehicule ? (
        <Champ label="Valeur estimée de la reprise" htmlFor="valeurReprise">
          <Input
            id="valeurReprise"
            type="number"
            min={0}
            step={500}
            value={profil.valeurReprise ?? ""}
            onChange={(e) => update({ valeurReprise: Number(e.target.value) })}
            className="max-w-[200px]"
          />
        </Champ>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Étape 2 — Usage et trajets
// ---------------------------------------------------------------------------
export function EtapeUsage() {
  const { profil, update } = useQuestionnaire();

  const tranchesKm = [
    { id: "moins-5000", label: "< 5 000 km" },
    { id: "5000-10000", label: "5 – 10 000 km" },
    { id: "10000-20000", label: "10 – 20 000 km" },
    { id: "20000-30000", label: "20 – 30 000 km" },
    { id: "plus-30000", label: "> 30 000 km" },
  ] as const;

  const usages: { id: UsagePrincipal; label: string }[] = [
    { id: "quotidien", label: "Quotidien" },
    { id: "famille", label: "Famille" },
    { id: "loisirs", label: "Loisirs / week-end" },
    { id: "professionnel", label: "Professionnel" },
  ];

  function toggleUsage(u: UsagePrincipal) {
    const set = new Set(profil.usages);
    set.has(u) ? set.delete(u) : set.add(u);
    update({ usages: Array.from(set) });
  }

  return (
    <div className="space-y-6">
      <Champ
        label="Kilométrage annuel estimé"
        aide="Le nombre de kilomètres que vous parcourez par an. Critère clé pour le choix de l'énergie et du financement."
      >
        <div className="flex flex-wrap gap-3">
          {tranchesKm.map((t) => (
            <OptionPilule
              key={t.id}
              active={profil.kilometrageAnnuel === t.id}
              onClick={() => update({ kilometrageAnnuel: t.id })}
            >
              {t.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ
        label="Trajet domicile-travail quotidien"
        aide="Indiquez la distance par jour, ou cochez « pas de trajet régulier » si vous n'avez pas de trajet fixe."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="number"
            min={0}
            disabled={profil.pasDeTrajetRegulier}
            placeholder="km / jour"
            value={profil.trajetQuotidienKm ?? ""}
            onChange={(e) => update({ trajetQuotidienKm: Number(e.target.value) })}
            className="max-w-[160px]"
          />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={profil.pasDeTrajetRegulier}
              onCheckedChange={(c) =>
                update({ pasDeTrajetRegulier: c === true, trajetQuotidienKm: undefined })
              }
            />
            Pas de trajet régulier
          </label>
        </div>
      </Champ>

      <Champ label="Type de routes principal">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "ville", label: "Ville" },
            { id: "mixte", label: "Mixte" },
            { id: "route-autoroute", label: "Route / autoroute" },
          ].map((t) => (
            <OptionPilule
              key={t.id}
              active={profil.typeRoute === (t.id as typeof profil.typeRoute)}
              onClick={() => update({ typeRoute: t.id as typeof profil.typeRoute })}
            >
              {t.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Usage principal" aide="Plusieurs choix possibles.">
        <div className="flex flex-wrap gap-3">
          {usages.map((u) => (
            <OptionPilule key={u.id} active={profil.usages.includes(u.id)} onClick={() => toggleUsage(u.id)}>
              {u.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ
        label="Pouvez-vous recharger à domicile ou au travail ?"
        aide="Critère déterminant : sans solution de recharge, l'électrique est rarement pertinent."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { id: "oui", label: "Oui" },
            { id: "non", label: "Non" },
            { id: "ne-sais-pas", label: "Je ne sais pas" },
          ].map((r) => (
            <OptionPilule
              key={r.id}
              active={profil.rechargeDomicile === (r.id as typeof profil.rechargeDomicile)}
              onClick={() => update({ rechargeDomicile: r.id as typeof profil.rechargeDomicile })}
            >
              {r.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Étape 3 — Le véhicule souhaité
// ---------------------------------------------------------------------------
export function EtapeVehicule() {
  const { profil, update } = useQuestionnaire();

  const carrosseries: { id: Carrosserie; label: string }[] = [
    { id: "citadine", label: "Citadine" },
    { id: "berline", label: "Berline" },
    { id: "break", label: "Break" },
    { id: "suv", label: "SUV" },
    { id: "monospace", label: "Monospace" },
    { id: "ludospace", label: "Ludospace / utilitaire" },
  ];

  const energies: { id: Energie; label: string }[] = [
    { id: "essence", label: "Essence" },
    { id: "diesel", label: "Diesel" },
    { id: "hybride", label: "Hybride" },
    { id: "hybride-rechargeable", label: "Hybride rechargeable" },
    { id: "electrique", label: "Électrique" },
  ];

  function toggle<T>(liste: T[], v: T): T[] {
    const set = new Set(liste);
    set.has(v) ? set.delete(v) : set.add(v);
    return Array.from(set);
  }

  return (
    <div className="space-y-6">
      <Champ
        label="Nombre de places nécessaires"
        aide="Pensez à vos besoins réels (famille, covoiturage…)."
      >
        <div className="flex flex-wrap gap-3">
          {[2, 4, 5, 7].map((n) => (
            <OptionPilule
              key={n}
              active={profil.nombrePlaces === n}
              onClick={() => update({ nombrePlaces: n })}
            >
              {n === 7 ? "7+" : n} places
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Besoin de coffre / chargement">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "faible", label: "Faible" },
            { id: "moyen", label: "Moyen" },
            { id: "important", label: "Important" },
          ].map((c) => (
            <OptionPilule
              key={c.id}
              active={profil.besoinCoffre === (c.id as typeof profil.besoinCoffre)}
              onClick={() => update({ besoinCoffre: c.id as typeof profil.besoinCoffre })}
            >
              {c.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Type de carrosserie" aide="Plusieurs choix possibles. Ne rien sélectionner = indifférent.">
        <div className="flex flex-wrap gap-3">
          {carrosseries.map((c) => (
            <OptionPilule
              key={c.id}
              active={profil.carrosseries.includes(c.id)}
              onClick={() => update({ carrosseries: toggle(profil.carrosseries, c.id) })}
            >
              {c.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Énergie souhaitée" aide="Plusieurs choix possibles. Ne rien sélectionner = indifférent.">
        <div className="flex flex-wrap gap-3">
          {energies.map((e) => (
            <OptionPilule
              key={e.id}
              active={profil.energies.includes(e.id)}
              onClick={() => update({ energies: toggle(profil.energies, e.id) })}
            >
              {e.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Boîte de vitesses">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "manuelle", label: "Manuelle" },
            { id: "automatique", label: "Automatique" },
            { id: "indifferent", label: "Indifférent" },
          ].map((b) => (
            <OptionPilule
              key={b.id}
              active={profil.boite === (b.id as typeof profil.boite)}
              onClick={() => update({ boite: b.id as typeof profil.boite })}
            >
              {b.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Neuf ou occasion">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "neuf", label: "Neuf" },
            { id: "occasion-recente", label: "Occasion récente" },
            { id: "indifferent", label: "Indifférent" },
          ].map((etat) => (
            <OptionPilule
              key={etat.id}
              active={profil.etat === (etat.id as typeof profil.etat)}
              onClick={() => update({ etat: etat.id as typeof profil.etat })}
            >
              {etat.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <div className="grid gap-6 sm:grid-cols-2">
        <Champ label="Marques préférées (optionnel)" htmlFor="marquesPref">
          <Input
            id="marquesPref"
            placeholder="ex. Toyota, Peugeot"
            value={profil.marquesPreferees ?? ""}
            onChange={(e) => update({ marquesPreferees: e.target.value })}
          />
        </Champ>
        <Champ label="Marques à éviter (optionnel)" htmlFor="marquesEviter">
          <Input
            id="marquesEviter"
            placeholder="ex. Fiat"
            value={profil.marquesAEviter ?? ""}
            onChange={(e) => update({ marquesAEviter: e.target.value })}
          />
        </Champ>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Étape 4 — Mode d'acquisition et profil
// ---------------------------------------------------------------------------
export function EtapeAcquisition() {
  const { profil, update } = useQuestionnaire();
  return (
    <div className="space-y-6">
      <Champ
        label="Êtes-vous ouvert à la location (LOA / LLD) ?"
        aide="La LOA et la LLD sont des locations. La LOA permet d'acheter la voiture à la fin, la LLD non."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { id: "oui", label: "Oui" },
            { id: "non", label: "Non" },
            { id: "comparer", label: "Je veux comparer" },
          ].map((o) => (
            <OptionPilule
              key={o.id}
              active={profil.ouvertureLocation === (o.id as typeof profil.ouvertureLocation)}
              onClick={() => update({ ouvertureLocation: o.id as typeof profil.ouvertureLocation })}
            >
              {o.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ label="Votre préférence de fond">
        <div className="flex flex-wrap gap-3">
          <OptionPilule
            active={profil.preference === "proprietaire"}
            onClick={() => update({ preference: "proprietaire" })}
          >
            Je veux devenir propriétaire
          </OptionPilule>
          <OptionPilule
            active={profil.preference === "flexibilite"}
            onClick={() => update({ preference: "flexibilite" })}
          >
            Je privilégie la flexibilité
          </OptionPilule>
        </div>
      </Champ>

      <Champ
        label="Combien de temps comptez-vous garder la voiture ?"
        aide="Critère déterminant : une détention courte favorise la location, une détention longue l'achat."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { id: "moins-2", label: "< 2 ans" },
            { id: "2-4", label: "2 à 4 ans" },
            { id: "4-6", label: "4 à 6 ans" },
            { id: "plus-6", label: "> 6 ans" },
          ].map((d) => (
            <OptionPilule
              key={d.id}
              active={profil.dureeDetention === (d.id as typeof profil.dureeDetention)}
              onClick={() => update({ dureeDetention: d.id as typeof profil.dureeDetention })}
            >
              {d.label}
            </OptionPilule>
          ))}
        </div>
      </Champ>

      <Champ
        label={`Importance de la tranquillité (entretien, assurance, garantie inclus) : ${profil.importanceTranquillite}/5`}
        aide="Plus c'est important pour vous, plus la LLD « tout compris » sera intéressante."
      >
        <Slider
          min={1}
          max={5}
          step={1}
          value={[profil.importanceTranquillite]}
          onValueChange={(v) => update({ importanceTranquillite: v[0] })}
          className="max-w-md"
        />
        <div className="flex max-w-md justify-between text-xs text-muted-foreground">
          <span>Faible</span>
          <span>Forte</span>
        </div>
      </Champ>

      <Champ
        label="Votre profil"
        aide="Les professionnels peuvent bénéficier d'avantages fiscaux avec la LOA / LLD."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { id: "particulier", label: "Particulier" },
            { id: "tns", label: "Travailleur indépendant (TNS)" },
            { id: "societe", label: "Société" },
          ].map((p) => (
            <OptionPilule
              key={p.id}
              active={profil.profilAcheteur === (p.id as typeof profil.profilAcheteur)}
              onClick={() => update({ profilAcheteur: p.id as typeof profil.profilAcheteur })}
            >
              {p.label}
            </OptionPilule>
          ))}
        </div>
        {profil.profilAcheteur !== "particulier" ? (
          <p className="mt-2 rounded-md bg-accent/10 p-3 text-sm text-accent-foreground/90">
            💡 En tant que professionnel, la LOA/LLD peut offrir des avantages
            fiscaux (loyers déductibles, TVA partiellement récupérable). Nous en
            tiendrons compte dans nos recommandations.
          </p>
        ) : null}
      </Champ>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Étape 5 — Priorités (classement par ordre d'importance)
// ---------------------------------------------------------------------------
export function EtapePriorites() {
  const { profil, update } = useQuestionnaire();
  const ordre = profil.prioritesOrdre;

  function deplacer(index: number, sens: -1 | 1) {
    const cible = index + sens;
    if (cible < 0 || cible >= ordre.length) return;
    const copie = [...ordre];
    [copie[index], copie[cible]] = [copie[cible], copie[index]];
    update({ prioritesOrdre: copie });
  }

  const labels = Object.fromEntries(CRITERES.map((c) => [c.id, c.label])) as Record<Critere, string>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Classez les critères du plus important (en haut) au moins important (en
        bas). Ce classement pondère directement nos recommandations.
      </p>
      <ol className="space-y-2">
        {ordre.map((c, i) => (
          <li
            key={c}
            className="flex items-center justify-between rounded-lg border bg-card p-3"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="font-medium">{labels[c]}</span>
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                aria-label={`Monter ${labels[c]}`}
                onClick={() => deplacer(i, -1)}
                disabled={i === 0}
                className="rounded p-1.5 hover:bg-secondary disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Descendre ${labels[c]}`}
                onClick={() => deplacer(i, 1)}
                disabled={i === ordre.length - 1}
                className="rounded p-1.5 hover:bg-secondary disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fin — E-mail optionnel + consentement RGPD
// ---------------------------------------------------------------------------
export function EtapeEmail() {
  const { profil, update } = useQuestionnaire();
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Vous y êtes presque ! Vous pouvez recevoir vos résultats par e-mail,
        c'est entièrement optionnel : vos recommandations s'affichent dans tous
        les cas à l'étape suivante.
      </p>

      <Champ label="Votre e-mail (optionnel)" htmlFor="email">
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.fr"
          value={profil.email ?? ""}
          onChange={(e) => update({ email: e.target.value })}
          className="max-w-md"
        />
      </Champ>

      <label className="flex max-w-xl items-start gap-3 text-sm">
        <Checkbox
          checked={profil.consentementEmail}
          onCheckedChange={(c) => update({ consentementEmail: c === true })}
          className="mt-0.5"
        />
        <span className="text-muted-foreground">
          J'accepte de recevoir mes résultats et des conseils par e-mail.
          J'ai compris que je peux me désinscrire à tout moment et que mes
          données sont traitées conformément à la{" "}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>
          . (Case non pré-cochée, consentement libre.)
        </span>
      </label>
    </div>
  );
}
