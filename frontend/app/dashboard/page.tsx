const metrics = [
  { label: "企業一覧", value: "26" },
  { label: "相性スコア（平均）", value: "--" },
  { label: "応募管理中", value: "--" },
  { label: "面接進行中", value: "--" },
];

export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">ダッシュボード</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          推薦結果、応募状況、注目指標を俯瞰するためのプレースホルダーです。
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
          "条件満足度の推移（プレースホルダー）",
          "キャリア適合度の比較（プレースホルダー）",
          "配属・案件不確実性の分布（プレースホルダー）",
          "情報開示の少なさの分布（プレースホルダー）",
        ].map((item) => (
          <article key={item} className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}