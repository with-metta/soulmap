import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "SoulMap — Soul-Searching",
  description:
    "A calm space for quiet reflection, values discovery, and honest insight.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="min-h-full bg-cream text-ink">
          <Nav />
          <main className="mx-auto w-full max-w-3xl px-5 py-8">{children}</main>
          <footer className="mx-auto w-full max-w-3xl px-5 py-6 border-t border-black/8 flex items-center justify-between">
            <span className="text-xs text-ink-muted">© 2026 SoulMap</span>
            <Link href="/privacy" className="text-xs text-ink-muted hover:text-ink-soft transition-colors">
              Privacy Policy
            </Link>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
