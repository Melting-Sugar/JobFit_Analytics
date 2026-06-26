export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Company detail</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Company {params.id}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This route will later load a selected company from the backend and display fit score breakdown,
          company characteristics, and application notes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Industry", "Placeholder"],
          ["Job type", "Placeholder"],
          ["Location", "Placeholder"],
          ["Fit score", "Placeholder"],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-slate-950">Next implementation step</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Connect this page to <span className="font-semibold text-slate-900">GET /companies/{"{id}"}</span>
          and render the company profile from the JSON-backed API.
        </p>
      </section>
    </main>
  );
}