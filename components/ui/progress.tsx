"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Barre de progression simple (sans dépendance Radix).
 * @param value progression en pourcentage (0 → 100)
 */
function Progress({
  value,
  className,
  ...props
}: { value: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export { Progress };
