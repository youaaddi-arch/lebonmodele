import { Check, Info, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEuros } from "@/lib/utils";
import { PARAMS_FINANCEMENT } from "@/config/financement";
import type { ComparatifFinancement, ResultatFinancement } from "@/lib/types";

/**
 * Comparateur des 4 modes de financement.
 * - Desktop : tableau côte à côte.
 * - Mobile : cartes empilées.
 * Le mode recommandé est mis en évidence.
 */
export function ComparateurFinancement({ comparatif }: { comparatif: ComparatifFinancement }) {
  const { resultats, modeRecommande, justification, dureeMois } = comparatif;

  return (
    <div className="space-y-5">
      {/* Recommandation mise en avant */}
      <Card className="border-accent/40 bg-accent/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Star className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="font-semibold">
              Mode conseillé pour votre profil :{" "}
              <span className="text-accent">{libelleCourt(modeRecommande)}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{justification}</p>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Estimations sur une durée de <strong>{dureeMois} mois</strong> environ.
      </p>

      {/* Vue mobile : cartes empilées */}
      <div className="grid gap-4 md:hidden">
        {resultats.map((r) => (
          <CarteFinancement key={r.mode} r={r} recommande={r.mode === modeRecommande} />
        ))}
      </div>

      {/* Vue desktop : tableau */}
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50 text-left">
              <th className="p-4 font-semibold">Critère</th>
              {resultats.map((r) => (
                <th key={r.mode} className="p-4 font-semibold">
                  <span className="flex items-center gap-2">
                    {libelleCourt(r.mode)}
                    {r.mode === modeRecommande ? (
                      <Badge variant="accent" className="text-[10px]">
                        Conseillé
                      </Badge>
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Ligne titre="Mensualité estimée">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">
                  {r.mensualite ? `${formatEuros(r.mensualite)} / mois` : "—"}
                </td>
              ))}
            </Ligne>
            <Ligne titre="Apport / versement initial">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">{formatEuros(r.apport)}</td>
              ))}
            </Ligne>
            <Ligne titre="Coût total estimé">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4 font-semibold">{formatEuros(r.coutTotal)}</td>
              ))}
            </Ligne>
            <Ligne titre="Dont intérêts / surcoût">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">
                  {r.coutInterets !== undefined ? formatEuros(r.coutInterets) : "—"}
                </td>
              ))}
            </Ligne>
            <Ligne titre="Option d'achat (valeur résiduelle)">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">
                  {r.optionAchat !== undefined ? formatEuros(r.optionAchat) : "—"}
                </td>
              ))}
            </Ligne>
            <Ligne titre="Propriétaire à la fin ?">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">{r.proprietaireFin ? "Oui" : "Non"}</td>
              ))}
            </Ligne>
            <Ligne titre="Entretien inclus ?">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">{r.inclusEntretien ? "Oui" : "Non"}</td>
              ))}
            </Ligne>
            <Ligne titre="Plafond kilométrique">
              {resultats.map((r) => (
                <td key={r.mode} className="p-4">
                  {r.plafondKm ? `${r.plafondKm.toLocaleString("fr-FR")} km/an` : "Illimité"}
                </td>
              ))}
            </Ligne>
          </tbody>
        </table>
      </div>

      {/* Mention légale obligatoire */}
      <p className="flex items-start gap-2 rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {PARAMS_FINANCEMENT.mentionLegale}
      </p>
    </div>
  );
}

function Ligne({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <tr className="border-b last:border-0">
      <th className="p-4 text-left font-medium text-muted-foreground">{titre}</th>
      {children}
    </tr>
  );
}

function CarteFinancement({ r, recommande }: { r: ResultatFinancement; recommande: boolean }) {
  return (
    <Card className={recommande ? "border-accent/50 bg-accent/5" : undefined}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{r.libelle}</h4>
          {recommande ? <Badge variant="accent">Conseillé</Badge> : null}
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {r.mensualite ? (
            <p className="text-lg font-bold">{formatEuros(r.mensualite)} <span className="text-sm font-normal text-muted-foreground">/ mois</span></p>
          ) : (
            <p className="text-lg font-bold">{formatEuros(r.coutTotal)} <span className="text-sm font-normal text-muted-foreground">au comptant</span></p>
          )}
          <ul className="space-y-1.5">
            {r.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function libelleCourt(mode: string): string {
  switch (mode) {
    case "comptant":
      return "Comptant";
    case "credit":
      return "Crédit auto";
    case "loa":
      return "LOA";
    case "lld":
      return "LLD";
    default:
      return mode;
  }
}
