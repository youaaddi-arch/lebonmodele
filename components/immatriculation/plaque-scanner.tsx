"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { normaliserPlaque } from "@/lib/immatriculation/types";

/**
 * Scanner de plaque : champ stylé « plaque française ». À la validation, on
 * redirige vers la page dédiée /immatriculation/<plaque> qui affiche la fiche
 * technique complète du véhicule.
 */
export function PlaqueScanner({ variante = "clair" }: { variante?: "clair" | "sombre" }) {
  const router = useRouter();
  const [plaque, setPlaque] = React.useState("");
  const [enRoute, setEnRoute] = React.useState(false);
  const sombre = variante === "sombre";

  function rechercher(e: React.FormEvent) {
    e.preventDefault();
    const p = normaliserPlaque(plaque);
    if (p.length < 5) return;
    setEnRoute(true);
    router.push(`/immatriculation/${encodeURIComponent(p)}`);
  }

  return (
    <form onSubmit={rechercher} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-1 overflow-hidden rounded-lg border-2 border-foreground/80 bg-white shadow-sm">
        <span className="flex w-10 flex-col items-center justify-center bg-[#003399] text-[10px] font-bold text-white">
          <span className="text-yellow-300">★</span>
          F
        </span>
        <input
          value={plaque}
          onChange={(e) => setPlaque(e.target.value)}
          placeholder="GW-279-AF"
          aria-label="Plaque d'immatriculation"
          maxLength={12}
          className="w-full bg-white px-4 py-3 text-center font-display text-2xl font-bold uppercase tracking-widest text-black placeholder:text-black/30 focus:outline-none"
        />
      </div>
      <Button type="submit" size="lg" disabled={enRoute} variant={sombre ? "accent" : "default"}>
        {enRoute ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        Identifier
      </Button>
    </form>
  );
}
