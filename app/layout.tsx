import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Customizando o título e descrição que aparecem na aba do navegador
export const metadata: Metadata = {
  title: "ERP - Sistema de Gestão Inteligente",
  description: "Plataforma de controle financeiro e gerenciamento multi-tenant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-zinc-950 text-zinc-50 dark`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-sm md:text-base selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}