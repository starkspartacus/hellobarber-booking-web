import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BOOKING_WEB_BASE ??
      "https://koup-booking-web.vercel.app",
  ),
  title: "KOUP — Réservation en ligne",
  description:
    "Réservez un rendez-vous ou commandez en boutique via le lien public de votre salon KOUP.",
  openGraph: {
    title: "KOUP — Réservation en ligne",
    description:
      "Prenez rendez-vous ou commandez chez votre salon via votre lien KOUP.",
    siteName: "KOUP Booking",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "KOUP" }],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-outline/30 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} KOUP · HelloBarber
        </footer>
      </body>
    </html>
  );
}
