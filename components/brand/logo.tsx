import { cn } from "@/lib/utils";

/**
 * Marque (icône seule) de LeBonModèle : un badge en dégradé violet→cyan
 * contenant une silhouette de voiture et une étincelle « bon choix ».
 * Le dégradé reçoit un id unique pour pouvoir afficher plusieurs logos
 * sur la même page sans conflit de <defs>.
 */
export function LogoMark({
  className,
  id = "lbm",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="LeBonModèle"
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.55" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="13" fill={`url(#${id}-bg)`} />

      {/* Silhouette de voiture (style trait, basée sur une vue avant 3/4) */}
      <g
        transform="translate(9.5 11) scale(1.1)"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 17h2c.55 0 1-.45 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.45-1.1-.7-1.8-.7H5c-.6 0-1.15.35-1.4.9L2.2 10.8A3.6 3.6 0 0 0 2 12v4c0 .55.45 1 1 1h2" />
        <circle cx="7" cy="17" r="2" fill="#ffffff" stroke="none" />
        <circle cx="17" cy="17" r="2" fill="#ffffff" stroke="none" />
      </g>

      {/* Étincelle « bon choix » */}
      <path
        d="M35 12.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"
        fill="#ffffff"
      />
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
      <LogoMark className={cn("h-9 w-9", markClassName)} />
      <span className="font-display text-lg font-bold tracking-tight">
        LeBon<span className="text-gradient">Modèle</span>
      </span>
    </span>
  );
}
