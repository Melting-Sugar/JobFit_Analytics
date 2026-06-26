import { notFound } from "next/navigation";

import { getCompanyById } from "@/lib/api";

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const companyId = Number(params.id);

  if (!Number.isFinite(companyId)) {
    notFound();
  }

  let company;

  try {
    company = await getCompanyById(companyId);
  } catch {
    return (
      <main className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">企業詳細</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Company {companyId}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            FastAPI バックエンドに接続できませんでした。backend を起動してから再読み込みしてください。
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">企業詳細</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">{company.name}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{company.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["業界", company.industry],
          ["職種", company.job_type],
          ["勤務地", company.location],
          ["応募管理", "バックエンド連携済み"],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["平均年収", `${company.average_salary}`],
          ["年間休日", `${company.annual_holidays}`],
          ["月平均残業時間", `${company.overtime_hours}h`],
          ["リモート適性", `${company.remote_score}`],
          ["安定性", `${company.stability_score}`],
          ["成長性", `${company.growth_score}`],
          ["AI・データ活用", `${company.ai_data_score}`],
          ["自己成長環境", `${company.self_development_score}`],
          ["リスク指標", `SES ${company.ses_risk_score} / 情報 ${company.information_risk_score}`],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">応募管理</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              この企業を応募管理に追加するためのプレースホルダです。
            </p>
          </div>
          <button className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
            応募管理に追加
          </button>
        </div>
      </section>
    </main>
  );
}