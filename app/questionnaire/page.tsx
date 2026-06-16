"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { QuestionnaireProvider } from "@/lib/questionnaire-store";
import { Wizard } from "@/components/questionnaire/wizard";

/**
 * Page du questionnaire. Le paramètre ?etape=N permet de revenir directement
 * sur une étape précise (modification depuis la page résultats).
 */
function QuestionnaireContenu() {
  const params = useSearchParams();
  const etapeParam = Number(params.get("etape"));
  const etapeInitiale = Number.isFinite(etapeParam) ? etapeParam : 0;

  return (
    <QuestionnaireProvider>
      <div className="container py-10 md:py-14">
        <Wizard etapeInitiale={etapeInitiale} />
      </div>
    </QuestionnaireProvider>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Chargement…</div>}>
      <QuestionnaireContenu />
    </Suspense>
  );
}
