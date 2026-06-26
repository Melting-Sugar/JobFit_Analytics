export default function LabPage() {
  const experiments = [
    "Fit score formula experiments",
    "Pandas analysis notebook preview",
    "Future scikit-learn model ideas",
    "User preference weighting tests",
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Lab</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This is a sandbox for analysis ideas, scoring experiments, and future ML-oriented features.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {experiments.map((item) => (
          <article key={item} className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}