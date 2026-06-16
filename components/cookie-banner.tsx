"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

/**
 * Bannière de consentement RGPD.
 * Le refus est aussi simple que l'acceptation (deux boutons équivalents).
 * Aucun cookie de mesure n'est déposé tant que le choix n'est pas fait.
 */
const STORAGE_KEY = "lebonmodele:consentement-cookies";

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  function enregistrer(choix: "accepte" | "refuse") {
    try {
      localStorage.setItem(STORAGE_KEY, choix);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-card p-4 shadow-lg animate-fade-in"
    >
      <div className="container flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Nous utilisons uniquement des cookies nécessaires au bon
          fonctionnement du site. Avec votre accord, nous pourrions ajouter une
          mesure d'audience anonyme pour améliorer le service. Vous pouvez
          refuser sans conséquence sur votre navigation.
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" onClick={() => enregistrer("refuse")}>
            Refuser
          </Button>
          <Button size="sm" onClick={() => enregistrer("accepte")}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
