import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "COD Manager",
  description: "Gestion des commandes COD au Maroc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/* 
        Les classes 'bg-background text-foreground font-sans' sont CRUCIALES.
        Elles appliquent les variables CSS définies dans ton globals.css.
        Sans elles, tu auras un fond blanc par défaut et une police Times New Roman.
      */}
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}