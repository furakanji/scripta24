import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Scripta24 | Ogni giorno una storia nuova",
  description: "SCRIPTA24 - OGNI GIORNO UNA STORIA NUOVA",
  openGraph: {
    title: "Scripta24",
    description: "SCRIPTA24 - OGNI GIORNO UNA STORIA NUOVA",
    siteName: "Scripta24",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${lora.variable} ${inter.variable} font-serif antialiased bg-paper text-ink`}
      >
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
