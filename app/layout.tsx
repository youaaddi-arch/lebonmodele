import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "LeBonModèle — Trouvez la voiture et le financement faits pour vous",
    template: "%s · LeBonModèle",
  },
  description:
    "Conseil neutre et indépendant : répondez à quelques questions et découvrez les modèles de voiture adaptés à votre profil, ainsi que le meilleur mode d'acquisition (comptant, crédit, LOA, LLD).",
  keywords: [
    "conseil achat voiture",
    "quelle voiture choisir",
    "LOA LLD crédit comptant",
    "comment financer une voiture",
  ],
  openGraph: {
    title: "LeBonModèle — Conseil neutre à l'achat automobile",
    description:
      "La voiture parfaite pour vous, et le bon mode de financement. Gratuit et indépendant.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
