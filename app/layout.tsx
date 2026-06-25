import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Eventify — Discover Events Near You",
    template: "%s | Eventify",
  },
  description:
    "Eventify helps you discover, register for, and attend the best events in your city. Browse music, tech, food, art and more.",
  keywords: ["events", "discover events", "local events", "tickets", "Peshawar events"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eventify",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
