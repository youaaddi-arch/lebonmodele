import { cn } from "@/lib/utils";

/**
 * Silhouette de voiture (SUV) dessinée en SVG, sans aucun filigrane.
 * Sert de visuel propre quand les vraies photos ne sont pas disponibles
 * (clé d'images non configurée). La couleur suit `currentColor`.
 */
export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 260"
      className={cn("fill-current", className)}
      role="img"
      aria-label="Silhouette de voiture"
    >
      <path d="M50,150 C50,132 64,130 86,128 L150,126 C176,96 214,84 268,84 L372,84 C424,86 462,104 492,130 L548,136 C566,138 574,144 574,158 L574,196 L50,196 Z" />
      <circle cx="168" cy="196" r="42" />
      <circle cx="452" cy="196" r="42" />
    </svg>
  );
}
