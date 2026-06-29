"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getStreak } from "@/lib/db";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/values", label: "Values" },
  { href: "/insights", label: "Insights" },
];

export function Nav() {
  const pathname = usePathname();
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    // Recompute on every navigation so a fresh entry updates the counter.
    getStreak().then(setStreak).catch(() => setStreak(null));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 border-b border-black/8 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="heading mr-3 text-lg font-semibold text-sage-dark"
          >
            SoulMap
          </Link>
          {TABS.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-sage-light text-sage-dark"
                    : "text-ink-soft hover:bg-black/4"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        {streak !== null && streak > 0 && (
          <span
            className="rounded-full bg-warm-light px-3 py-1 text-sm text-warm-dark"
            title="Consecutive days journaling"
          >
            🔥 {streak}-day streak
          </span>
        )}
      </nav>
    </header>
  );
}
