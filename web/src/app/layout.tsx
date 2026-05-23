import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sapienia.calculadoraunivesp.com.br"),
  title: {
    default: "Sapienia - Tutor de IA Acadêmico e Resolutor de Questões",
    template: "%s | Sapienia"
  },
  description: "Resolva qualquer questão de vestibular, concurso ou faculdade instantaneamente. Tire um print ou cole o enunciado e receba uma explicação passo a passo da nossa Inteligência Artificial.",
  keywords: [
    "resolutor de questões",
    "estudos IA",
    "extensão chrome enem",
    "vestibular resolver questões",
    "tutor de física",
    "tutor de matemática",
    "gabaritar exatas",
    "resolução por imagem"
  ],
  authors: [{ name: "Sapienia Team" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sapienia - Tutor de IA Acadêmico e Resolutor de Questões",
    description: "Resolva qualquer questão de vestibular, concurso ou faculdade instantaneamente. Tire um print ou cole o enunciado e receba uma explicação passo a passo da nossa Inteligência Artificial.",
    url: "https://sapienia.calculadoraunivesp.com.br",
    siteName: "Sapienia",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapienia - Tutor de IA Acadêmico e Resolutor de Questões",
    description: "Resolva qualquer questão de vestibular, concurso ou faculdade instantaneamente. Tire um print ou cole o enunciado e receba uma explicação passo a passo da nossa Inteligência Artificial.",
  },
  verification: {
    google: "google-site-verification-placeholder", // Substituir pelo código real do console
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
