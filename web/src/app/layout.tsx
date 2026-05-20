import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sapienia - Tutor de IA Acadêmico e Resolutor de Questões",
  description: "Resolva qualquer questão de vestibular, concurso ou faculdade instantaneamente. Tire um print ou cole o enunciado e receba uma explicação passo a passo da nossa Inteligência Artificial.",
  keywords: ["resolutor de questões", "estudos IA", "extensão chrome enem", "vestibular resolver questões", "tutor de física", "tutor de matemática"],
  authors: [{ name: "Sapienia Team" }]
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
