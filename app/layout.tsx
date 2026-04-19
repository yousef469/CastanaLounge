import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import BodyWrapper from "@/components/BodyWrapper";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Castana Lounge",
  description: "A unique dining experience at Castana Lounge in Jeddah",
  icons: {
    icon: "/hero-pizza.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={`${cairo.variable} ${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/hero-pizza.png" type="image/png" />
      </head>
      <body>
        <LanguageProvider>
          <BodyWrapper>
            {children}
          </BodyWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
