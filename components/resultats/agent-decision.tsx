"use client";

import * as React from "react";
import { Sparkles, Workflow } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DecisionAgent } from "@/lib/agent/graph";
import type { ProfilUtilisateur } from "@/lib/types";

const LABEL_MODE: Record<string, string> = {
  comptant: "Comptant",
  credit: "Crédit auto",
  loa: "LOA",
  lld: "LLD",
};

/**
 * Carte « décision de l'agent » : interroge l'agent LangGraph (/api/agent),
 * qui orchestre l'analyse du profil, le choix du modèle et du financement,
 * puis affiche sa décision et sa synthèse.
 */
export function AgentDecision({ profil }: { profil: ProfilUtilisateur }) {
  const [decision, setDecision] = React.useState<DecisionAgent | null>(null);
  const [synthese, setSynthese] = React.useState<string>("");
  const [chargement, setChargement] = React.useState(true);
  const fait = React.useRef(false);

  React.useEffect(() => {
    if (fait.current) return;
    fait.current = true;
    fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profil }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setDecision(d.decision ?? null);
        setSynthese(d.synthese ?? "");
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [profil]);

  if (!chargement && !decision && !synthese) return null;

  return (
    <Card className="border-foreground/15 bg-secondary/40">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
            <Workflow className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display font-bold">La décision de l'agent</p>
            <p className="text-xs text-muted-foreground">Analyse orchestrée de votre profil</p>
          </div>
        </div>

        {chargement ? (
          <p className="text-sm text-muted-foreground">L'agent analyse votre profil…</p>
        ) : (
          <>
            {decision ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge>{decision.modele.marque} {decision.modele.modele}</Badge>
                <span className="text-muted-foreground">financement conseillé :</span>
                <Badge variant="accent">{LABEL_MODE[decision.financement] ?? decision.financement}</Badge>
              </div>
            ) : null}
            {synthese ? (
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="whitespace-pre-line">{synthese}</span>
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
