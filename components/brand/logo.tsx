import { cn } from "@/lib/utils";

/**
 * Marque (icône seule) de LeBonModèle : un médaillon noir épuré contenant une
 * silhouette de voiture, avec un point d'accent bleu pétrole discret. Style
 * monochrome premium, dans l'esprit des grandes marques automobiles.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="LeBonModèle"
      fill="none"
    >
      <rect width="48" height="48" rx="10" className="fill-primary" />

      {/* Silhouette de voiture (vue avant 3/4) */}
      <g
        transform="translate(9.5 12) scale(1.1)"
        className="stroke-primary-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 17h2c.55 0 1-.45 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.45-1.1-.7-1.8-.7H5c-.6 0-1.15.35-1.4.9L2.2 10.8A3.6 3.6 0 0 0 2 12v4c0 .55.45 1 1 1h2" />
        <circle cx="7" cy="17" r="2" className="fill-primary-foreground" stroke="none" />
        <circle cx="17" cy="17" r="2" className="fill-primary-foreground" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Logo complet : marque + nom. Utilisé dans l'en-tête et le pied de page.
 */
export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8", markClassName)} />
      <span className="font-display text-lg font-bold tracking-tight">
        LeBonModèle
      </span>
    </span>
  );
}
