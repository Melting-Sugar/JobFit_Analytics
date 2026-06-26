import Link from "next/link";

const highlights = [
  {
    title: "Company fit analysis",
    description: "Compare company data and user preferences to surface fit scores.",
  },
  {
    title: "Application tracking",
    description: "Track applied, interviewing, offer, and rejected companies in one place.",
  },
  {
    title: "Data-oriented portfolio",
    description: "Showcase AI, statistics, analytics, and database product thinking.",
  },
];

const roadmap = [
  "Backend API with dummy JSON data",
  "Frontend page scaffold for all core routes",
  "Preference capture and basic fit score UX",
  "SQLite storage and PostgreSQL-ready data design",
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 px-6 py-14 text-white shadow-soft sm:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            MVP scaffold
          </span>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Find better-fit companies and manage the whole job search flow.
          </h2>
          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            This prototype is designed for job-hunting students who need to compare many companies,
            understand fit at a glance, and track multiple application pipelines without losing context.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/companies"
              className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Browse companies
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">What this app demonstrates</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "AI-oriented product thinking",
              "Statistics and data analysis",
              "Modern web application development",
              "Database-backed product architecture",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">MVP roadmap</h3>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            {roadmap.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                  {index + 1}
                </span>
                <span className="pt-1">{item}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}