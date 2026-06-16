import Link from "next/link";
import { Car } from "lucide-react";

import { Button } from "@/components/ui/button";

/** En-tête de navigation principal, présent sur toutes les pages. */
export function Header() {
  const liens = [
    { href: "/questionnaire", label: "Le questionnaire" },
    { href: "/guides/loa-lld-credit-comptant", label: "Guide financement" },
    { href: "/a-propos", label: "À propos" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span>
            LeBon<span className="text-primary">Modèle</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {lien.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm">
          <Link href="/questionnaire">Trouver ma voiture</Link>
        </Button>
      </div>
    </header>
  );
}
