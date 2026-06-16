import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

/** En-tête de navigation principal, présent sur toutes les pages. */
export function Header() {
  const liens = [
    { href: "/questionnaire", label: "Le questionnaire" },
    { href: "/guides/loa-lld-credit-comptant", label: "Guide financement" },
    { href: "/a-propos", label: "À propos" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label="Accueil LeBonModèle">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
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
