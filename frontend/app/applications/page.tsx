const stages = ["Applied", "Interviewing", "Offer", "Rejected"];

export default function ApplicationsPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Applications</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This page will become the application progress hub for tracking many companies at once.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {stages.map((stage) => (
          <article key={stage} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">{stage}</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Placeholder company card</div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Placeholder company card</div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}