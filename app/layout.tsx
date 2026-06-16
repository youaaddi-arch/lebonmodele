import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "LeBonModèle — Trouvez la bonne voiture, vérifiez avant d'acheter",
    template: "%s · LeBonModèle",
  },
  description:
    "Le conseil auto de référence, neutre et indépendant : découvrez quel modèle vous correspond, vérifiez sa fiabilité et ses points faibles, et trouvez le meilleur financement (comptant, crédit, LOA, LLD). En clair, sans jargon.",
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
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
