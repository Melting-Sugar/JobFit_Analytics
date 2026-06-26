const metrics = [
  { label: "Total companies", value: "26" },
  { label: "Average fit score", value: "--" },
  { label: "Tracked applications", value: "--" },
  { label: "Open interviews", value: "--" },
];

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          The analytics dashboard will combine company data, preferences, and application status into a
          compact overview.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {[
          "Top fit companies chart",
          "Industry distribution chart",
          "Location distribution chart",
          "Application pipeline summary",
        ].map((item) => (
          <article key={item} className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}