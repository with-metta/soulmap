import type { Metadata } from "next";
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
        </body>
      </html>
    </ClerkProvider>
  );
}
