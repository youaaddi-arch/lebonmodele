import { Label } from "@/components/ui/label";
import { InfoBulle } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Ligne de champ standardisée : libellé + aide contextuelle optionnelle.
 */
export function Champ({
  label,
  aide,
  htmlFor,
  children,
  className,
}: {
  label: string;
  aide?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {aide ? <InfoBulle texte={aide} /> : null}
      </div>
      {children}
    </div>
  );
}

/**
 * Bouton-option réutilisable (style « pilule ») pour les choix simples et
 * multiples. Accessible : c'est un vrai bouton avec aria-pressed.
 */
export function OptionPilule({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
