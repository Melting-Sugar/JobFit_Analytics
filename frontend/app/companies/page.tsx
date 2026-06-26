import Link from "next/link";

const previewCards = [
  { label: "Backend source", value: "/companies" },
  { label: "Seed data", value: "Company A to Company Z" },
  { label: "Primary focus", value: "Compare fit, not just list companies" },
];

export default function CompaniesPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Companies</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This page will eventually fetch company records from the FastAPI backend and render fit scores,
          industries, job types, and risk indicators.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {previewCards.map((card) => (
          <article key={card.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Company detail cards",
          "Fit score comparison view",
          "Filter and sort controls",
          "Risk and stability indicators",
          "Salary and overtime metrics",
          "Backend-powered data table",
        ].map((item) => (
          <article key={item} className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            {item}
          </article>
        ))}
      </section>

      <div>
        <Link href="/companies/1" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          Open a sample company detail page
        </Link>
      </div>
    </main>
  );
}