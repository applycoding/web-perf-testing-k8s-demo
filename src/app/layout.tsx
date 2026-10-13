import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { CartDialog } from "@/components/CartDialog";
import { CartProvider } from "@/components/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VitalsReporterSlot } from "@/components/VitalsReporterSlot";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Northline",
    template: "%s · Northline",
  },
  description:
    "Field goods chosen for weight and weather. A storefront demo of Core Web Vitals, accessibility, experiments, and Kubernetes delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDialog />
        </CartProvider>
        <VitalsReporterSlot />
      </body>
    </html>
  );
}
