import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shruhi Collections — Haute Ethnic & Curvy Couture (S to 6XL)",
  description: "Official digital flagship of Shruhi Collections. 59 luxury Surat ethnic suits, curvy couture (S to 6XL) & menswear. Surat loom direct WhatsApp concierge.",
  metadataBase: new URL("https://www.shruhicollections.in"),
  openGraph: {
    title: "Shruhi Collections — Haute Ethnic & Curvy Couture (S to 6XL)",
    description: "59 Signature 4K Studio Designs (MRP ₹850 – ₹3,550). Tailored Sizes S to 6XL. 24/7 WhatsApp Concierge.",
    url: "https://www.shruhicollections.in",
    siteName: "Shruhi Collections Surat",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable} font-sans antialiased bg-ivory text-neutral-900 selection:bg-oxblood-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
