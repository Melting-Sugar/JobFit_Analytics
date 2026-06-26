export default function PreferencesPage() {
  const items = [
    "Desired industry",
    "Preferred job type",
    "Remote work preference",
    "Salary range",
    "Work-life balance priority",
    "Growth and learning priority",
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Preferences</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This page will capture user preferences that later influence the fit score calculation.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Placeholder control for the MVP scaffold.</p>
          </article>
        ))}
      </section>
    </main>
  );
}