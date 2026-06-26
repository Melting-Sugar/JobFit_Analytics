import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

const navItems = [
  { href: "/companies", label: "Companies" },
  { href: "/preferences", label: "Preferences" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/lab", label: "Lab" },
];

export const metadata: Metadata = {
  title: "JobFit Analytics",
  description: "Job hunting analytics prototype for students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen font-sans text-slate-900 antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-3xl border border-white/70 bg-white/80 px-6 py-5 shadow-soft backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                  JobFit Analytics
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                  Job hunting fit score prototype
                </h1>
              </div>
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-10 border-t border-slate-200/70 pt-4 text-sm text-slate-500">
            Portfolio prototype for job hunting students. Dummy data first, database later.
          </footer>
        </div>
      </body>
    </html>
  );
}