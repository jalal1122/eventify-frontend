import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: {
    default: "Nextt Event — Discover Events Near You",
    template: "%s | Nextt Event",
  },
  description:
    "Nextt Event helps you discover, register for, and attend the best events in your city. Browse music, tech, food, art and more.",
  keywords: ["events", "discover events", "local events", "tickets", "Peshawar events"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nextt Event",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
