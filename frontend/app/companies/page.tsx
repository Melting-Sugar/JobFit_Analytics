import Link from "next/link";

import { getCompanies, type Company } from "@/lib/api";

export default async function CompaniesPage() {
  let companies: Company[] = [];
  let loadError = "";

  try {
    companies = await getCompanies();
  } catch {
    loadError = "FastAPI backend に接続できませんでした。backend を起動してから再読み込みしてください。";
  }

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">企業一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          FastAPI バックエンドからダミー企業データを取得して、企業一覧を表示します。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loadError ? (
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 md:col-span-2 xl:col-span-3">
            {loadError}
          </article>
        ) : (
          companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{company.industry}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{company.name}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  #{company.id}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{company.description}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">職種</dt>
                  <dd className="mt-1 font-medium text-slate-900">{company.job_type}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">勤務地</dt>
                  <dd className="mt-1 font-medium text-slate-900">{company.location}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">平均年収</dt>
                  <dd className="mt-1 font-medium text-slate-900">{company.average_salary}</dd>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">月平均残業時間</dt>
                  <dd className="mt-1 font-medium text-slate-900">{company.overtime_hours}h</dd>
                </div>
              </dl>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}